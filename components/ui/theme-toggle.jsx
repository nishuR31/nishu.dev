"use client";

import { useTheme } from "@/components/Providers/Theme";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

const modes = ["dark", "light", "system"];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="h-10 w-10 rounded-xl border border-border bg-card"
      />
    );
  }

  const active = theme || "system";
  const icon =
    active === "light" ? <Sun className="h-4 w-4" />
    : active === "dark" ? <Moon className="h-4 w-4" />
    : <Monitor className="h-4 w-4" />;

  const next = modes[(modes.indexOf(active) + 1) % modes.length];

  return (
    <button
      aria-label={`Switch theme to ${next}`}
      title={`Theme: ${active}. Click to switch to ${next}`}
      onClick={() => setTheme(next)}
      className="group flex h-10 min-w-10 items-center justify-center rounded-xl border border-border/70 bg-card/75 px-2 text-foreground backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-primary/40 hover:bg-accent"
    >
      {icon}
    </button>
  );
}
