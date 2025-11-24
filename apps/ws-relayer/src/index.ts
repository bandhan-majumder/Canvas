import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

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

const servers: WebSocket[] = [];

wss.on("connection", function (ws) {
  ws.on("error", console.error);
  servers.push(ws);

  ws.on("message", function message(data) {
    const messageStr = data.toString();

    servers.forEach((s) => {
      if (s.readyState === WebSocket.OPEN) {
        s.send(messageStr);
      }
    });
  });

  ws.on("close", () => {
    const index = servers.indexOf(ws);
    if (index !== -1) {
      servers.splice(index, 1);
    }
  });
});

server.listen(PORT, () => {
  console.log(`HTTP + WebSocket relayer server running on port ${PORT}`);
});
