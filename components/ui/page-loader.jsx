"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-xl">
      <div className="relative flex flex-col items-center gap-4">
        <div className="h-14 w-14 animate-spin rounded-full border-2 border-white/20 border-t-white/90" />
        <p className="text-sm font-medium text-white/80 tracking-wide">
          Loading portfolio...
        </p>
      </div>
    </div>
  );
}
