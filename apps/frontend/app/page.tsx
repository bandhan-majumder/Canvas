import { getServerSession } from "next-auth";
import React from "react";
import AuthButtons from "@/component/AuthButtons";

export default async function Home() {
  const session = await getServerSession();
  const isUser = session?.user;
  return (
    <div className="bg-black h-screen w-screen text-white">
      <AuthButtons isLogout={isUser === undefined ? false : true} />
    </div>
  );
}
