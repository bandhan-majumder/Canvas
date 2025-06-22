"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@repo/ui";
import { Card } from "@repo/ui";

export const CanvasPreview = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState<
    "circle" | "rectangle" | "others"
  >("circle");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // Dark background
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw clean example shapes
    ctx.strokeStyle = "#f3f4f6";
    ctx.lineWidth = 1.5;
    ctx.fillStyle = "rgba(243, 244, 246, 0.05)";

    // Circle 1 (larger, perfectly centered)
    ctx.beginPath();
    ctx.arc(200, 140, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Circle 2 (overlapping elegantly)
    ctx.beginPath();
    ctx.arc(240, 120, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Rectangle (clean and minimal)
    ctx.beginPath();
    ctx.rect(140, 180, 75, 45);
    ctx.fill();
    ctx.stroke();
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#f3f4f6";
    ctx.lineWidth = 1.5;
    ctx.fillStyle = "rgba(243, 244, 246, 0.05)";

    if (activeTool === "circle") {
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.rect(x - 20, y - 15, 40, 30);
      ctx.fill();
      ctx.stroke();
    }
  };

  return (
    <section className="py-24 px-4 bg-gray-900 relative">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-light mb-6 text-white tracking-tight">
            Pure Canvas Experience
          </h2>
          <p className="text-gray-400 text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Click to create. Watch others draw in real-time. Experience the
            elegance of minimal design.
          </p>
        </div>

        <Card className="p-0 bg-gray-800/30 border-gray-700/50 backdrop-blur-sm shadow-2xl overflow-hidden">
          <div className="p-8 pb-6">
            <div className="flex gap-3 mb-8 justify-center">
              <Button
                variant={activeTool === "circle" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTool("circle")}
                className={
                  activeTool === "circle"
                    ? "bg-white text-gray-900 hover:bg-gray-100 rounded-full px-6 shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full px-6"
                }
              >
                Circle
              </Button>
              <Button
                variant={activeTool === "rectangle" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTool("rectangle")}
                className={
                  activeTool === "rectangle"
                    ? "bg-white text-gray-900 hover:bg-gray-100 rounded-full px-6 shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full px-6"
                }
              >
                Rectangle
              </Button>
            </div>

            <div className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-700/50 shadow-inner">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full h-72 cursor-crosshair"
              />
              <div className="absolute top-6 right-6 bg-gray-800/80 backdrop-blur-md rounded-lg px-4 py-2 text-sm text-gray-300 border border-gray-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Live collaboration</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 pb-8">
            <p className="text-center text-sm text-gray-500 font-light">
              Click anywhere to draw. In the real app, watch teammates create in
              real-time.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};
