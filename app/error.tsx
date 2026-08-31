"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "../components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div
        className="relative z-10 max-w-lg w-full p-8 rounded-3xl glass-panel border border-red-500/20 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
      >
        <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center text-red-500 border border-red-500/20 mb-6">
          <AlertTriangle className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground font-outfit">
          Oops! Something went wrong
        </h1>
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          The application encountered an unexpected error. This might be due to stale cache or network issues. 
          You can try reloading the page, or visit the Settings page to clear the application state.
        </p>

        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-left overflow-auto max-h-32">
          <code className="text-xs text-red-400 font-mono">
            {error.message || "Unknown error occurred"}
          </code>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            onClick={reset}
            variant="outline"
            Icon={RefreshCcw}
            iconPlacement="left"
            className="w-full sm:w-auto px-6 py-6 rounded-full border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-foreground transition-all duration-300"
          >
            Try Again
          </Button>
          
          <Button
            asChild
            variant="default"
            Icon={Settings}
            iconPlacement="left"
            className="w-full sm:w-auto px-6 py-6 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
          >
            <Link href="/settings" className="w-full sm:w-auto">
              Go to Settings
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
