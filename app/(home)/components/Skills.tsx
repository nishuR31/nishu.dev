"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Boxes, Code2, Cpu, Database, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/store";
import { SkillsSkeleton } from "@/components/ui/skeletons";

interface Skill {
  name: string;
  level: "Expert" | "Advanced" | "Intermediate" | "Beginner" | string;
  hot?: boolean;
}

interface SkillCategory {
  title: string;
  description: string;
  iconKey: string;
  bgClass: string;
  iconClass: string;
  skills: Skill[];
}

const categoryIconMap: Record<string, React.FC<{ className?: string }>> = {
  frontend: Code2,
  backend: Database,
  tools: Boxes,
};

const getLevelPercentage = (level: string): number => {
  switch (level) {
    case "Expert": return 95;
    case "Advanced": return 85;
    case "Intermediate": return 70;
    case "Beginner": return 50;
    default: return 75;
  }
};

const getLevelGradient = (bgClass: string): string => {
  const map: Record<string, string> = {
    "bg-blue-500/10": "from-blue-500 to-cyan-400",
    "bg-emerald-500/10": "from-emerald-500 to-teal-400",
    "bg-orange-500/10": "from-orange-500 to-amber-400",
    "bg-red-500/10": "from-red-500 to-pink-400",
  };
  return map[bgClass] || "from-zinc-500 to-cyan-400";
};

const containerAnimation = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  },
};

const SkillBar: React.FC<{ percentage: number; gradient: string }> = ({ percentage, gradient }) => {
  return (
    <div className="h-1.5 bg-zinc-800/50 rounded-full overflow-hidden mt-2">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${percentage}%` }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.15 }}
        className={cn(
          "h-full bg-gradient-to-r rounded-full skill-bar-glow-anim",
          gradient
        )}
      />
    </div>
  );
};

const SkillCard: React.FC<{ skill: Skill; bgClass: string }> = ({ skill, bgClass }) => {
  const levelPercentage = getLevelPercentage(skill.level);
  const gradient = getLevelGradient(bgClass);

  return (
    <motion.div variants={itemAnimation} className="relative flex flex-col h-full">
      <div className="relative h-full p-4 rounded-xl border border-zinc-800/50 hover:border-zinc-500/30 transition-all duration-300 bg-card/30 backdrop-blur-sm group hover:shadow-[0_0_20px_rgba(168,85,247,0.08)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-foreground/90">{skill.name}</h3>
          {skill.hot && (
            <Badge
              variant="secondary"
              className="bg-amber-500/10 text-zinc-400 border-none px-2 py-0 text-xs"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Hot
            </Badge>
          )}
        </div>

        <SkillBar percentage={levelPercentage} gradient={gradient} />

        <div className="mt-2 flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Proficiency</span>
          <span className="font-medium text-zinc-400">{skill.level}</span>
        </div>
      </div>
    </motion.div>
  );
};

const CategorySection: React.FC<{ category: SkillCategory }> = ({ category }) => {
  const CategoryIcon = categoryIconMap[category.iconKey] || Code2;

  const iconBgMap: Record<string, string> = {
    "bg-blue-500/10": "bg-blue-500/15 border-blue-500/30",
    "bg-emerald-500/10": "bg-emerald-500/15 border-emerald-500/30",
    "bg-orange-500/10": "bg-orange-500/15 border-orange-500/30",
    "bg-red-500/10": "bg-red-500/15 border-red-500/30",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={cn("p-2.5 rounded-xl border", iconBgMap[category.bgClass] || "bg-purple-500/15 border-purple-500/30")}>
          <CategoryIcon className={cn("w-5 h-5", category.iconClass)} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground font-outfit">
            {category.title}
          </h3>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {category.skills.map((skill, idx) => (
          <SkillCard key={idx} skill={skill} bgClass={category.bgClass} />
        ))}
      </div>
    </div>
  );
};

const SkillsSection: React.FC = () => {
  const { portfolioData, loading } = usePortfolio();
  const skills: SkillCategory[] = portfolioData?.skills ?? [];

  if (loading) return <SkillsSkeleton />;

  return (
    <section className="py-24 cv-auto" id="skills">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-16"
        >
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <motion.div
              variants={itemAnimation}
              className="inline-flex items-center space-x-2 bg-zinc-500/10 border border-zinc-500/20 px-4 py-2 rounded-full text-foreground backdrop-blur-sm"
            >
              <Cpu className="w-5 h-5" />
              <span className="text-sm font-medium">Skills &amp; Technologies</span>
            </motion.div>

            <motion.div variants={itemAnimation} className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold font-outfit gradient-heading">
                Technical Proficiency
              </h2>
              <p className="text-lg text-muted-foreground">
                A comprehensive overview of my technical expertise across various development domains.
              </p>
            </motion.div>
          </div>

          <motion.div variants={containerAnimation} className="space-y-16">
            {skills.map((category, index) => (
              <CategorySection key={index} category={category} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
