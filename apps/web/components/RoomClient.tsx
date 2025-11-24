"use client";

import { useEffect, useCallback, useRef } from "react";
import Canvas from "./Canvas";
import { CanvasElement } from "@/types/shape";
import { useWebSocket } from "@/hooks/useWebsocket";
import { useAtomValue, useSetAtom } from "jotai";
import {
  localStorageElementsAtom,
  addShapesAtom,
  replaceShapesAtom,
} from "@/appState";
import axios from "axios";

interface RoomClientProps {
  roomId: string;
  initialElements: CanvasElement[];
}

export default function RoomClient({
  roomId,
  initialElements,
}: RoomClientProps) {
  const shapes = useAtomValue(localStorageElementsAtom);
  const addShapes = useSetAtom(addShapesAtom);
  const replaceShapes = useSetAtom(replaceShapesAtom);
  const isInitializedRef = useRef(false);
  const lastSyncedShapesRef = useRef<CanvasElement[]>([]);

  const handleShapeReceived = useCallback(
    (shape: CanvasElement) => {
      addShapes(shape);
    },
    [addShapes],
  );

  const { sendShape, isConnected } = useWebSocket({
    roomId,
    onShapeReceived: handleShapeReceived,
  });

  useEffect(() => {
    if (!isInitializedRef.current && initialElements.length > 0) {
      lastSyncedShapesRef.current = initialElements;
      replaceShapes(initialElements);
      setTimeout(() => {
        isInitializedRef.current = true;
      }, 0);
    }
  }, [initialElements, replaceShapes]);

  useEffect(() => {
    if (!isInitializedRef.current) return;
    if (JSON.stringify(shapes) === JSON.stringify(lastSyncedShapesRef.current))
      return;

    const syncToSupabase = async () => {
      try {
        await axios.put(`/api/room/${roomId}`, {
          elements: shapes,
        });
        lastSyncedShapesRef.current = shapes;
      } catch (error) {
        console.error("Error syncing to Supabase:", error);
      }
    };

    syncToSupabase();
  }, [shapes, roomId]);

  const handleShapeAdded = useCallback(
    (shape: CanvasElement) => {
      sendShape(shape);
    },
    [sendShape],
  );

  return (
    <div className="relative h-screen w-screen">
      <Canvas
        prevElements={[]}
        onShapeAdded={handleShapeAdded}
        roomId={roomId}
      />
      {isConnected && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-sm">
          Sharing
        </div>
      )}
    </div>
  );
}
