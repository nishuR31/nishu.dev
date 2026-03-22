"use client";

import { Toaster } from "sonner";

export default function SonnerToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "font-semibold backdrop-blur-md text-black rounded-3xl",
      }}
    />
  );
}
