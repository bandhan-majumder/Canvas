"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      Excalidraw landing page

      <div className="flex flex-col items-center justify-center gap-4">
        <button className="bg-white text-black p-2" onClick={() => {
          router.push("/signin");
        }}>Sign in</button>
        <button className="bg-white text-black p-2" onClick={() => router.push("/signup")}>Sign up</button>
      </div>
    </div>
  );
}
