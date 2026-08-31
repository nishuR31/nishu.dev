"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";
import { BackgroundPresets } from "@/components/ui/background-effects";
import SkillsShowcase from "./SkillsShowcase";
import { usePortfolio } from "@/store";
import { prefersReducedMotion } from "@/lib/anime-utils";
import { HeroSkeleton } from "@/components/ui/skeletons";


const photoFrames = "/iitSitting.avif";

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const { portfolioData, loading } = usePortfolio();
  const developer = portfolioData?.developer ?? {};



  const fullName = `Hi, I'm ${developer.name || "Nishan"}`;

  return (
    <section
      ref={heroRef}
      className="min-h-[calc(100vh-140px)] flex items-center justify-center relative overflow-hidden"
    >
      <BackgroundPresets.Minimal />

      <div className="container px-6 mx-auto">
        {loading || !portfolioData?.developer?.name ? (
          <HeroSkeleton />
        ) : (
          <div className="relative max-w-3xl mx-auto space-y-8 text-center">
            {/* Profile photo stack */}
            <div
              ref={portraitWrapRef}
              className="pt-4 hero-portrait-wrap sm:pt-6 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700"
            >
              <div className="relative mx-auto w-52 h-72 sm:w-64 sm:h-80 floating-gravity rounded-2xl overflow-hidden dark:drop-shadow-2xl dark:shadow-2xl">
                <Image
                  src={photoFrames}
                  loading="eager"
                  alt="Nishan Rajak Profile"
                  fill
                  sizes="(max-width: 640px) 208px, 256px"
                  className="object-cover pointer-events-none select-none"
                  priority
                />
                <div className="absolute inset-0 z-10 pointer-events-none" />
              </div>
            </div>

            {/* Welcome chip */}
            <div className="inline-flex items-center px-4 py-2 space-x-2 rounded-full hero-chip glass-premium text-foreground animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200 fill-mode-both">
              <Code2 className="w-5 h-5" />
              <span className="text-md font-medium">Welcome to my portfolio</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight hero-title md:text-7xl font-outfit">
                <span className="block mb-2 gradient-heading flex-wrap justify-center flex">
                  {fullName.split("").map((ch, i) => (
                    <span
                      key={i}
                      className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500"
                      style={{ display: "inline-block", animationDelay: `${200 + i * 30}ms` }}
                    >
                      {ch === " " ? "\u00A0" : ch}
                    </span>
                  ))}
                </span>
                <span className="block text-2xl hero-subtitle text-foreground/80 md:text-4xl mt-2 animate-in fade-in duration-700 delay-500 fill-mode-both">
                  {developer.tagline}
                </span>
              </h1>
            </div>

            <p className="max-w-2xl mx-auto text-base leading-relaxed hero-bio sm:text-md text-muted-foreground animate-in fade-in duration-700 delay-300 fill-mode-both">
              {developer.bio}
            </p>

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
            <div className="flex flex-wrap justify-center gap-4 pt-6 hero-actions animate-in fade-in slide-in-from-bottom-2 duration-700 delay-500 fill-mode-both">
              <Button
                asChild
                variant="outline"
                Icon={ArrowRight}
                iconPlacement="right"
                className="group px-6 py-6 text-base font-semibold transition-all duration-300 rounded-full glass-panel text-foreground bg-foreground/5 hover:border-foreground/5"
              >
                <Link href="/projects">
                  View Projects
                </Link>
              </Button>
            </div>

            <div className="absolute inset-0 pointer-events-none -z-10 animate-in fade-in duration-1000 delay-700 fill-mode-both">
              <div className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-500/10 rounded-full blur-3xl" />
              <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] bg-zinc-400/5 rounded-full blur-3xl" />
            </div>
          </div>

        )}

        <SkillsShowcase />
      </div>
    </section>
  );
};

export default HeroSection;
