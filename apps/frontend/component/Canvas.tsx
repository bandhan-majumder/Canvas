"use client";

import { useWindowSize } from '@/hooks/useWindowSize';
import React, { useEffect, useRef, useState } from 'react'
import { IconButton } from './IconButton';
import { Circle, Github, Minus, Plus, Square, ZoomIn, ZoomOut } from 'lucide-react';
import { Tool } from '@/types/tools';
import { Game } from '@/draw/Game';
import toast from 'react-hot-toast';
import Link from 'next/link';


function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const { width, height } = useWindowSize();

    useEffect(() => {
        selectedTool && game?.setTool(selectedTool);
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

    // Handle window resize
    useEffect(() => {
        if (canvasRef.current && game) {
            // Update canvas dimensions when window size changes
            canvasRef.current.width = width;
            canvasRef.current.height = height;

            // Use existing clearAndRenderCanvas method to redraw
            game.clearAndRenderCanvas();
        }
    }, [width, height, game]);

    function onShareHandler(): void {
        const currentLink = location.href;
        navigator.clipboard.writeText(currentLink)
        toast.success('URL copied!')
    }

    // disable context menu 
    document.addEventListener('contextmenu', event => event.preventDefault());
    return (
        <div className='h-[100vh] overflow-hidden'>
            <canvas ref={canvasRef} width={width} height={height} />
            <div className='fixed top-4 left-10'>
                <ToolsBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
            </div>
            <div className='fixed top-4 right-10 flex gap-4'>
                <button className='text-black p-2 rounded-lg text-sm bg-[#B2AEFF] cursor-pointer transform hover:scale-125 hover:opacity-80 transition ease-out duration-300' onClick={onShareHandler}>Share</button>
                <div className='bg-[#403E6A] p-2 rounded-xl text-white flex justify-center items-center cursor-pointer'>
                    <Link href={"https://github.com/bandhan-majumder/Canvas"} target='blank'>
                    <Github className='transition ease-out duration-300'/></Link>
                </div>
            </div>
            <div className='fixed bottom-4 bg-none right-10'>
                {game && <ZoomBar game={game} />}
            </div>
        </div>
    )
}

function ToolsBar({ selectedTool, setSelectedTool }: { selectedTool: Tool | null, setSelectedTool: (tool: Tool) => void }) {
    return <div className="bg-[#232329] p-2 rounded-md shadow-md">
        <div className='flex gap-2'>
            <IconButton icon={<Minus />} onClick={() => setSelectedTool(Tool.Line)} activated={selectedTool === Tool.Line} />
            <IconButton icon={<Square />} onClick={() => setSelectedTool(Tool.Square)} activated={selectedTool === Tool.Square} />
            <IconButton icon={<Circle />} onClick={() => setSelectedTool(Tool.Circle)} activated={selectedTool === Tool.Circle} />
        </div>
    </div>
}

function ZoomBar({ game }: { game: Game }) {
    return <div className="bg-[#232329] rounded-lg shadow-md">
        <div className='flex gap-2 bg-transparent rounded-xl'>
            <IconButton icon={<Plus size={17} />} isBorder={false} onClick={() => {
                game.zoomInHandler();
            }} />
            <IconButton icon={<Minus size={17} />} isBorder={false} onClick={() => game.zoomOutHandler()} />
        </div>
    </div>
}
export default Canvas

