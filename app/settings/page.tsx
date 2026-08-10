"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Trash2, RefreshCw, HardDrive, Database, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clear } from "@/slices/portfolioSlice";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      // 1. Clear Local Storage
      localStorage.clear();
      // Restore theme to avoid flash
      localStorage.setItem("theme", "dark");

      // 2. Clear Session Storage
      sessionStorage.clear();

      // 3. Clear Redux State
      dispatch(clear());

      toast.success("Cache cleared successfully!", {
        description: "Your application state has been reset.",
      });

      // Force a hard reload after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

    } catch (error) {
      toast.error("Failed to clear cache", {
        description: "Something went wrong while resetting the state.",
      });
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] py-20 relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-6 mx-auto relative z-10 max-w-3xl">
        <RevealOnScroll>
          <div className="text-center space-y-6 mb-12">
            <div className="w-20 h-20 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500 border border-purple-500/20 mb-6">
              <Settings className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-['Outfit',sans-serif]">
              System <span className="gradient-heading">Settings</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Manage application data and resolve inconsistency issues.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-8">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
              <div>
                <h3 className="text-foreground font-semibold mb-1">Troubleshooting Stale Data</h3>
                <p className="text-sm text-muted-foreground">
                  If the portfolio appears buggy, is not loading new projects, or shows inconsistent information, you can perform a hard reset. This clears all local cache, session data, and forces the application to re-fetch fresh data from the server.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center gap-4">
                <HardDrive className="w-8 h-8 text-purple-400" />
                <div>
                  <div className="font-medium text-foreground">Local Storage</div>
                  <div className="text-xs text-muted-foreground">Theme & preferences</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center gap-4">
                <Database className="w-8 h-8 text-blue-400" />
                <div>
                  <div className="font-medium text-foreground">Application State</div>
                  <div className="text-xs text-muted-foreground">Redux store & API cache</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-col items-center justify-center gap-4">
              <p className="text-xs text-muted-foreground text-center">
                Action cannot be undone, but will automatically refresh the app to a clean state.
              </p>
              <hr className="w-full border-muted-foreground" />

              <Button
                onClick={handleClearCache}
                disabled={isClearing}
                variant="destructive"

                className={`w-full sm:w-auto px-6 py-6 rounded-xl transition-all duration-300 font-semibold animate-shine`}
              >
                {isClearing ? <RefreshCw className="animate-spin pr-2" /> : <Trash2 className="animate-shine pr-2" />}
                {isClearing ? "Clearing Cache..." : "Clear Cache & Reload"}
              </Button>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}
