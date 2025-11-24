"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { CanvasElement } from "@/types/shape";

interface UseWebSocketProps {
  roomId: string | null;
  onShapeReceived: (shape: CanvasElement) => void;
}

interface WebSocketMessage {
  type: "join-room" | "chat" | "clear-room";
  room?: string;
  object?: string;
  shapes?: CanvasElement[];
}

export function useWebSocket({ roomId, onShapeReceived }: UseWebSocketProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (!roomId) {
      console.error("No roomId provided, skipping WebSocket connection");
      return;
    }

    try {
      const ws = new WebSocket(
        process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8081",
      );
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);

        // Join the room
        ws.send(
          JSON.stringify({
            type: "join-room",
            room: roomId,
          }),
        );
      };

      ws.onmessage = (event) => {
        try {
          const parsedData: WebSocketMessage = JSON.parse(event.data);

          if (parsedData.type === "chat" && parsedData.object) {
            const shape: CanvasElement = JSON.parse(parsedData.object);
            onShapeReceived(shape);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);

        // Only attempt to reconnect if we still have a roomId
        if (roomId) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect...");
            connect();
          }, 3000);
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      setIsConnected(false);
    }
  }, [roomId, onShapeReceived]);

  const sendShape = useCallback(
    (shape: CanvasElement) => {
      if (wsRef.current && roomId) {
        const message: WebSocketMessage = {
          type: "chat",
          room: roomId,
          object: JSON.stringify(shape),
        };

        try {
          wsRef.current.send(JSON.stringify(message));
        } catch (error) {
          console.error("Error sending shape:", error);
        }
      }
    },
    [roomId, isConnected],
  );

  // const clearRoomAndSockets = useCallback((roomId: string) => {
  //   console.log("inside clear room and sockets: ", roomId);
  //   if (wsRef.current && roomId) {
  //     const message: WebSocketMessage = {
  //       type: 'clear-room',
  //       room: roomId
  //     }

  //     try {
  //       wsRef.current.send(JSON.stringify(message));
  //     } catch (error) {
  //       console.error('Error sending shape: ', error);
  //     }
  //   }
  // }, [roomId]);

  useEffect(() => {
    if (roomId) {
      connect();
    } else {
      // Clean up connection if roomId becomes null
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    };
  }, [roomId, connect]);

  return { sendShape, isConnected };
}
