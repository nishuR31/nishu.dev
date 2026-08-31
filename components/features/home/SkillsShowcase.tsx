"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/store";
import {
  Atom, Monitor, Antenna, Code2, Database,
  Github, Pyramid, Server, Wind, Globe, Paintbrush,
} from "lucide-react";
import { prefersReducedMotion, useScrollReveal } from "@/lib/anime-utils";

interface Skill {
  name: string;
  icon: React.ReactNode;
  size: string;
  accentColor?: string;
}

const presentationMap: Record<string, Omit<Skill, "name">> = {
  "React": { icon: <Atom className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-2 sm:row-span-1 md:col-span-2 md:row-span-1", accentColor: "#61dafb" },
  "Express.js": { icon: <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-2", accentColor: "#ffffff" },
  "MongoDB": { icon: <Database className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-2", accentColor: "#4db33d" },
  "Node.js": { icon: <Server className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-2 sm:row-span-1 md:col-span-2 md:row-span-1", accentColor: "#8cc84b" },
  "GitHub": { icon: <Github className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-2 sm:row-span-1 md:col-span-1 md:row-span-2", accentColor: "#ffffff" },
  "TailwindCSS": { icon: <Paintbrush className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-2", accentColor: "#38bdf8" },
  "Postman": { icon: <Antenna className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1", accentColor: "#ff6c37" },
  "Prisma": { icon: <Pyramid className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-2 sm:row-span-1 md:col-span-1 md:row-span-2", accentColor: "#5a67d8" },
  "VS Code": { icon: <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-2 sm:row-span-1 md:col-span-1 md:row-span-2", accentColor: "#007acc" },
  "Vercel": { icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1", accentColor: "#ffffff" },
  "Render": { icon: <Server className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1", accentColor: "#46e3b7" },
  "Fastify": { icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1", accentColor: "#ffffff" },
  "Antigravity": { icon: <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-2 sm:row-span-1 md:col-span-2 md:row-span-1", accentColor: "#8b5cf6" },
  "bun.js": { icon: <Server className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-4 md:row-span-1", accentColor: "#f97316" }, // Bun is orange now
};

const SkillsShowcase: React.FC = () => {
  useScrollReveal();
  const gridRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useTheme();
  const [isLight, setIsLight] = useState(false);
  const { portfolioData, loading } = usePortfolio();

  if (loading) return null;

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
  }, [currentTheme]);

  // Extract flat list of skills from API mapping
  const apiSkills = portfolioData?.skills?.flatMap((cat: any) => cat.skills.map((s: any) => s.name)) || [];
  
  // Filter presentation map for skills that exist in API
  const displayedSkills = Object.entries(presentationMap)
    .filter(([name]) => apiSkills.includes(name) || name === 'React.js' || name === 'Tailwind') // fallback mapping
    .map(([name, data]) => ({ name, ...data }));

  // Fallback to static if empty
  const finalSkills = displayedSkills.length > 0 ? displayedSkills : Object.entries(presentationMap).map(([name, data]) => ({ name, ...data }));

  return (
    <div className="w-full mt-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Label */}
        <div className="flex items-center gap-2 mb-8 sm:mb-12 justify-center">
          <div className="inline-flex items-center space-x-2 glass-premium px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-foreground backdrop-blur-sm shadow-lg">
            <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-semibold">Tech Stack</span>
          </div>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 w-full"
          style={{ gridAutoRows: "minmax(90px, auto)", gridAutoFlow: "row dense" }}
        >
          {finalSkills.map((skill, index) => {
            const accent = (isLight && skill.accentColor === "#ffffff") ? "#333333" : (skill.accentColor || "#a855f7");

            return (
            <div
              key={skill.name}
              className={`relative group skill-card ${skill.size} reveal-on-scroll opacity-0 translate-y-4 scale-95 data-[state=visible]:animate-in data-[state=visible]:fade-in data-[state=visible]:slide-in-from-bottom-4 data-[state=visible]:zoom-in-95 duration-500 fill-mode-both`}
              style={{ perspective: "600px", animationDelay: `${100 + index * 50}ms` }}
            >
              <div
                className="
                  glass-premium border border-white/10
                  p-2.5 sm:p-4 md:p-6
                  rounded-lg sm:rounded-xl md:rounded-2xl
                  cursor-default relative overflow-hidden
                  h-full w-full min-h-[90px] sm:min-h-[120px]
                  flex flex-col items-center justify-center
                  box-border transition-all duration-300
                "
                style={{ height: "100%" }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[inherit] border-2"
                  style={{
                    borderColor: accent,
                    boxShadow: `0 0 24px ${accent}30, inset 0 0 12px ${accent}10`
                  }}
                />

                {/* Shiny sweep */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent dark:via-white/10 via-black/5 to-transparent shiny-sweep" />
                </div>

                {/* Glossy top shine */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b dark:from-white/30 from-black/10 to-transparent rounded-t-2xl" />
                </div>

                <div className="relative flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 w-full z-10">
                  {/* Icon with accent halo */}
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-xl blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300"
                      style={{ backgroundColor: accent }}
                    />
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-md sm:rounded-lg md:rounded-xl bg-card/80 border border-border flex items-center justify-center shadow-lg transition-all duration-300 group-hover:border-primary/40 group-hover:scale-110">
                      <div
                        className="transition-all duration-300 drop-shadow-lg"
                        style={{ color: accent }}
                      >
                        {skill.icon}
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="flex flex-col items-center gap-0.5 sm:gap-1 w-full px-0.5 sm:px-1">
                    <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-bold text-foreground text-center tracking-tight transition-all duration-300 group-hover:text-foreground/90 break-words leading-tight">
                      {skill.name}
                    </span>
                    <div
                      className="w-5 sm:w-6 md:w-8 h-0.5 rounded-full transition-all duration-300 group-hover:w-10"
                      style={{
                        background: `linear-gradient(to right, transparent, ${accent}80, transparent)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillsShowcase;
