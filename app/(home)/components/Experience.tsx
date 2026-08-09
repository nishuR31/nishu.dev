"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { usePortfolio } from "@/store";
import { useAnimeOnScroll, prefersReducedMotion } from "@/lib/anime-utils";

interface Experience {
  position: string;
  company: string;
  period: string;
  location?: string;
  description?: string;
  responsibilities?: string[];
  technologies?: string[];
}

const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  },
};

/* Draws the SVG vertical timeline line using Anime.js stroke-dashoffset */
const TimelineConnector: React.FC<{ height: number }> = ({ height }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGLineElement>(null);

  useAnimeOnScroll(svgRef, async () => {
    try {
      const { animate } = await import("animejs");
      const path = pathRef.current;
      if (!path) return;
      const len = height;
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
      animate(path, {
        strokeDashoffset: [len, 0],
        easing: "easeInOutSine",
        duration: 1200,
      });
    } catch {
      if (pathRef.current) {
        pathRef.current.style.strokeDashoffset = "0";
      }
    }
  });

  return (
    <svg
      ref={svgRef}
      className="timeline-line-svg absolute left-6 top-12 -z-0"
      width="2"
      height={height}
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <line
        ref={pathRef}
        x1="1"
        y1="0"
        x2="1"
        y2={height}
        stroke="url(#timelineGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#71717a" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const ExperienceSection: React.FC = () => {
  const { portfolioData } = usePortfolio();
  const experiences: Experience[] = portfolioData?.experiences ?? [];
  const sectionRef = useRef<HTMLDivElement>(null);
  const [connectorHeight, setConnectorHeight] = React.useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    setConnectorHeight(el.offsetHeight - 48);
  }, [experiences.length]);

  if (!experiences || experiences.length === 0) return null;

  return (
    <section className="py-24 cv-auto" id="experience">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-16"
        >
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <motion.div
              variants={itemAnimation}
              className="inline-flex items-center space-x-2 bg-zinc-500/10 border border-zinc-500/20 px-4 py-2 rounded-full text-foreground backdrop-blur-sm"
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-sm font-medium">Professional Experience</span>
            </motion.div>
            <motion.div variants={itemAnimation} className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold font-['Outfit',sans-serif] gradient-heading">
                Work Experience
              </h2>
              <p className="text-lg text-muted-foreground">
                A journey through my professional career and key achievements
              </p>
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div ref={sectionRef} className="relative">
              {/* Animated timeline connector */}
              <TimelineConnector height={connectorHeight} />

              <motion.div variants={containerAnimation} className="space-y-8">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    variants={itemAnimation}
                    className="relative"
                  >
                    <div className="flex gap-6">
                      {/* Timeline node */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-xl bg-card border border-border/60 flex items-center justify-center shadow-lg z-10 ${index === 0 ? "timeline-pulse border-zinc-500/50" : ""}`}
                        >
                          <Briefcase className={`w-6 h-6 ${index === 0 ? "text-zinc-400" : "text-foreground"}`} />
                        </div>
                      </div>

                      {/* Card */}
                      <div className="flex-1 pb-8">
                        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-md shadow-[0_4px_6px_rgba(0,0,0,0.15)] hover:border-zinc-500/40 transition-all duration-300 group hover:shadow-[0_6px_24px_rgba(255,255,255,0.05)]">
                          {/* Left accent stripe */}
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-zinc-500 to-zinc-500/60 opacity-60 rounded-l-2xl" />

                          {/* Shiny hover sweep */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-500/10 to-transparent shiny-sweep" />
                          </div>

                          <div className="relative z-10 pl-3">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-foreground mb-1 font-['Outfit',sans-serif]">
                                  {exp.position}
                                </h3>
                                <p className="text-zinc-400/90 font-medium">{exp.company}</p>
                              </div>
                              <div className="flex flex-col gap-1 items-start md:items-end text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>{exp.period}</span>
                                </div>
                                {exp.location && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{exp.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {exp.description && (
                              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                {exp.description}
                              </p>
                            )}

                            {exp.responsibilities && exp.responsibilities.length > 0 && (
                              <ul className="space-y-2">
                                {exp.responsibilities.map((r, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="text-zinc-400/70 mt-1.5">▸</span>
                                    <span>{r}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {exp.technologies && exp.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/70">
                                {exp.technologies.map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-zinc-500/10 text-foreground px-3 py-1 rounded-full border border-zinc-500/20"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
