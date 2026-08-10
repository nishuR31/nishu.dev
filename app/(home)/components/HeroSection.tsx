"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";
import { BackgroundPresets } from "@/components/ui/background-effects";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import PageLoader from "@/components/ui/page-loader";
import { usePortfolio } from "@/store";
import { prefersReducedMotion } from "@/lib/anime-utils";
import { HeroSkeleton } from "@/components/ui/skeletons";

const SkillsShowcase = dynamic(() => import("./SkillsShowcase"), {
  ssr: false,
  loading: () => <PageLoader />,
});

const ParticleCanvas = dynamic(() => import("@/components/ui/ParticleCanvas"), {
  ssr: false,
});

const photoFrames = "/iitSitting.avif";

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const { portfolioData, loading } = usePortfolio();
  const developer = portfolioData?.developer ?? {};


  // Anime.js: letter-by-letter reveal for hero heading
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;

    (async () => {
      try {
        const { animate, stagger } = await import("animejs");
        const el = titleRef.current;
        if (!el || cancelled) return;

        // Wrap each letter in a span
        const rawText = el.dataset.text || el.innerText;
        el.innerHTML = rawText
          .split("")
          .map((ch) =>
            ch === " "
              ? `<span style="display:inline-block;opacity:0">&nbsp;</span>`
              : `<span style="display:inline-block;opacity:0;transform:translateY(20px)">${ch}</span>`
          )
          .join("");

        animate(el.querySelectorAll("span"), {
          opacity: [0, 1],
          translateY: [20, 0],
          easing: "easeOutExpo",
          duration: 600,
          delay: stagger(30, { start: 200 }),
        });
      } catch {
        // Graceful fail: make text visible
        if (titleRef.current) {
          titleRef.current.style.opacity = "1";
        }
      }
    })();

    return () => { cancelled = true; };
  }, [developer.name]);

  // GSAP portrait parallax (existing, kept)
  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    (async () => {
      try {
        const gsapModule = await import("gsap");
        const ScrollTriggerModule = await import("gsap/ScrollTrigger");
        const gsap = gsapModule.default || gsapModule;
        const ScrollTrigger =
          (ScrollTriggerModule as Record<string, unknown>).ScrollTrigger ||
          (ScrollTriggerModule as Record<string, unknown>).default ||
          ScrollTriggerModule;
        (gsap as { registerPlugin: (p: unknown) => void }).registerPlugin(ScrollTrigger);

        ctx = (gsap as { context: (fn: () => void, scope: React.RefObject<HTMLElement | null>) => { revert: () => void } }).context(() => {
          if (portraitWrapRef.current) {
            (gsap as { to: (target: HTMLElement, opts: object) => void }).to(portraitWrapRef.current, {
              yPercent: -6,
              scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          }
        }, heroRef);
      } catch {
        // fail gracefully
      }
    })();

    return () => { try { ctx?.revert(); } catch { /* ignore */ } };
  }, []);

  const fullName = `Hi, I'm ${developer.name || "Nishan"}`;

  return (
    <section
      ref={heroRef}
      className="min-h-[calc(100vh-140px)] flex items-center justify-center relative overflow-hidden"
    >
      <BackgroundPresets.Minimal />
      <ParticleCanvas count={50} className="opacity-60" />

      <div className="container px-6 mx-auto">
        {loading ? (
          <HeroSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative max-w-3xl mx-auto space-y-8 text-center"
          >
            {/* Profile photo stack */}
            <motion.div
              ref={portraitWrapRef}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="pt-4 hero-portrait-wrap sm:pt-6"
            >
              <div className="relative mx-auto w-52 h-72 sm:w-64 sm:h-80 floating-gravity rounded-2xl overflow-hidden drop-shadow-2xl shadow-2xl">
                <Image
                  src={photoFrames}
                  loading="eager"
                  alt="Nishan Rajak Profile"
                  fill
                  sizes="(max-width: 640px) 208px, 256px"
                  className="object-cover pointer-events-none select-none"
                  priority
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* Welcome chip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 space-x-2 rounded-full hero-chip glass-premium text-foreground"
            >
              <Code2 className="w-5 h-5" />
              <span className="text-md font-medium">Welcome to my portfolio</span>
            </motion.div>

            {/* Gradient heading — Anime.js reveals letters */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight hero-title md:text-7xl font-['Outfit',sans-serif]">
                <span
                  ref={titleRef}
                  data-text={fullName}
                  className="block mb-2 gradient-heading"
                  style={{ opacity: 1 }}
                >
                  {fullName}
                </span>
                <span className="block text-2xl hero-subtitle text-foreground/80 md:text-4xl mt-2">
                  {developer.tagline}
                </span>
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="max-w-2xl mx-auto text-base leading-relaxed hero-bio sm:text-md text-muted-foreground"
            >
              {developer.bio}
            </motion.p>

            {/* Metrics chips */}
            <div className="flex flex-wrap justify-center max-w-xl gap-3 mx-auto hero-metrics">
              <span className="px-4 py-2 text-xs rounded-full glass-panel floating-gravity text-card-foreground/90">
                Role: {developer.role}
              </span>
              <span className="px-4 py-2 text-xs rounded-full glass-panel floating-gravity text-card-foreground/90">
                Location: {developer.location}
              </span>
              <span className="px-4 py-2 text-xs rounded-full glass-panel floating-gravity text-card-foreground/90" >
                <a href={`mailto:${developer.email}`} target="_blank" rel="noopener noreferrer">Email: {developer.email}</a>
              </span>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="flex flex-wrap justify-center gap-4 pt-6 hero-actions"
            >
              <Link href="/projects">
                <Button
                  variant="outline"
                  Icon={ArrowRight}
                  iconPlacement="right"
                  className="group px-6 py-6 text-base font-semibold transition-all duration-300 rounded-full glass-panel text-foreground bg-foreground/5 hover:border-foreground/5"
                >
                  View Projects
                </Button>
              </Link>
            </motion.div>

            {/* Glow orb */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute inset-0 pointer-events-none -z-10"
            >
              <div className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-500/10 rounded-full blur-3xl" />
              <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] bg-zinc-400/5 rounded-full blur-3xl" />
            </motion.div>
          </motion.div>

        )}

        <SkillsShowcase />
      </div>
    </section>
  );
};

export default HeroSection;
