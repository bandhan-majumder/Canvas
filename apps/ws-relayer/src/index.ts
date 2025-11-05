import { WebSocket, WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
dotenv.config();


const wss = new WebSocketServer({ port: process.env.PORT ? Number(process.env.PORT) : 8080 });

const servers: WebSocket[] = [];

wss.on('connection', function (ws) {
    ws.on('error', console.error);
    servers.push(ws);
    ws.on('message', function message(data: string) {
        servers.map(s => s.send(data));
    })
})