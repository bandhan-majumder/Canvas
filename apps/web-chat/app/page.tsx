"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  async function handleJoin() {
    router.push(`/room/${roomId}`);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <input
        type="text"
        placeholder="Room id"
        onChange={(e) => setRoomId(e.target.value)}
        style={{
          padding: 10,
        }}
      />
      <button
        onClick={handleJoin}
        style={{
          padding: 10,
        }}
      >
        Join room
      </button>
    </div>
  );
}
