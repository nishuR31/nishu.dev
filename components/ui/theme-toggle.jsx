"use client";
import { useTheme } from "@/store";
import { Sun, Moon, Monitor } from "lucide-react";
const modes = ["dark", "light", "system"];
export default function ThemeToggle() {
  const { currentTheme, setTheme } = useTheme();
  return (
    <div className="theme-switch" role="group" aria-label="Color theme">
      {modes.map((mode, i) => {
        const Icon = [Moon, Sun, Monitor][i];
        return (
          <button
            key={mode}
            type="button"
            aria-label={`${mode[0].toUpperCase() + mode.slice(1)} theme`}
            aria-pressed={currentTheme === mode}
            title={`${mode} theme`}
            onClick={() => setTheme(mode)}
          >
            <Icon size={15} />
          </button>
        );
      })}
    </div>
  );
}
