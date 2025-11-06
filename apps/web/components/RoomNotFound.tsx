import Link from "next/link";
import React from "react";

function Room404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111011] text-slate-900 font-sans">
      <h1 className="text-8xl font-bold text-[#B2AEFF] m-0">404</h1>
      <h2 className="text-2xl mt-4 mb-2">Room Not Found</h2>
      <p className="text-lg mb-8 text-white">
        Oops! The room you are looking for does not exist or has been removed.
      </p>
      <Link
        href={"/"}
        className="px-6 py-3 bg-[#B2AEFF] text-white rounded-lg font-semibold shadow-md hover:bg-[#B2AEFF1] transition"
        title="Go Home"
      />
    </div>
  );
}

export default Room404;
