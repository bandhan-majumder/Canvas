import { getServerSession } from "next-auth";
import React from "react";
import { redirect } from "next/navigation";
import LandingPage from "@/component/LandingPage";

export default async function Home() {
  const session = await getServerSession();
  const isUser = session?.user;

  // if (isUser){ // redirect to canvas if the user is present
  //   return redirect('/canvas');
  // }

  // return redirect('/auth/signin');
  return <div>
    <LandingPage />
  </div>;
}
