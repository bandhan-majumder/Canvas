"use client";

import { useWindowSize } from "@/hooks/useWindowSize";
import React, { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import {
  Circle,
  Github,
  Minus,
  Plus,
  Square
} from "lucide-react";
import { Tool } from "@/types/tools";
import { Game } from "@/draw/Game";
import toast from "react-hot-toast";
import Link from "next/link";
import { Button } from "./ui/button";

function Canvas() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const { width, height } = useWindowSize();

  // const isMobile = width < 768;

  useEffect(() => {
    if (selectedTool && game) {
      game.setTool(selectedTool);
    }
  }, [selectedTool, game]);

  useEffect(() => {
    // create a new game loop
    if (canvasRef.current) {
      const g = new Game(canvasRef.current);
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
  // useEffect(() => {
  //   if (selectedTool && isMobile) {
  //     setIsMobileMenuOpen(false);
  //   }
  // }, [selectedTool, isMobile]);

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

  // Add mouse wheel scrolling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !game) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      let deltaX = 0;
      let deltaY = 0;

      if (event.shiftKey) {
        // Shift + wheel = horizontal scroll
        deltaX = event.deltaY;
      } else if (event.ctrlKey) {
        // Ctrl + wheel = zoom
        if (event.deltaY < 0) {
          // Scrolling up = zoom in
          game.zoomInHandler();
        } else if (event.deltaY > 0) {
          // Scrolling down = zoom out
          game.zoomOutHandler();
        }
      } else {
        // Normal wheel = vertical scroll
        deltaY = event.deltaY;
      }

      // Pan the canvas based on wheel movement
      if (game.panCamera) {
        game.panCamera(deltaX, deltaY);
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [game]);

  return (
    <div className="h-full w-full relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="touch-none"
        style={{ touchAction: 'none' }}
      />

      <div className="fixed top-4 left-5/12">
        <ToolsBar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
        />
      </div>
      <div className="fixed top-4 right-10 flex gap-4">
        <Button className="bg-white" variant={"link"}>
          <Link href={"https://github.com/bandhan-majumder/Canvas"} target="blank">
            <Github />
          </Link>
        </Button>
        <Button variant={"outline"} onClick={onShareHandler}>
          Share
        </Button>
        <div>
        </div>
      </div>
      <div className="fixed bottom-4 bg-none right-10">
        {game && <ZoomBar game={game} />}
      </div>
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
    <div className="bg-[#232329] p-2 rounded-xl shadow-md">
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

export default Canvas;