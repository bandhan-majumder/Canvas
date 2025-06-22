"use client";

import React, { useEffect, useState } from "react";
import { useSocket } from "../hook/useSocket";

function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const { socket, loading } = useSocket();
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [chats, setChats] = useState(messages);

  useEffect(() => {
    // when connection is established
    if (socket && !loading) {
      // send info that we want to connect to the room
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        }),
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChats((c) => [...c, { message: parsedData.message }]);
        }
      };
    }
    return () => socket?.close();
  }, [socket, loading, id]);
  return (
    <div>
      <div>
        {chats.map((m) => (
          <div>{m.message}</div>
        ))}

        <input
          value={currentMessage ?? ""}
          type="text"
          placeholder="send message..."
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button
          onClick={() => {
            socket?.send(
              JSON.stringify({
                type: "chat",
                roomId: id,
                message: currentMessage,
              }),
            );
            setCurrentMessage(null);
          }}
        >
          Send message
        </button>
      </div>
    </div>
  );
}

export default ChatRoomClient;
