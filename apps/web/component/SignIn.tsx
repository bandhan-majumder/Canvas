"use client";

import { signOut, signIn } from "next-auth/react";

import React from 'react'

function SignInButton({ isSignIn }: {
  isSignIn: boolean
}) {
  return (
    <div className="flex justify-center items-center flex-col h-screen">
      {!isSignIn && <button className="bg-red-400 text-white p-2 text-lg rounded-xl cursor-pointer" onClick={() => signOut()}>Logout</button>}
      {isSignIn && <button className="bg-blue-500 text-black p-2 text-lg rounded-xl cursor-pointer" onClick={() => signIn()}>Signin</button>}
    </div>
  )
}

export default SignInButton