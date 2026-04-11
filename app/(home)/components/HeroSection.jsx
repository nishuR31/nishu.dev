"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2 } from "lucide-react";
import { config } from "@/config";
import Link from "next/link";
import { BackgroundPresets } from "@/components/ui/background-effects";
import { motion } from "framer-motion";
import SkillsShowcase from "./SkillsShowcase";
// load GSAP only on the client when needed to reduce initial bundle size

const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: "easeOut",
    },
  },
};

const textAnimation = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.32,
      ease: "easeOut",
    },
  },
};

const HeroSection = () => {
  const heroRef = useRef(null);
  const photoFrames = ["/profile-1.jpg", "/profile-2.jpg", "/profile-3.jpg"];
  const [activeFrame, setActiveFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFrame((prev) => (prev + 1) % photoFrames.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [photoFrames.length]);

  useEffect(() => {
    let ctx;
    let gsap;
    (async () => {
      try {
        const gsapModule = await import("gsap");
        const ScrollTriggerModule = await import("gsap/ScrollTrigger");
        gsap = gsapModule.default || gsapModule;
        const ScrollTrigger =
          ScrollTriggerModule.ScrollTrigger ||
          ScrollTriggerModule.default ||
          ScrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const elems = gsap.utils.toArray(
            ".hero-chip, .hero-portrait-wrap, .hero-title, .hero-subtitle, .hero-bio, .hero-actions, .hero-metrics",
          );

          elems.forEach((item) => {
            gsap.fromTo(
              item,
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                duration: 0.35,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: item,
                  start: "top 96%",
                  toggleActions: "play none none none",
                  once: true,
                },
              },
            );
          });

          // Scroll-based subtle portrait/hero movement (uses transforms only)
          gsap.to(".hero-portrait-wrap", {
            yPercent: -6,
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }, heroRef);
      } catch (err) {
        // fail gracefully if GSAP load fails
        console.warn("GSAP failed to load dynamically", err);
      }
    })();

    return () => {
      try {
        if (ctx) ctx.revert();
      } catch (e) {}
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="min-h-[calc(100vh-140px)] flex items-center justify-center relative overflow-hidden"
    >
      <BackgroundPresets.Minimal />

      <div className="container px-6 mx-auto">
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="show"
          className="relative max-w-3xl mx-auto space-y-8 text-center"
        >
          <motion.div
            variants={itemAnimation}
            className="pt-4 hero-portrait-wrap sm:pt-6"
          >
            <div className="relative mx-auto w-52 h-72 sm:w-64 sm:h-80 floating-gravity">
              {[0, 1, 2].map((layer) => {
                const frameIndex = (activeFrame + layer) % photoFrames.length;
                return (
                  <div
                    key={layer}
                    v-if="true"
                    className="absolute inset-0 flex items-center justify-center w-full h-full overflow-hidden transition-all duration-700 border rounded-2xl outline outline-1 outline-primary/25 bg-zinc-900 border-zinc-800"
                    style={{
                      opacity:
                        layer === 0 ? 1
                        : layer === 1 ? 0.45
                        : 0.22,
                      transform: `translate(${layer * 6}px, ${layer * 4}px)`,
                      zIndex: 3 - layer,
                    }}
                  >
                    {/* Fallback pattern instead of broken image */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent" />
                    {layer === 0 && (
                      <div className="relative z-10 flex items-center justify-center w-full h-full">
                        <div className="flex items-center justify-center w-24 h-24 border rounded-full bg-primary/10 border-primary/20">
                          <Code2 className="w-10 h-10 text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="absolute inset-0 pointer-events-none outline outline-1 outline-primary/20" />
            </div>
          </motion.div>

          <motion.div
            variants={itemAnimation}
            className="inline-flex items-center px-4 py-2 space-x-2 rounded-full hero-chip glass-panel text-primary"
          >
            <Code2 className="w-5 h-5" />
            <span className="text-sm font-medium">Welcome to my portfolio</span>
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight hero-title md:text-7xl">
              <span className="block mb-2 text-foreground">
                Hi, I'm {config.developer.shortName}
              </span>
              <span className="block text-2xl hero-subtitle text-foreground md:text-4xl">
                {config.developer.tagline}
              </span>
            </h1>
          </div>

          <motion.p
            variants={itemAnimation}
            className="max-w-2xl mx-auto text-base leading-relaxed hero-bio sm:text-md text-muted-foreground"
          >
            {config.developer.bio}
          </motion.p>

          <div className="flex flex-wrap justify-center max-w-xl gap-3 mx-auto hero-metrics">
            <span className="px-4 py-2 text-xs rounded-full glass-panel floating-gravity text-card-foreground/90">
              Role: {config.developer.role}
            </span>
            <span className="px-4 py-2 text-xs rounded-full glass-panel floating-gravity text-card-foreground/90">
              Location: {config.developer.location}
            </span>
            <span className="px-4 py-2 text-xs rounded-full glass-panel floating-gravity text-card-foreground/90">
              Email: {config.developer.email}
            </span>
          </div>

          <motion.div
            variants={itemAnimation}
            className="flex flex-wrap justify-center gap-4 pt-6 hero-actions"
          >
            <Link href={"/projects"}>
              <Button
                variant="expandIcon"
                Icon={ArrowRight}
                iconPlacement="right"
                className="px-6 py-6 text-base font-semibold transition-all duration-300 rounded-full hover:scale-105"
              >
                View Projects
              </Button>
            </Link>
            {/* Contact removed — use Projects link only */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute inset-0 pointer-events-none -z-10"
          >
            <div className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
          </motion.div>
        </motion.div>
        <SkillsShowcase />
      </div>
    </section>
  );
};

export default HeroSection;
