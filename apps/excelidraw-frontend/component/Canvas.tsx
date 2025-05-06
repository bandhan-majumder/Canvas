"use client";

import { useWindowSize } from '@/hooks/useWindowSize';
import React, { useEffect, useRef, useState } from 'react'
import { IconButton } from './IconButton';
import { Circle, Minus, Square } from 'lucide-react';
import { Tool } from '@/types/tools';
import { Game } from '@/draw/Game';

function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
    const [selectedTool, setSelectedTool] = useState<Tool>(Tool.Square);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game])

    useEffect(() => {
        // create a new game loop
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);
            return () => {
            g.destroy();
            }
        }
    }, [canvasRef]);

    const { width, height } = useWindowSize();
    return (
        <div className='h-[100vh] overflow-hidden'>
            <canvas ref={canvasRef} width={width} height={height} />
            <div className='fixed top-10 left-10'>
                <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
            </div>
        </div>
    )
}

function TopBar({ selectedTool, setSelectedTool }: { selectedTool: Tool, setSelectedTool: (tool: Tool) => void }) {
    return <div className="fixed top-10 left-10 bg-[#232329] p-2 rounded-md shadow-md">
        <div className='flex gap-2'>
            <IconButton icon={<Minus />} onClick={() => setSelectedTool(Tool.Line)} activated={selectedTool === Tool.Line} />
            <IconButton icon={<Square />} onClick={() => setSelectedTool(Tool.Square)} activated={selectedTool === Tool.Square} />
            <IconButton icon={<Circle />} onClick={() => setSelectedTool(Tool.Circle)} activated={selectedTool === Tool.Circle} />
        </div>
    </div>
}
export default Canvas

