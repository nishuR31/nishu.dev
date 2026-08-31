"use client";

import { useEffect, useRef, useState } from "react";

export default function MouseGlow() {
  const glowRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frameId;
    const move = (event) => {
      if (!visible) setVisible(true);
      if (glowRef.current) {
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => {
          if (glowRef.current) {
            glowRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
          }
        });
      }
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(frameId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed left-0 top-0 z-[60] h-40 w-40 rounded-full bg-gradient-to-br from-fuchsia-500/25 via-cyan-400/20 to-emerald-400/20 blur-2xl transition-opacity duration-300 will-change-transform"
      style={{ transform: "translate(-50%, -50%)" }}
      aria-hidden="true"
    />
  );
}
