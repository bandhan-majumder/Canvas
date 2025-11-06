import Canvas from "@/components/Canvas";
import React from "react";

export default async function Home() {
  return (
    <div className="h-full w-full">
      <div className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-100">
        <Canvas />
      </div>
    </div>
  );
}
