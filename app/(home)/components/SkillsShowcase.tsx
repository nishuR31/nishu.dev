"use client";

import React, { useEffect, useRef } from "react";
import {
  Atom, Monitor, Antenna, Code2, Database,
  Github, Pyramid, Server, Wind, Globe, Paintbrush,
} from "lucide-react";
import { prefersReducedMotion } from "@/lib/anime-utils";

interface Skill {
  name: string;
  icon: React.ReactNode;
  size: string;
  accentColor?: string;
}

const skills: Skill[] = [
  { name: "React.js", icon: <Atom className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-2 sm:row-span-1 md:col-span-2 md:row-span-1", accentColor: "#61dafb" },
  { name: "Express", icon: <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-2", accentColor: "#ffffff" },
  { name: "MongoDB", icon: <Database className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-2", accentColor: "#4db33d" },
  { name: "Node.js", icon: <Server className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-2 sm:row-span-1 md:col-span-2 md:row-span-1", accentColor: "#8cc84b" },
  { name: "GitHub", icon: <Github className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-2 sm:row-span-1 md:col-span-1 md:row-span-2", accentColor: "#ffffff" },
  { name: "Tailwind", icon: <Paintbrush className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-2", accentColor: "#38bdf8" },
  { name: "Postman", icon: <Antenna className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1", accentColor: "#ff6c37" },
  { name: "Prisma", icon: <Pyramid className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-2 sm:row-span-1 md:col-span-1 md:row-span-2", accentColor: "#5a67d8" },
  { name: "VS Code", icon: <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-2 sm:row-span-1 md:col-span-1 md:row-span-2", accentColor: "#007acc" },
  { name: "Vercel", icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1", accentColor: "#ffffff" },
  { name: "Render", icon: <Server className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1", accentColor: "#46e3b7" },
  { name: "Fastify", icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1", accentColor: "#ffffff" },
  { name: "Antigravity", icon: <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-2 sm:row-span-1 md:col-span-2 md:row-span-1", accentColor: "#8b5cf6" },
  { name: "Bun", icon: <Server className="w-5 h-5 sm:w-6 sm:h-6" />, size: "sm:col-span-1 sm:row-span-1 md:col-span-4 md:row-span-1", accentColor: "#fbf0df" },
];

const SkillsShowcase: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let triggered = false;

    const run = async () => {
      try {
        const { animate, stagger } = await import("animejs");
        const el = gridRef.current;
        if (!el || triggered) return;

        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && !triggered) {
              triggered = true;
              observer.disconnect();
              const cards = el.querySelectorAll<HTMLElement>(".skill-card");
              cards.forEach((c) => { c.style.opacity = "0"; });
              animate(cards, {
                opacity: [0, 1],
                translateY: [24, 0],
                rotateY: ["-8deg", "0deg"],
                scale: [0.92, 1],
                easing: "easeOutBack",
                duration: 500,
                delay: stagger(50, { start: 100 }),
              });
            }
          },
          { rootMargin: "-5% 0px" }
        );
        observer.observe(el);
      } catch {
        // show cards without animation
        gridRef.current
          ?.querySelectorAll<HTMLElement>(".skill-card")
          .forEach((c) => { c.style.opacity = "1"; });
      }
    };

    run();
  }, []);

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
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 w-full"
          style={{ gridAutoRows: "minmax(90px, auto)", gridAutoFlow: "row dense" }}
        >
          {skills.map((skill) => (
            <div
              key={skill.name}
              className={`relative group skill-card ${skill.size}`}
              style={{ perspective: "600px" }}
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
                    borderColor: skill.accentColor,
                    boxShadow: `0 0 24px ${skill.accentColor}30, inset 0 0 12px ${skill.accentColor}10`
                  }}
                />

                {/* Shiny sweep */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shiny-sweep" />
                </div>

                {/* Glossy top shine */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-2xl" />
                </div>

                <div className="relative flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 w-full z-10">
                  {/* Icon with accent halo */}
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-xl blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300"
                      style={{ backgroundColor: skill.accentColor || "#a855f7" }}
                    />
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-md sm:rounded-lg md:rounded-xl bg-zinc-900/80 border border-white/15 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:border-white/40 group-hover:scale-110">
                      <div
                        className="transition-all duration-300 drop-shadow-lg"
                        style={{ color: skill.accentColor || "#ffffff" }}
                      >
                        {skill.icon}
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="flex flex-col items-center gap-0.5 sm:gap-1 w-full px-0.5 sm:px-1">
                    <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-bold text-white text-center tracking-tight transition-all duration-300 group-hover:text-white/90 break-words leading-tight">
                      {skill.name}
                    </span>
                    <div
                      className="w-5 sm:w-6 md:w-8 h-0.5 rounded-full transition-all duration-300 group-hover:w-10"
                      style={{
                        background: `linear-gradient(to right, transparent, ${skill.accentColor || "#a855f7"}80, transparent)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsShowcase;
