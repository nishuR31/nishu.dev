"use client";
import React, { useRef } from "react";
import { motion, Variants } from "framer-motion";
import { UserCircle, Code2, Database, Layout, Zap } from "lucide-react";
import { usePortfolio } from "@/store";
import { AboutSkeleton } from "@/components/ui/skeletons";
import { toast } from "sonner";
import { useCountUp } from "@/lib/anime-utils";

const containerAnimation: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemAnimation: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  },
};

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
  const { portfolioData, error, loading } = usePortfolio();

  if (loading) return <AboutSkeleton />;
  if (error) {
    toast.error(error);
    return null;
  }

  const projectCount = portfolioData?.projects?.length ?? 0;

  return (
    <section className="py-24 relative overflow-hidden" id="about">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <motion.div
              variants={itemAnimation}
              className="inline-flex items-center space-x-2 bg-primary/10 border border-border px-4 py-2 rounded-full text-foreground backdrop-blur-sm"
            >
              <UserCircle className="w-5 h-5" />
              <span className="text-sm font-medium">About Me</span>
            </motion.div>
            <motion.h2
              variants={itemAnimation}
              className="text-3xl md:text-5xl font-bold tracking-tight font-outfit gradient-heading"
            >
              My Journey &amp; Vision
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div variants={itemAnimation} className="space-y-6">
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
                <CountUpStat target={2} label="Years Exp." />
                <CountUpStat target={projectCount} label="Projects" />
                <CountUpStat target={10} suffix="+" label="Certificates" />
              </div>
            </motion.div>

            {/* Bento philosophy card */}
            <motion.div
              variants={itemAnimation}
              className="relative"
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
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
