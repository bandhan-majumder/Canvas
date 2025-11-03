"use client";
import { WS_BACKEND_URL } from "@/config";
import React, { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";
import Loader from "./Loader";

function RoomCanvas() {
  
  return (
    <div className="h-screen w-full bg-[#111011]">
      <div className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-100">
          <Canvas />
        </div>
    </div>
  );
}

export default RoomCanvas;
