"use client";
import { WS_BACKEND_URL } from "@/config";
import React, { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";
import Loader from "./Loader";

function RoomCanvas({ roomId, userId }: { roomId: string; userId: any }) {
  if (!roomId || !userId) {
    return null;
  }

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId || !roomId) return;
    const ws = new WebSocket(`${WS_BACKEND_URL}?userId=${userId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(
            JSON.stringify({
              type: "join_room",
              roomId,
            }),
          );
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }

      setSocket(ws);
      setIsConnecting(false);
      setConnectionError(null);
    };

    ws.onerror = (error) => {
      setConnectionError("Failed to connect to the server.");
      setIsConnecting(false);
    };

    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [roomId, userId]);

  if (connectionError) {
    return (
      <div className="h-screen w-full bg-[#111011] flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-xl mb-4">Connection Error</h2>
          <p className="text-gray-400 mb-4">{connectionError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#111011]">
      {socket && (
        <div className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-100">
          <Canvas roomId={roomId} socket={socket} />
        </div>
      )}

      {(isConnecting || !socket) && (
        <div
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${socket ? "opacity-0" : "opacity-100"}`}
        >
          <Loader />
        </div>
      )}
    </div>
  );
}

export default RoomCanvas;
