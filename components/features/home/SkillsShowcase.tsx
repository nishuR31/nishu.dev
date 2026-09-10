"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/store";
import {
  Atom,
  Monitor,
  Antenna,
  Code2,
  Database,
  Github,
  Pyramid,
  Server,
  Globe,
  Paintbrush,
  Leaf,
  Terminal,
  Cloud,
  Box,
  Bot,
} from "lucide-react";

interface Skill {
  name: string;
  icon: React.ReactNode;
  size: string;
  accentColor?: string;
}

const presentationMap: Record<string, Omit<Skill, "name">> = {
  // --- Languages ---
  JavaScript: {
    icon: <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1",
    accentColor: "#f7df1e",
  }, // Wide
  TypeScript: {
    icon: <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1",
    accentColor: "#3178c6",
  }, // Wide
  Python: {
    icon: <Terminal className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-2",
    accentColor: "#3776ab",
  }, // Tall

  // --- Frontend ---
  React: {
    icon: <Atom className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1",
    accentColor: "#61dafb",
  },
  "React Native": {
    icon: <Atom className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1",
    accentColor: "#61dafb",
  },
  TailwindCSS: {
    icon: <Paintbrush className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-3 md:row-span-1",
    accentColor: "#38bdf8",
  },

  // --- Backend & Runtimes ---
  "Node.js": {
    icon: <Server className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1",
    accentColor: "#8cc84b",
  },
  "Bun.js": {
    icon: <Server className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1",
    accentColor: "#f97316",
  },
  "Express.js": {
    icon: <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-2",
    accentColor: "#ffffff",
  },
  Fastify: {
    icon: <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-2",
    accentColor: "#ffffff",
  },

  // --- Databases & ORMs ---
  MongoDB: {
    icon: <Database className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1",
    accentColor: "#4db33d",
  },
  PostgreSQL: {
    icon: <Database className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1",
    accentColor: "#4db33d",
  },
  Redis: {
    icon: <Server className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-4 md:row-span-1",
    accentColor: "#ff0000",
  }, // Wide
  Prisma: {
    icon: <Pyramid className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-2",
    accentColor: "#5a67d8",
  },

  // --- Cloud & DevOps ---
  AWS: {
    icon: <Cloud className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1",
    accentColor: "#ff9900",
  },
  Docker: {
    icon: <Box className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-2 md:col-span-2 md:row-span-2",
    accentColor: "#2496ed",
  }, // Large Square
  Vercel: {
    icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1",
    accentColor: "#f0f0f0",
  },
  Render: {
    icon: <Server className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1",
    accentColor: "#46e3b7",
  },

  // --- Tools & AI ---
  "VS Code": {
    icon: <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-2",
    accentColor: "#007acc",
  },
  Antigravity: {
    icon: <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-2",
    accentColor: "#8b5cf6",
  },
  GitHub: {
    icon: <Github className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-2",
    accentColor: "#ffffff",
  },
  Postman: {
    icon: <Antenna className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1",
    accentColor: "#ff6c37",
  },
  Bruno: {
    icon: <Antenna className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1",
    accentColor: "#ff6c37",
  },
  "AI (Testing/Bugs)": {
    icon: <Bot className="w-5 h-5 sm:w-6 sm:h-6" />,
    size: "sm:col-span-1 sm:row-span-1 md:col-span-4 md:row-span-1",
    accentColor: "#10b981",
  }, // Full Width
};

interface SkillsShowcaseProps {
  portfolioData: any;
}

const SkillsShowcase: React.FC<SkillsShowcaseProps> = ({ portfolioData }) => {
  const { currentTheme } = useTheme();
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
  }, [currentTheme]);

  if (!portfolioData?.developer?.name) {
    return (
      <div className="w-full mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">No skills data configured.</p>
        </div>
      </div>
    );
  }

  const getDynamicSize = (index: number): string => {
    const sizes = [
      "col-span-2 sm:col-span-2 md:col-span-2 md:row-span-1", // Wide
      "col-span-1 sm:col-span-1 md:col-span-1 md:row-span-2", // Tall
      "col-span-1 sm:col-span-1 md:col-span-1 md:row-span-1", // Square
      "col-span-2 sm:col-span-1 md:col-span-2 md:row-span-1", // Wide
      "col-span-1 sm:col-span-1 md:col-span-1 md:row-span-2", // Tall
      "col-span-1 sm:col-span-2 md:col-span-2 md:row-span-2", // Large
      "col-span-1 sm:col-span-1 md:col-span-1 md:row-span-1", // Square
      "col-span-2 sm:col-span-1 md:col-span-1 md:row-span-1", // Square
    ];
    return sizes[index % sizes.length];
  };

  // Extract flat list of skills from API mapping
  const apiSkills =
    portfolioData?.skills?.flatMap((cat: any) => cat.skills.map((s: any) => s.name)) || [];

  // Map the API skills (or fallback map) to dynamic sizes and consistent icons
  const finalSkills =
    apiSkills.length > 0
      ? apiSkills.map((skillName: string, index: number) => {
          const mapEntry = Object.entries(presentationMap).find(
            ([key]) => key.toLowerCase() === skillName.toLowerCase(),
          );
          const matchedData = mapEntry ? mapEntry[1] : null;

          // Assign a consistent fallback color based on the skill name hash
          const hash = skillName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const colors = [
            "#f7df1e",
            "#3178c6",
            "#38bdf8",
            "#8cc84b",
            "#f97316",
            "#ff0000",
            "#5a67d8",
            "#2496ed",
            "#10b981",
            "#a855f7",
            "#ec4899",
            "#14b8a6",
          ];

          return {
            name: skillName,
            icon: matchedData?.icon || <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />,
            size: getDynamicSize(index),
            accentColor: matchedData?.accentColor || colors[hash % colors.length],
          };
        })
      : Object.entries(presentationMap).map(([name, data], index) => ({
          name,
          ...data,
          size: getDynamicSize(index),
        }));

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
          {finalSkills.map((skill: any, index: number) => {
            const accent =
              isLight && skill.accentColor === "#ffffff"
                ? "#333333"
                : skill.accentColor || "#a855f7";

            return (
              <div
                key={skill.name}
                className={`relative group skill-card ${skill.size} duration-500 fill-mode-both`}
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
                      boxShadow: `0 0 24px ${accent}30, inset 0 0 12px ${accent}10`,
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
