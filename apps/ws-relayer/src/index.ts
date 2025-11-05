import { WebSocket, WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT ? Number(process.env.PORT) : 8080 });

const servers: WebSocket[] = [];

wss.on('connection', function (ws) {
    ws.on('error', console.error);
    servers.push(ws);
    
    ws.on('message', function message(data) {
        
        const messageStr = data.toString();
        
        servers.forEach(s => {
            if (s.readyState === WebSocket.OPEN) {
                s.send(messageStr);
            }
        });
    });
    
    ws.on('close', () => {
        const index = servers.indexOf(ws);
        if (index !== -1) {
            servers.splice(index, 1);
        }
    });
});

console.log(`Relayer WebSocket server running on port ${process.env.PORT || 8080}`);