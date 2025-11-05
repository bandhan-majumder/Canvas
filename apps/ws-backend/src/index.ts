import { WebSocket as WebSocketType, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: process.env.PORT ? Number(process.env.PORT) : 8081 });

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

console.log(`WebSocket server running on port ${process.env.PORT || 8081}`);