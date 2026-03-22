/* eslint-disable react/no-unescaped-entities */
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
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils
        .toArray(
          ".hero-chip, .hero-portrait-wrap, .hero-title, .hero-subtitle, .hero-bio, .hero-actions, .hero-metrics",
        )
        .forEach((item) => {
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

      gsap.to(".hero-glow", {
        scale: 1.08,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".hero-glow", {
        yPercent: 18,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-portrait-wrap", {
        yPercent: -10,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="min-h-[calc(100vh-140px)] flex items-center justify-center relative overflow-hidden"
    >
      <BackgroundPresets.Minimal />

      <div className="container mx-auto px-6">
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="show"
          className="max-w-3xl mx-auto text-center space-y-8 relative"
        >
          <motion.div
            variants={itemAnimation}
            className="hero-portrait-wrap pt-4 sm:pt-6"
          >
            <div className="mx-auto w-52 h-72 sm:w-64 sm:h-80 relative floating-gravity">
              {[0, 1, 2].map((layer) => {
                const frameIndex = (activeFrame + layer) % photoFrames.length;
                return (
                  <Image
                    key={layer}
                    src={photoFrames[frameIndex]}
                    alt={`${config.developer.name} profile frame ${frameIndex + 1}`}
                    onError={(e) => {
                      e.currentTarget.src = "/profile-waist.svg";
                    }}
                    fill
                    className="absolute inset-0 w-full h-full object-cover outline outline-1 outline-primary/25 transition-all duration-700"
                    style={{
                      opacity:
                        layer === 0 ? 1
                        : layer === 1 ? 0.45
                        : 0.22,
                      transform: `translate(${layer * 6}px, ${layer * 4}px)`,
                      zIndex: 3 - layer,
                    }}
                  />
                );
              })}
              <div className="absolute inset-0 pointer-events-none outline outline-1 outline-primary/20" />
            </div>
          </motion.div>

          <motion.div
            variants={itemAnimation}
            className="hero-chip inline-flex items-center space-x-2 glass-panel px-4 py-2 rounded-full text-primary"
          >
            <Code2 className="w-5 h-5" />
            <span className="text-sm font-medium">Welcome to my portfolio</span>
          </motion.div>

          <div className="space-y-4">
            <h1 className="hero-title text-4xl md:text-7xl font-bold tracking-tight">
              <span className="block text-foreground mb-2">
                Hi, I'm {config.developer.shortName}
              </span>
              <span className="hero-subtitle block text-foreground text-2xl md:text-4xl">
                {config.developer.tagline}
              </span>
            </h1>
          </div>

          <motion.p
            variants={itemAnimation}
            className="hero-bio text-base sm:text-md text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            {config.developer.bio}
          </motion.p>

          <div className="hero-metrics mx-auto flex max-w-xl flex-wrap justify-center gap-3">
            <span className="glass-panel floating-gravity rounded-full px-4 py-2 text-xs text-card-foreground/90">
              Role: {config.developer.role}
            </span>
            <span className="glass-panel floating-gravity rounded-full px-4 py-2 text-xs text-card-foreground/90">
              Location: {config.developer.location}
            </span>
            <span className="glass-panel floating-gravity rounded-full px-4 py-2 text-xs text-card-foreground/90">
              Email: {config.developer.email}
            </span>
          </div>

          <motion.div
            variants={itemAnimation}
            className="hero-actions flex flex-wrap gap-4 justify-center pt-6"
          >
            <Link href={"/projects"}>
              <Button
                variant="expandIcon"
                Icon={ArrowRight}
                iconPlacement="right"
                className="rounded-full px-6 py-6 text-base transition-all duration-300 hover:scale-105 font-semibold"
              >
                View Projects
              </Button>
            </Link>
            <Link href={"/contact"}>
              <Button
                variant="outline"
                className="rounded-full px-6 py-6 text-base transition-all duration-300 hover:scale-105 font-semibold"
              >
                Let’s work together
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute -z-10 inset-0 pointer-events-none"
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
