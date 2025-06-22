"use client";

import { Button } from "@repo/ui";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  if (session?.user) {
    router.push("/canvas");
    return null; // Prevent rendering the header if user is logged in
  }
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/70 backdrop-blur-xl border-b border-gray-800/50">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-5 h-5 text-gray-900"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
          <span className="text-2xl font-light text-white tracking-wide">
            Canvas
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-10">
          <a
            href="#features"
            className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
          >
            Features
          </a>
          <a
            href="#demo"
            className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
          >
            Demo
          </a>
          <a
            href="#about"
            className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
          >
            About
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="hidden sm:flex text-gray-400 hover:text-white hover:bg-gray-800/50 font-medium"
            onClick={() => signIn()}
          >
            Sign In
          </Button>
          <Button
            className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300 font-medium cursor-pointer"
            onClick={() => router.push("/auth/signup")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};
