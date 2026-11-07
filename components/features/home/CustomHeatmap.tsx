import React from "react";
import type { HeatmapDay } from "@/lib/contributions";

interface CustomHeatmapProps {
  days: HeatmapDay[];
  mode: "github" | "leetcode";
  className?: string;
}

/**
 * CustomHeatmap renders an ambient, crisp contribution matrix in SVG.
 * Designed to sit behind stats card copy with muted colors and subtle opacity,
 * ensuring high legibility while giving the card a rich, personalized identity.
 */
export default function CustomHeatmap({
  days,
  mode,
  className = "",
}: CustomHeatmapProps) {
  if (!days || days.length === 0) return null;

  // Render the last 147 days (21 weeks * 7 days)
  const recentDays = days.slice(-147);

  // Muted tones with clear contrast against dark cards
  const colors =
    mode === "github"
      ? {
          l0: "rgba(255, 255, 255, 0.05)",
          l1: "rgba(46, 160, 67, 0.35)",
          l2: "rgba(57, 211, 83, 0.55)",
          l3: "rgba(57, 211, 83, 0.75)",
          l4: "rgba(57, 211, 83, 0.95)",
        }
      : {
          l0: "rgba(255, 255, 255, 0.05)",
          l1: "rgba(217, 119, 6, 0.35)",
          l2: "rgba(245, 158, 11, 0.55)",
          l3: "rgba(251, 191, 36, 0.75)",
          l4: "rgba(253, 224, 71, 0.95)",
        };

  const getCellFill = (level: number) => {
    switch (level) {
      case 1:
        return colors.l1;
      case 2:
        return colors.l2;
      case 3:
        return colors.l3;
      case 4:
        return colors.l4;
      default:
        return colors.l0;
    }
  };

  const cellSize = 10;
  const gap = 3;
  const step = cellSize + gap;
  const numWeeks = Math.ceil(recentDays.length / 7);
  const svgWidth = numWeeks * step - gap;
  const svgHeight = 7 * step - gap;

  return (
    <div
      className={`pointer-events-none select-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        className="w-full h-full opacity-50 transition-opacity duration-300 group-hover:opacity-75"
        style={{
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.9) 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.9) 100%)",
        }}
      >
        {recentDays.map((d, index) => {
          const col = Math.floor(index / 7);
          const row = index % 7;
          const x = col * step;
          const y = row * step;
          const fill = getCellFill(d.level);

          return (
            <rect
              key={`${d.date}-${index}`}
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              rx={2}
              ry={2}
              fill={fill}
            />
          );
        })}
      </svg>
      {/* Subtle overlay wash so foreground text stays 100% legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, var(--surface) 20%, transparent 80%)",
          opacity: 0.8,
        }}
      />
    </div>
  );
}
