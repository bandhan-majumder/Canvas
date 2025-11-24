"use client";

import { useWindowSize } from "@/hooks/use-windowSize";
import React, { useEffect, useRef, useState } from "react";
import { Github } from "lucide-react";
import { Tool } from "@/types/tools";
import { Game } from "@/draw/Game";
import Link from "next/link";
import { ToolsBar } from "./ToolBar";
import { useAtomValue, useSetAtom } from "jotai";
import {
  localStorageElementsAtom,
  addShapesAtom,
  localStorageUsernameAtom,
  canvasViewStateAtom, 
  updateCanvasViewAtom, 
} from "@/appState";
import { CanvasElement } from "@/types/shape";
import { STORAGE_KEYS } from "@/lib/constants";
import { DeleteElementsModal } from "./DeleteElementsModal";
import { ShareSessionModal } from "./ShareSessionModal";

interface CanvasProps {
  prevElements?: CanvasElement[];
  onShapeAdded?: (shape: CanvasElement) => void;
  roomId?: string;
}

export default function Canvas({
  prevElements,
  onShapeAdded,
  roomId,
}: CanvasProps) {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const { width, height } = useWindowSize();

  // Read shapes from localStorage via Jotai
  const shapes = useAtomValue(localStorageElementsAtom);
  const storedUsername = useAtomValue(localStorageUsernameAtom);
  const canvasViewState = useAtomValue(canvasViewStateAtom); 
  const addShape = useSetAtom(addShapesAtom);
  const updateCanvasView = useSetAtom(updateCanvasViewAtom); 

  // if drawing exist in a new room, add that to the current state
  useEffect(() => {
    if (prevElements && prevElements.length > 0) {
      addShape(prevElements);
    }
  }, [prevElements]);

  // Only sync with localStorage when NOT in a room (solo mode)
  // In room mode, Supabase is the source of truth
  useEffect(() => {
    if (roomId) return; // Skip localStorage sync in room mode

    const checkInterval = setInterval(() => {
      try {
        const stored = localStorage.getItem(
          STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS,
        );
        const username = localStorage.getItem(
          STORAGE_KEYS.LOCAL_STORAGE_USERNAME,
        );

        // sync elements
        if (stored === null && shapes.length > 0) {
          localStorage.setItem(
            STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS,
            JSON.stringify(shapes),
          );
        }

        // sync username
        if (storedUsername && storedUsername !== username) {
          localStorage.setItem(
            STORAGE_KEYS.LOCAL_STORAGE_USERNAME,
            storedUsername,
          );
        }
      } catch (e) {
        console.error("Error restoring localStorage:", e);
      }
    }, 500);

    return () => {
      clearInterval(checkInterval);
    };
  }, [shapes, roomId, storedUsername]);

  useEffect(() => {
    if (selectedTool && game) {
      game.setTool(selectedTool);
    }
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const handleNewShape = (newShape: CanvasElement) => {
        // Add to local state
        addShape(newShape);

        // If in a room, notify via WebSocket
        if (onShapeAdded) {
          onShapeAdded(newShape);
        }
      };

      const g = new Game(
        canvasRef.current,
        shapes,
        handleNewShape,
        canvasViewState 
      );
      setGame(g);
      return () => {
        g.destroy();
      };
    }
  }, [canvasRef, addShape, canvasViewState]);

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

  // disable context menu
  useEffect(() => {
    const preventContextMenu = (event: Event) => event.preventDefault();
    document.addEventListener("contextmenu", preventContextMenu);
    return () =>
      document.removeEventListener("contextmenu", preventContextMenu);
  }, []);

  // Add mouse wheel scrolling and persist view state changes
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

      updateCanvasView(game.getViewState());
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [game, updateCanvasView]);

  return (
    <div className="h-full w-full relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="touch-none"
        style={{ touchAction: "none" }}
      />

      <div className="fixed bottom-4 left-5/12">
        <ToolsBar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
        />
      </div>
      <div className="fixed top-4 right-10 flex gap-4">
        <Link
          href={"https://github.com/bandhan-majumder/Canvas"}
          target="blank"
          className="cursor-pointer flex justify-center items-center flex-col"
        >
          <Github size={25} color="white" />
        </Link>
        <ShareSessionModal />
        <DeleteElementsModal />
      </div>
    </div>
  );
}
