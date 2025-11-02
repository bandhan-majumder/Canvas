import { WebSocketServer, WebSocket } from "ws";

const port = process.env.PORT || "8081";
const wss = new WebSocketServer({ port: Number(port) });

interface InterfaceUser {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

// state management
const users: InterfaceUser[] = [];

wss.on("connection", async (ws, request) => {
  const url = request.url;

  if (!url) {
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const userId = queryParams.get("userId") ?? "";

  if (!userId) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  try {
    // Handle messages
    ws.on("message", async (data) => {
      try {
        const parsedData = JSON.parse(data.toString());
        const user = users.find((x) => x.ws === ws);

        if (!user) {
          ws.close();
          return;
        }

        // join a room
        if (parsedData.type === "join_room") {
          const roomId = parsedData.roomId.toString();
          // Avoid duplicate room entries
          if (!user.rooms.includes(roomId)) {
            user.rooms.push(roomId);

            // Confirm room join to the user
            ws.send(
              JSON.stringify({
                type: "room_joined",
                roomId,
              }),
            );
          }
        }

        // leave a room
        if (parsedData.type === "leave_room") {
          const roomId = parsedData.roomId.toString();

          // Remove the room from user's room list
          user.rooms = user.rooms.filter((x) => x !== roomId);
        }

        // send a chat message
        if (parsedData.type === "chat") {
          const roomId = parsedData.roomId.toString();
          const object = parsedData.object;
          // check if the message is too long or not and other sorts of improvements

          // add in queue first and then store to db asyncronously

          // add the data to database using a pipeline
          // await prismaClient.shape.create({
          //   data: {
          //     object,
          //     canvasId: roomId,
          //     userId,
          //   },
          // });

          // Broadcast message to all users in the room except the sender
          users.forEach((u) => {
            if (u.rooms.includes(roomId) && u.ws !== ws) {
              u.ws.send(
                JSON.stringify({
                  type: "chat",
                  object,
                  roomId,
                }),
              );
            }
          });
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    // Handle disconnection
    ws.on("close", () => {
      const index = users.findIndex((u) => u.ws === ws);
      if (index !== -1) {
        users.splice(index, 1);
      }
    });
  } catch {
    ws.close();
  }
});
