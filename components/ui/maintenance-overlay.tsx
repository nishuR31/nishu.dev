"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function MaintenanceOverlay({ active }: { active: boolean }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !active || pathname === "/contact") {
    return null;
  }

  return (
    <div className="fixed inset-0 h-screen w-screen z-[9999] pointer-events-auto overflow-hidden animate-in fade-in duration-1000">
      {/* Background Gradient & Blur */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md pointer-events-none" />
      
      {/* Content overlay */}
      <div className="absolute inset-0 p-8 flex flex-col items-center justify-center h-full pointer-events-auto">
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl p-8 rounded-3xl max-w-lg w-full flex flex-col items-center text-center transform hover:scale-[1.02] transition-transform duration-500">
          <div className="p-4 bg-orange-500/10 text-orange-500 rounded-full mb-6">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600">
            Site Maintenance
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            This portfolio is currently undergoing scheduled updates. Some features may be temporarily unavailable.
          </p>
          <Link href="/contact" className="w-full">
            <button className="w-full py-4 bg-foreground text-background font-bold rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-3 group">
              Contact Developer Directly
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
