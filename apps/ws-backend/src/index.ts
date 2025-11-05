import { WebSocket as WebSocketType, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: process.env.PORT ? Number(process.env.PORT) : 8081 });

interface Room {
    sockets: WebSocketType[]
}

const rooms: Record<string, Room> = {};

const relayerSocket = new WebSocket(process.env.RELAYER_URL ? process.env.RELAYER_URL : "ws://localhost:8080");

relayerSocket.onmessage = ({ data }) => {
    const parsedData = JSON.parse(data);
    if (parsedData.type == 'chat') {
        const room = parsedData.room;
        rooms[room]?.sockets.map(s => s.send(data));
    }
}

wss.on('connection', function (ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data: string) {
        const parsedData = JSON.parse(data);
        // join room message stays in the same server
        if (parsedData.type == "join-room") {
            const room = parsedData.room;
            // if the room does not exist, create it
            if (!rooms[room]) {
                rooms[room] = {
                    sockets: []
                }
            }
            rooms[room].sockets.push(ws);
            // only the chat message relays to the relayer
        } else if (parsedData.type == "chat") {
            relayerSocket.send(data);
        }
    })
})