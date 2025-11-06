import { WebSocket as WebSocketType, WebSocketServer } from 'ws';
import http from 'http';
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8081;

const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const wss = new WebSocketServer({ server });

interface Room {
    sockets: WebSocketType[]
}

const rooms: Record<string, Room> = {};

const relayerSocket = new WebSocketType(process.env.RELAYER_URL ? process.env.RELAYER_URL : "ws://localhost:8080");

relayerSocket.on('open', () => {
    console.log('Connected to relayer');
});

relayerSocket.on('error', (error) => {
    console.error('Relayer connection error:', error);
});

relayerSocket.on('close', () => {
    console.log('Disconnected from relayer. Attempting to reconnect...');
});

relayerSocket.on('message', (data) => {
    try {
        const parsedData = JSON.parse(data.toString());
        
        if (parsedData.type === 'chat') {
            const room = parsedData.room;
            if (rooms[room]) {
                rooms[room].sockets.forEach(s => {
                    if (s.readyState === WebSocketType.OPEN) {
                        s.send(data.toString());
                    }
                });
            }
        } else if (parsedData.type === 'clear-room') {
            const room = parsedData.room;
            if (rooms[room]) {
                rooms[room].sockets.forEach(s => {
                    if (s.readyState === WebSocketType.OPEN) {
                        s.send(data.toString());
                        s.close();
                    }
                });
                delete rooms[room];
                console.log(`Room ${room} cleared and deleted`);
            }
        }
    } catch (error) {
        console.error('Error parsing message from relayer:', error);
    }
});

wss.on('connection', function (ws) {
    ws.on('error', console.error);
    
    ws.on('message', function message(data: Buffer) {
        try {
            const parsedData = JSON.parse(data.toString());
            
            if (parsedData.type === "join-room") {
                const room = parsedData.room;
                
                if (!rooms[room]) {
                    rooms[room] = {
                        sockets: []
                    };
                }
                
                rooms[room].sockets.push(ws);
            } else if (parsedData.type === "chat") {
                if (relayerSocket.readyState === WebSocketType.OPEN) {
                    relayerSocket.send(data.toString());
                } else {
                    console.error('Relayer socket is not open');
                }
            }
        } catch (error) {
            console.error('Error parsing message from client:', error);
        }
    });
    
    ws.on('close', () => {
        Object.keys(rooms).forEach(room => {
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