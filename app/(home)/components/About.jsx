"use client";
import React from "react";
import { motion } from "framer-motion";
import { UserCircle, Code2, Database, Layout } from "lucide-react";
import { config } from "@/config";

const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

const AboutSection = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="about">
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
              className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary backdrop-blur-sm"
            >
              <UserCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">About Me</span>
            </motion.div>
            <motion.h2
              variants={itemAnimation}
              className="text-3xl md:text-5xl font-bold tracking-tight text-foreground"
            >
              My Journey & Vision
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div variants={itemAnimation} className="space-y-6">
              {config.developer.about?.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-lg text-muted-foreground leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
              <div className="pt-4 border-t border-zinc-800/50 flex space-x-6">
                <div>
                  <div className="text-3xl font-bold text-primary">2+</div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">
                    Years Exp.
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {config.projects.length}+
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">
                    Projects
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visual Element / Glass Card */}
            <motion.div
              variants={itemAnimation}
              className="relative aspect-square md:aspect-auto md:h-full md:min-h-[400px]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl blur-2xl" />
              <div className="relative h-full flex flex-col justify-between glass-panel rounded-3xl p-8 border border-zinc-800/60 overflow-hidden group">
                {/* Decorative background grid */}
                <div
                  className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #80808012 1px, transparent 1px), linear-gradient(to bottom, #80808012 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Core Philosophy
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed break-words">
                      Writing scalable systems means planning for tomorrow while
                      delivering functional excellence today. Modularity,
                      security, optimized and clean code are at the heart of
                      everything I build.
                    </p>
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-4 mt-8">
                  <div className="glass-panel bg-background/40 rounded-2xl p-4 border border-zinc-800/50 flex flex-col items-center justify-center text-center">
                    <Code2 className="w-6 h-6 text-emerald-500 mb-2" />
                    <span className="text-xs font-semibold text-foreground">
                      Clean Code
                    </span>
                  </div>
                  <div className="glass-panel bg-background/40 rounded-2xl p-4 border border-zinc-800/50 flex flex-col items-center justify-center text-center">
                    <Layout className="w-6 h-6 text-blue-500 mb-2" />
                    <span className="text-xs font-semibold text-foreground">
                      Scalable Arch.
                    </span>
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
