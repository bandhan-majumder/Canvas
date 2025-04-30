"use client";

import { WS_BACKEND_URL } from '@/config';
import { initDraw } from '@/draw';
import React, { useEffect, useRef, useState } from 'react'
import Canvas from './Canvas';

function RoomCanvas({ roomId }: { roomId: string }) {

    const [socket, setSocket] = useState<WebSocket | null>(null);
    // add websocket connection
    useEffect(() => {
        const ws = new WebSocket(`${WS_BACKEND_URL}?token=`);

        // when the socket connection opens, add it to the state
        ws.onopen = () => {
            setSocket(ws);
            // connet to the room
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }
    }, []);

    if (!socket) {
        return <div>
            Connecting to server
        </div>
    }
    return (
        <Canvas roomId={roomId} socket={socket}/>
    )
}

export default RoomCanvas