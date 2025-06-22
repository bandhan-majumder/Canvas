"use client";
import React from "react";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { CanvasPreview } from "./CanvasPreview";
import { Testimonials } from "./Testimonials";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  if (session?.user) {
    router.push("/canvas");
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <Hero />
      <CanvasPreview />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default LandingPage;
