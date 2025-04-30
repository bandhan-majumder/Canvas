import { WebSocketServer, WebSocket } from "ws";
import { checkUser } from "./lib/checkToken";
import { prismaClient } from "@repo/db/client";

const port = process.env.PORT || "8081"
const wss = new WebSocketServer({ port: Number(port) });
interface InterfaceUser {
    ws: WebSocket,
    rooms: string[],
    userId: string
}

// state management
const users: InterfaceUser[] = [];

wss.on('connection', (ws, request) => {
    const url = request.url;

    if (!url) {
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') ?? "";
    const isUserAuthenticated = checkUser(token);

    if (!isUserAuthenticated) {
        ws.close();
        return;
    }

    const userId = isUserAuthenticated.userId;
    users.push({
        userId: userId,
        rooms: [],
        ws
    })

    ws.on('message', async (data) => {
        const parsedData = JSON.parse(data.toString());

        // join a room
        if (parsedData.type === "join_room") {
            const user = users.find(x => x.ws === ws);
            user?.rooms.push(parsedData.roomId)
        }

        // close a chat room
        if (parsedData.type === "leave_room") {
            const user = users.find(x => x.ws === ws);
            if (!user) return;
            user.rooms = user?.rooms.filter(x => x === parsedData.room);
        }

        if (parsedData.type === "chat") {
            const roomId = parsedData.roomId;
            const intRoomId = Number(roomId);
            const message = parsedData.message;
            // check if the message is too long or not and other sorts of improvements

            // add in queue first and then store to db asyncronously

            // add the data to database using a pipeline
            await prismaClient.chat.create({
                data: {
                    message,
                    roomId: intRoomId,
                    userId
                }
            })

            users.forEach(user => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message,
                        roomId
                    }))
                }
            })
        }
    })
})