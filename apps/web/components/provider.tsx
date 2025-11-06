"use client";

import { Provider } from "jotai";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider>
      <Toaster />
      {children}
    </Provider>
  );
};
