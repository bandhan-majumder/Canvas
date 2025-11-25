import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

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

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const servers: WebSocket[] = [];
const messageRateLimits = new Map<WebSocket, RateLimitEntry>();
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

function isRateLimited(ws: WebSocket): boolean {
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

wss.on("connection", function (ws, req) {
  const clientIP = getClientIP(req);

  const currentConnections = connectionCounts.get(clientIP) || 0;

  if (currentConnections >= MAX_CONNECTIONS_PER_IP) {
    ws.close(1008, "Too many connections from this IP");
    return;
  }

  connectionCounts.set(clientIP, currentConnections + 1);

  ws.on("error", console.error);
  servers.push(ws);

  ws.on("message", function message(data) {
    if (isRateLimited(ws)) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Rate limit exceeded. Please slow down.",
        })
      );
      return;
    }

    const messageStr = data.toString();

    // for debugging
    if (messageStr === "ping") {
      ws.send(JSON.stringify({ type: "pong from ws-relayer" }));
      return;
    }

    servers.forEach((s) => {
      if (s.readyState === WebSocket.OPEN) {
        s.send(messageStr);
      }
    });
  });

  ws.on("close", () => {
    const currentCount = connectionCounts.get(clientIP) || 0;
    if (currentCount <= 1) {
      connectionCounts.delete(clientIP);
    } else {
      connectionCounts.set(clientIP, currentCount - 1);
    }

    messageRateLimits.delete(ws);

    const index = servers.indexOf(ws);
    if (index !== -1) {
      servers.splice(index, 1);
    }
  });
});

server.listen(PORT, () => {
  console.log(`HTTP + WebSocket relayer server running on port ${PORT}`);
});