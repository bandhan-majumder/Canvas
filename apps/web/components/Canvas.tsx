"use client";

import { useWindowSize } from "@/hooks/use-windowSize";
import React, { useEffect, useRef, useState } from "react";
import { Github } from "lucide-react";
import { Tool } from "@/types/tools";
import { Game } from "@/draw/Game";
// import toast from "react-hot-toast";
import Link from "next/link";
import { Button } from "./ui/button";
import { ToolsBar } from "./ToolBar";
import { useAtomValue, useSetAtom } from "jotai";
import { localStorageElementsAtom, addShapeAtom } from "@/appState";
import { CanvasElement } from "@/types/shape";
import { STORAGE_KEYS } from "@/lib/constants";
import { DeleteCanvasElements } from "./DeleteConfirmation";

function Canvas() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const { width, height } = useWindowSize();
  
  // Read shapes from localStorage via Jotai
  const shapes = useAtomValue(localStorageElementsAtom);
  const addShape = useSetAtom(addShapeAtom);

  // Jotai state persists even if localStorage is manually cleared
  useEffect(() => {
    const checkInterval = setInterval(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS);
        if (stored === null && shapes.length > 0) {
          localStorage.setItem(STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS, JSON.stringify(shapes));
        }
      } catch (e) {
        console.error('Error restoring localStorage:', e);
      }
    }, 500);

    return () => {
      clearInterval(checkInterval);
    };
  }, [shapes]);

  useEffect(() => {
    if (selectedTool && game) {
      game.setTool(selectedTool);
    }
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(
        canvasRef.current,
        shapes,
        (newShape: CanvasElement) => {
          addShape(newShape);
        }
      );
      setGame(g);
      return () => {
        g.destroy();
      };
    }
  }, [canvasRef]);

  // Update game shapes when localStorage changes
  useEffect(() => {
    if (game) {
      game.updateShapes(shapes);
    }
  }, [shapes, game]);

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

  // function onShareHandler(): void {
  //   const currentLink = location.href;
  //   navigator.clipboard.writeText(currentLink);
  //   toast.success("URL copied!");
  // }

  // disable context menu
  useEffect(() => {
    const preventContextMenu = (event: Event) => event.preventDefault();
    document.addEventListener("contextmenu", preventContextMenu);
    return () => document.removeEventListener("contextmenu", preventContextMenu);
  }, []);

  // // Prevent zoom on double tap for iOS
  // useEffect(() => {
  //   const preventZoom = (event: TouchEvent) => {
  //     if (event.touches.length > 1) {
  //       event.preventDefault();
  //     }
  //   };

  //   document.addEventListener("touchstart", preventZoom, { passive: false });
  //   document.addEventListener("touchmove", preventZoom, { passive: false });

  //   return () => {
  //     document.removeEventListener("touchstart", preventZoom);
  //     document.removeEventListener("touchmove", preventZoom);
  //   };
  // }, []);

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

    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [game]);

  return (
    <div className="h-full w-full relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="touch-none"
        style={{ touchAction: "none" }}
      />

      <div className="fixed top-4 left-5/12">
        <ToolsBar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
        />
      </div>
      <div className="fixed top-4 right-10 flex gap-4">
        <Link
          href={"https://github.com/bandhan-majumder/Canvas"}
          target="blank"
          className="cursor-pointer"
        >
          <Button className="bg-white" variant={"link"}>
            <Github />
          </Button>
        </Link>
        {/* <Button variant={"outline"} onClick={onShareHandler}>
          Share
        </Button> */}
        <DeleteCanvasElements />
      </div>
    </div>
  );
}

export default Canvas;