"use client";

import { Toaster } from "sonner";

export default function SonnerToaster({ name, className }) {
  return (
    <Toaster
      containerAriaLabel={name}
      duration={5000}
      swipeDirections={["left", "right", "bottom", "top"]}
      closeButton
      richColors
      hotkey={["c", "C", "c"]}
      expand
      theme={"system"}
      position="top-right"
      toastOptions={{
        className: `font-semibold backdrop-blur-md text-black rounded-3xl${className ? ` ${className}` : ""}`,
      }}
    />
  );
}
