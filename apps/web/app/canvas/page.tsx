import React from "react";
import JoinCanvas from "@/component/JoinCanvas";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  return (
    <div className="bg-black h-screen flex flex-col justify-center items-center">
      <JoinCanvas />
    </div>
  );
}

export default Page;
