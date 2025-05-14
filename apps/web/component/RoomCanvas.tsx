"use client";
import { WS_BACKEND_URL } from '@/config';
import React, { useEffect, useRef, useState } from 'react'
import Canvas from './Canvas';
import Loader from './Loader';

function RoomCanvas({ roomId, userInfo }: { roomId: string, userInfo: any }) {

  if (!roomId || !userInfo) {
    return 
  };
  
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  
  // add websocket connection
  useEffect(() => {
    let ws: WebSocket;
    
    try {
      ws = new WebSocket(`${WS_BACKEND_URL}?email=${userInfo.email}&name=${userInfo.name}`);
      
      // when the socket connection opens, add it to the state
      ws.onopen = () => {
        // connect to the room
        ws.send(JSON.stringify({
          type: "join_room",
          roomId
        }));
        
        setSocket(ws);
        setIsConnecting(false);
      };
      
      ws.onerror = () => {
        setIsConnecting(false);
      };
      
      ws.onclose = () => {
        if (isConnecting) {
          setIsConnecting(false);
        }
      };
    } catch (error) {
      setIsConnecting(false);
    }
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [roomId]);

  return (
    <div className="h-screen w-full bg-[#111011]">
      {socket && (
        <div className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-100">
          <Canvas roomId={roomId} socket={socket} />
        </div>
      )}
      
      {/* Show loader with fade-out effect when connecting */}
      {(isConnecting || !socket) && (
        <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${socket ? 'opacity-0' : 'opacity-100'}`}>
          <Loader />
        </div>
      )}
    </div>
  );
}

export default RoomCanvas