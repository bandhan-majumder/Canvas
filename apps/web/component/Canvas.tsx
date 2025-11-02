"use client";

import { useWindowSize } from "@/hooks/useWindowSize";
import React, { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import {
  Circle,
  Github,
  Minus,
  Plus,
  Square,
  Share2,
  Menu,
  X,
} from "lucide-react";
import { Tool } from "@/types/tools";
import { Game } from "@/draw/Game";
import toast from "react-hot-toast";
import Link from "next/link";

function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const { width, height } = useWindowSize();

  const isMobile = width < 768;

  useEffect(() => {
    selectedTool && game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    // create a new game loop
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);
      return () => {
        g.destroy();
      };
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

  // Close mobile menu when tool is selected
  useEffect(() => {
    if (selectedTool && isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [selectedTool, isMobile]);

  function onShareHandler(): void {
    const currentLink = location.href;
    navigator.clipboard.writeText(currentLink);
    toast.success("URL copied!");
  }

  // disable context menu
  useEffect(() => {
    const preventContextMenu = (event: Event) => event.preventDefault();
    document.addEventListener("contextmenu", preventContextMenu);
    return () => document.removeEventListener("contextmenu", preventContextMenu);
  }, []);

  // Prevent zoom on double tap for iOS
  useEffect(() => {
    const preventZoom = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventZoom, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchmove', preventZoom);
    };
  }, []);

  return (
    <div className="h-[100vh] overflow-hidden relative">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="touch-none"
        style={{ touchAction: 'none' }}
      />
      
      {isMobile ? (
        <>
          <div className="fixed top-0 left-0 right-0 bg-[#232329] p-3 flex justify-between items-center z-50 safe-area-top">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white rounded-lg bg-[#403E6A]"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <div className="flex gap-2">
              <button
                className="p-2 text-white rounded-lg bg-[#403E6A]"
                onClick={onShareHandler}
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <div className={`fixed top-16 left-0 right-0 bg-[#232329] transition-transform duration-300 z-40 ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}>
            <div className="p-4">
              <MobileToolsBar
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
              />
            </div>
          </div>

          <div className="fixed bottom-6 right-4 z-40 safe-area-bottom">
            {game && <MobileZoomBar game={game} />}
          </div>

          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </>
      ) : (
        <>
          <div className="fixed top-4 left-10">
            <ToolsBar
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool}
            />
          </div>
          <div className="fixed top-4 right-10 flex gap-4">
            <div className="bg-[#403E6A] p-4 rounded-xl text-white flex justify-center items-center cursor-pointer">
              <Link
                href={"https://github.com/bandhan-majumder/Canvas"}
                target="blank"
              >
                <Github className="transition ease-out duration-300" />
              </Link>
            </div>
            <button
              className="text-black p-4 rounded-lg text-sm bg-[#B2AEFF] cursor-pointer"
              onClick={onShareHandler}
            >
              Share
            </button>
            <div>
            </div>
          </div>
          <div className="fixed bottom-4 bg-none right-10">
            {game && <ZoomBar game={game} />}
          </div>
        </>
      )}
    </div>
  );
}

// Desktop Tools Bar
function ToolsBar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool | null;
  setSelectedTool: (tool: Tool) => void;
}) {
  return (
    <div className="bg-[#232329] p-2 rounded-md shadow-md">
      <div className="flex gap-2">
        <IconButton
          icon={<Minus />}
          onClick={() => setSelectedTool(Tool.Line)}
          activated={selectedTool === Tool.Line}
        />
        <IconButton
          icon={<Square />}
          onClick={() => setSelectedTool(Tool.Square)}
          activated={selectedTool === Tool.Square}
        />
        <IconButton
          icon={<Circle />}
          onClick={() => setSelectedTool(Tool.Circle)}
          activated={selectedTool === Tool.Circle}
        />
      </div>
    </div>
  );
}

// Mobile Tools Bar - Horizontal layout
function MobileToolsBar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool | null;
  setSelectedTool: (tool: Tool) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <MobileToolButton
        icon={<Minus size={24} />}
        label="Line"
        onClick={() => setSelectedTool(Tool.Line)}
        activated={selectedTool === Tool.Line}
      />
      <MobileToolButton
        icon={<Square size={24} />}
        label="Square"
        onClick={() => setSelectedTool(Tool.Square)}
        activated={selectedTool === Tool.Square}
      />
      <MobileToolButton
        icon={<Circle size={24} />}
        label="Circle"
        onClick={() => setSelectedTool(Tool.Circle)}
        activated={selectedTool === Tool.Circle}
      />
    </div>
  );
}

// Mobile Tool Button with label
function MobileToolButton({
  icon,
  label,
  onClick,
  activated = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  activated?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
        activated 
          ? 'bg-[#B2AEFF] text-black' 
          : 'bg-[#403E6A] text-white hover:bg-[#4A4870]'
      }`}
    >
      {icon}
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );
}

// Desktop Zoom Bar
function ZoomBar({ game }: { game: Game }) {
  return (
    <div className="bg-[#232329] rounded-lg shadow-md">
      <div className="flex gap-2 bg-transparent rounded-xl">
        <IconButton
          icon={<Plus size={17} />}
          isBorder={false}
          onClick={() => {
            game.zoomInHandler();
          }}
        />
        <IconButton
          icon={<Minus size={17} />}
          isBorder={false}
          onClick={() => game.zoomOutHandler()}
        />
      </div>
    </div>
  );
}

// Mobile Zoom Bar - Vertical layout
function MobileZoomBar({ game }: { game: Game }) {
  return (
    <div className="bg-[#232329] rounded-lg shadow-md">
      <div className="flex flex-col gap-1 p-2">
        <button
          onClick={() => game.zoomInHandler()}
          className="p-3 text-white hover:bg-[#403E6A] rounded-lg transition-colors"
        >
          <Plus size={20} />
        </button>
        <button
          onClick={() => game.zoomOutHandler()}
          className="p-3 text-white hover:bg-[#403E6A] rounded-lg transition-colors"
        >
          <Minus size={20} />
        </button>
      </div>
    </div>
  );
}

export default Canvas;