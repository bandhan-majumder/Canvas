'use client';

import Loader from "@/components/Loader";
import { CanvasElement } from "@/types/shape";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Canvas from "./Canvas";

type Props = {
    roomId: string;
    initialElements: CanvasElement[];
}

export default function RoomClient({ roomId, initialElements }: Props) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        let ws: WebSocket;

        const connectWebSocket = () => {
            try {
                ws = new WebSocket(process.env.NEXT_PUBLIC_WS_BACKEND_URL || "ws://localhost:8081");
                wsRef.current = ws;

                ws.onopen = () => {
                    // Send join room message
                    ws.send(JSON.stringify({
                        type: "join_room",
                        room: roomId
                    }));

                    setSocket(ws);
                    setIsConnecting(false);
                    setConnectionError(null);
                };

                ws.onerror = (error) => {
                    console.error("WebSocket error:", error);
                    setConnectionError("Failed to connect to server");
                    setIsConnecting(false);
                };

                ws.onclose = (event) => {
                    console.log("WebSocket closed:", event.code, event.reason);
                    setSocket(null);

                    // Don't treat normal closure as error
                    if (event.code !== 1000 && isConnecting) {
                        setConnectionError("Connection failed");
                        setIsConnecting(false);
                    }
                };

            } catch (error) {
                console.error("WebSocket connection error:", error);
                setConnectionError("Failed to establish connection");
                setIsConnecting(false);
            }
        };

        connectWebSocket();

        // Cleanup function
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [roomId]);

    if (connectionError) {
        console.log("Connection error is: ", connectionError);
        toast.error("Some error occurred! Please try again after some time");
        return (
            <div className="h-full w-full bg-[#111011] flex items-center justify-center">
                <div className="text-white text-center">
                    <p className="text-xl mb-4">Connection Error</p>
                    <p className="text-gray-400">{connectionError}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-white text-black rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-[#111011] relative">
            {socket && (
                <div className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-100">
                    <Canvas prevElements={initialElements} />
                </div>
            )}

            {(isConnecting || !socket) && (
                <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${socket ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <Loader />
                </div>
            )}
        </div>
    );
}