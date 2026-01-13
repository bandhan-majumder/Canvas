import { WebSocket as WebSocketType, WebSocketServer } from "ws";
import http from "http";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const RELAYER_URL = process.env.RELAYER_URL;

const RATE_LIMIT_WINDOW_MS = 1000; 
const MAX_MESSAGES_PER_WINDOW = 100; 
const MAX_CONNECTIONS_PER_IP = 10;

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

const wss = new WebSocketServer({ server });

interface Room {
  sockets: WebSocketType[];
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rooms: Record<string, Room> = {};
const messageRateLimits = new Map<WebSocketType, RateLimitEntry>();
const connectionCounts = new Map<string, number>();

function getClientIP(req: http.IncomingMessage): string {
  const forwarded = req.headers["x-forwarded-for"];
  const ipFromHeader =
    Array.isArray(forwarded) ? forwarded[0] : typeof forwarded === "string" ? forwarded : undefined;

  if (ipFromHeader) {
    const first = (ipFromHeader.split(",")[0] || "").trim();
    if (first) return first;
  }

  return req.socket.remoteAddress || "unknown";
}

function isRateLimited(ws: WebSocketType): boolean {
  const now = Date.now();
  const limit = messageRateLimits.get(ws);

  if (!limit || now > limit.resetTime) {
    messageRateLimits.set(ws, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (limit.count >= MAX_MESSAGES_PER_WINDOW) {
    return true;
  }

  limit.count++;
  return false;
}

setInterval(() => {
  const now = Date.now();
  for (const [ws, limit] of messageRateLimits.entries()) {
    if (now > limit.resetTime) {
      messageRateLimits.delete(ws);
    }
  }
}, RATE_LIMIT_WINDOW_MS);

const relayerSocket = new WebSocketType(
  RELAYER_URL ? RELAYER_URL : "ws://localhost:8080",
);

relayerSocket.on("open", () => {
  console.log("Connected to relayer");
});

relayerSocket.on("error", (error) => {
  console.error("Relayer connection error:", error);
});

relayerSocket.on("close", () => {
  console.log("Disconnected from relayer.");
});

relayerSocket.on("message", (data) => {
  try {
    const parsedData = JSON.parse(data.toString());

    if (parsedData.type === "chat") {
      const room = parsedData.room;
      if (rooms[room]) {
        rooms[room].sockets.forEach((s) => {
          if (s.readyState === WebSocketType.OPEN) {
            s.send(data.toString());
          }
        });
      }
    } else if (parsedData.type === "clear-room") {
      const room = parsedData.room;
      if (rooms[room]) {
        rooms[room].sockets.forEach((s) => {
          if (s.readyState === WebSocketType.OPEN) {
            s.send(data.toString());
            s.close();
          }
        });
        delete rooms[room];
      }
    }
  } catch (error) {
    console.error("Error parsing message from relayer:", error);
  }
});

wss.on("connection", function (ws, req) {
  const clientIP = getClientIP(req);
  
  const currentConnections = connectionCounts.get(clientIP) || 0;
  
  if (currentConnections >= MAX_CONNECTIONS_PER_IP) {
    ws.close(1008, "Too many connections from this IP");
    return;
  }

  connectionCounts.set(clientIP, currentConnections + 1);

  ws.on("error", console.error);

  ws.on("message", function message(data: Buffer) {
    if (isRateLimited(ws)) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Rate limit exceeded. Please slow down.",
        })
      );
      return;
    }

    try {
      const parsedData = JSON.parse(data.toString());

      // for debugging
      if (parsedData.type === "ping") {
        ws.send(JSON.stringify({ type: "pong from ws-backend" }));
        return;
      }

      if (parsedData.type === "join-room") {
        const room = parsedData.room;

        if (!rooms[room]) {
          rooms[room] = {
            sockets: [],
          };
        }

        rooms[room].sockets.push(ws);
      } else if (parsedData.type === "chat") {
        if (relayerSocket.readyState === WebSocketType.OPEN) {
          relayerSocket.send(data.toString());
        } else {
          console.error("Relayer socket is not open");
        }
      }
    } catch (error) {
      console.error("Error parsing message from client:", error);
    }
  });

  ws.on("close", () => {
    const currentCount = connectionCounts.get(clientIP) || 0;
    if (currentCount <= 1) {
      connectionCounts.delete(clientIP);
    } else {
      connectionCounts.set(clientIP, currentCount - 1);
    }

    messageRateLimits.delete(ws);

    Object.keys(rooms).forEach((room) => {
      const roomObj = rooms[room];
      if (!roomObj) return;
      const index = roomObj.sockets.indexOf(ws);
      if (index !== -1) {
        roomObj.sockets.splice(index, 1);

        if (roomObj.sockets.length === 0) {
          delete rooms[room];
        }
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`HTTP + WebSocket server running on port ${PORT}`);
});
