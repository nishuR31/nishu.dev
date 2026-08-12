"use client";
import React, { useEffect, useRef } from "react";
import { useScrollReveal } from "@/lib/anime-utils";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { usePortfolio } from "@/store";
import { ExperienceSkeleton } from "@/components/ui/skeletons";

interface Experience {
  position: string;
  company: string;
  period: string;
  location?: string;
  description?: string;
  responsibilities?: string[];
  technologies?: string[];
}



const TimelineConnector: React.FC<{ height: number }> = ({ height }) => {
  return (
    <svg
      className="timeline-line-svg absolute left-6 top-12 -z-0"
      width="2"
      height={height}
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <line
        x1="1"
        y1="0"
        x2="1"
        y2={height}
        stroke="url(#timelineGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        className="reveal-on-scroll transition-all duration-[1200ms] ease-in-out"
        style={{ strokeDasharray: height, strokeDashoffset: height }}
        ref={(el) => {
          if (el) {
            // Using a tiny IntersectionObserver inside the ref or rely on global data-state
            // If the element has data-state="visible", we apply style
            // Actually, we can just use tailwind arbitrarily:
            // But data-[state=visible] for arbitrary value needs to override style...
            // Let's rely on standard class:
          }
        }}
        // In order to make stroke-dashoffset transition to 0, we can use a class 
      />
      <style jsx>{`
        line[data-state="visible"] {
          stroke-dashoffset: 0 !important;
        }
      `}</style>
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
  useScrollReveal();
  const { portfolioData, loading } = usePortfolio();
  const experiences: Experience[] = portfolioData?.experiences ?? [];
  const sectionRef = useRef<HTMLDivElement>(null);
  const [connectorHeight, setConnectorHeight] = React.useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    setConnectorHeight(el.offsetHeight - 48);
  }, [experiences.length]);

  if (loading) return <ExperienceSkeleton />;
  if (!experiences || experiences.length === 0) return null;

  return (
    <section className="py-24 cv-auto" id="experience">
      <div className="container mx-auto px-6">
        <div
          className="space-y-16"
        >
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div
              className="inline-flex items-center space-x-2 bg-zinc-500/10 border border-zinc-500/20 px-4 py-2 rounded-full text-foreground backdrop-blur-sm reveal-on-scroll opacity-0 -translate-x-6 data-[state=visible]:animate-in data-[state=visible]:fade-in data-[state=visible]:slide-in-from-left-6 duration-500 fill-mode-both"
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-sm font-medium">Professional Experience</span>
            </div>
            <div className="space-y-2 reveal-on-scroll opacity-0 -translate-x-6 data-[state=visible]:animate-in data-[state=visible]:fade-in data-[state=visible]:slide-in-from-left-6 duration-500 delay-100 fill-mode-both">
              <h2 className="text-3xl md:text-4xl font-bold font-outfit gradient-heading">
                Work Experience
              </h2>
              <p className="text-lg text-muted-foreground">
                A journey through my professional career and key achievements
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div ref={sectionRef} className="relative">
              {/* Animated timeline connector */}
              <TimelineConnector height={connectorHeight} />

              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="relative reveal-on-scroll opacity-0 -translate-x-6 data-[state=visible]:animate-in data-[state=visible]:fade-in data-[state=visible]:slide-in-from-left-6 duration-500 fill-mode-both"
                    style={{ animationDelay: `${200 + index * 150}ms` }}
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
                                <h3 className="text-xl font-bold text-foreground mb-1 font-outfit">
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
