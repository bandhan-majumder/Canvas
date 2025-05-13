import { getServerSession } from "next-auth";
import React from "react";
import SingInButton from "@/component/SignIn";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  const isUser = session?.user;

  if (isUser){ // redirect to canvas if the user is present
    return redirect('/canvas');
  }

  return (
    <div className="bg-black h-screen w-screen text-white">
      <SingInButton isSignIn={isUser === undefined ? true : false} />
    </div>
  );
}
