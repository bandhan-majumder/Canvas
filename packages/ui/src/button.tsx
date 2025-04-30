"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant: "primary" | "secondary" | "tertiary";
  onClick: () => void;
  size?: "small" | "medium" | "large";
}

export const Button = ({ children, className, size, variant, onClick }: ButtonProps) => {
  return (
    <button
      className={`${className} ${variant === "primary" ? "bg-primary": ""} ${size === "small" ? "text-sm" : size === "medium" ? "text-base" : "text-lg"} p-2 rounded`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
