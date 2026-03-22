"use client";

import { useEffect } from "react";
import PageLoader from "@/components/ui/page-loader";
import MouseGlow from "@/components/ui/mouse-glow";

function getSeason(month) {
  if ([11, 0, 1].includes(month)) return "winter";
  if ([2, 3, 4].includes(month)) return "spring";
  if ([5, 6, 7].includes(month)) return "summer";
  return "autumn";
}

export default function AppEnhancements() {
  useEffect(() => {
    const month = new Date().getMonth();
    document.documentElement.setAttribute("data-season", getSeason(month));

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const syncMotion = () => {
      document.documentElement.setAttribute(
        "data-motion",
        prefersReduced.matches ? "off" : "on",
      );
    };
    syncMotion();
    prefersReduced.addEventListener("change", syncMotion);

    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const syncPointer = () => {
      document.documentElement.setAttribute(
        "data-pointer",
        coarsePointer.matches ? "coarse" : "fine",
      );
    };
    syncPointer();
    coarsePointer.addEventListener("change", syncPointer);

    return () => {
      prefersReduced.removeEventListener("change", syncMotion);
      coarsePointer.removeEventListener("change", syncPointer);
    };
  }, []);

  return (
    <>
      <PageLoader />
      <MouseGlow />
    </>
  );
}
