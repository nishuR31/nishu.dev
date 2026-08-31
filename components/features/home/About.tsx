"use client";
import React, { useRef } from "react";
import { useScrollReveal } from "@/lib/anime-utils";
import { UserCircle, Code2, Database, Layout, Zap } from "lucide-react";
import { usePortfolio } from "@/store";
import { AboutSkeleton } from "@/components/ui/skeletons";
import { toast } from "sonner";
import { useCountUp } from "@/lib/anime-utils";



/* Count-up number display */
const CountUpStat: React.FC<{ target: number; suffix?: string; label: string }> = ({
  target,
  suffix = "+",
  label,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  useCountUp(ref, target, 1400, suffix);

  return (
    <div className="text-center">
      <span
        ref={ref}
        className="text-3xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent"
      >
        {target}{suffix}
      </span>
      <div className="text-sm font-medium text-muted-foreground mt-1">{label}</div>
    </div>
  );
};

const AboutSection: React.FC = () => {
  useScrollReveal();
  const { portfolioData, error, loading } = usePortfolio();

  if (loading || !portfolioData?.developer?.name) return <AboutSkeleton />;

  const projectCount = portfolioData?.projects?.length ?? 0;
  const certCount = portfolioData?.certificates?.length ?? 0;
  const yearsExp = Math.max(1, Math.round((new Date().getTime() - new Date("2023-08-01").getTime()) / (1000 * 60 * 60 * 24 * 365.25)));

  return (
    <section className="py-24 relative overflow-hidden" id="about">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <div
              className="inline-flex items-center space-x-2 bg-primary/10 border border-border px-4 py-2 rounded-full text-foreground backdrop-blur-sm reveal-on-scroll opacity-0 translate-y-4 data-[state=visible]:animate-in data-[state=visible]:fade-in data-[state=visible]:slide-in-from-bottom-4 duration-700 fill-mode-both"
            >
              <UserCircle className="w-5 h-5" />
              <span className="text-sm font-medium">About Me</span>
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold tracking-tight font-outfit gradient-heading reveal-on-scroll opacity-0 translate-y-4 data-[state=visible]:animate-in data-[state=visible]:fade-in data-[state=visible]:slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both"
            >
              My Journey &amp; Vision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6 reveal-on-scroll opacity-0 translate-y-4 data-[state=visible]:animate-in data-[state=visible]:fade-in data-[state=visible]:slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
              {(portfolioData?.developer?.about ?? []).map((paragraph: string, idx: number) => (
                <p
                  key={idx}
                  className="text-lg text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4"
                >
                  {paragraph}
                </p>
              ))}

              {/* Animated counters */}
              <div className="pt-4 border-t border-border flex space-x-8">
                <CountUpStat target={yearsExp} label="Years Exp." />
                <CountUpStat target={projectCount} label="Projects" />
                <CountUpStat target={certCount} suffix="+" label="Certificates" />
              </div>

              {/* Core Strengths */}
              {(portfolioData?.strengths ?? []).length > 0 && (
                <div className="pt-4 space-y-2">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Key Strengths & Core Competencies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(portfolioData?.strengths ?? []).map((str: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs font-medium bg-primary/10 border border-primary/20 rounded-full text-foreground"
                      >
                        {str}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bento philosophy card */}
            <div
              className="relative reveal-on-scroll opacity-0 translate-y-4 data-[state=visible]:animate-in data-[state=visible]:fade-in data-[state=visible]:slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/10 rounded-3xl blur-2xl" />
              <div className="relative flex flex-col gap-4 glass-premium rounded-3xl p-6 border border-border overflow-hidden group">
                {/* Decorative grid */}
                <div
                  className="absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-25"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #80808012 1px, transparent 1px), linear-gradient(to bottom, #80808012 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Top tile — philosophy */}
                <div className="relative z-10 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-muted-foreground border border-border">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2 font-outfit">
                      Core Philosophy
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Writing scalable systems means planning for tomorrow while delivering
                      functional excellence today. Modularity, security, and clean code are
                      at the heart of everything I build.
                    </p>
                  </div>
                </div>

                {/* Bottom 3-tile bento */}
                <div className="relative z-10 grid grid-cols-3 gap-3 mt-2">
                  <div className="glass-panel bg-background/40 rounded-2xl p-4 border border-border flex flex-col items-center justify-center text-center gap-1">
                    <Code2 className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-[10px] font-semibold text-foreground">Clean Code</span>
                  </div>
                  <div className="glass-panel bg-background/40 rounded-2xl p-4 border border-border flex flex-col items-center justify-center text-center gap-1">
                    <Layout className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-[10px] font-semibold text-foreground">Scalable Arch.</span>
                  </div>
                  <div className="glass-panel bg-background/40 rounded-2xl p-4 border border-border flex flex-col items-center justify-center text-center gap-1">
                    <Zap className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-[10px] font-semibold text-foreground">Performance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
