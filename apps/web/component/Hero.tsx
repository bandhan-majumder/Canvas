"use client";

import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();
  return (
    <section className="pt-32 pb-20 px-4 bg-gray-900">
      <div className="container mx-auto text-center max-w-6xl">
        <Badge variant="secondary" className="mb-6 bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-200 p-3 rounded-full">
          ✨ Simple collaborative drawing
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight mt-4">
          Draw Together,
          <br />
          <span className="text-gray-300 italic font-light">Keep It Simple</span>
        </h1>

        <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          A minimalist canvas for teams to create circles, rectangles, and collaborate in real-time.
          No clutter, just pure creativity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="bg-[#B2AEFF] cursor-pointer text-gray-900 hover:bg-[#B2AEFF] text-lg font-semibold"
            onClick={() => router.push("/canvas")}
          >
            Start Drawing
          </Button>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Real-time sync</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Minimal interface</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Instant collaboration</span>
          </div>
        </div>
      </div>
    </section>
  );
};