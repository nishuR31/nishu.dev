/**
 * skeletons.jsx
 * ------------
 * Section-specific ghost / skeleton loaders shown while the portfolio API
 * is still hydrating the Redux store.  Each skeleton mirrors the real
 * section's layout so there is zero layout-shift when content arrives.
 *
 * Usage:
 *   import { HeroSkeleton, AboutSkeleton, ... } from "@/components/ui/skeletons";
 */

"use client";
import React from "react";

/* ─── tiny primitive ──────────────────────────────────────────────────── */
const S = ({ className = "", style = {} }) => (
  <div className={`skeleton-shimmer ${className}`} style={style} />
);

/* ═══════════════════════════════════════════════════════════════════════
   HEADER NAV SKELETON
   Ghost nav links shown while NAV_ITEMS haven't loaded yet.
   ══════════════════════════════════════════════════════════════════════ */
export const NavSkeleton = () => (
  <div className="hidden md:flex space-x-2 items-center">
    {[80, 96, 72, 88].map((w, i) => (
      <S key={i} className="h-8 rounded-lg" style={{ width: `${w}px` }} />
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   FOOTER SKELETON
   Ghost name text in footer copyright line.
   ══════════════════════════════════════════════════════════════════════ */
export const FooterNameSkeleton = () => (
  <S className="h-4 w-28 rounded inline-block align-middle" />
);

/* ═══════════════════════════════════════════════════════════════════════
   CERTIFICATES GRID PAGE  (/certificates)
   Full grid of ghost certificate cards.
   ══════════════════════════════════════════════════════════════════════ */
const CertGridCardSkeleton = () => (
  <div className="relative flex flex-col p-4 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl">
    <div className="flex items-center justify-between mb-2">
      <S className="w-9 h-9 rounded-xl" />
      <S className="h-6 w-20 rounded-full" />
    </div>
    {/* Preview area */}
    <S className="flex-1 my-4 rounded-xl" style={{ minHeight: "120px" }} />
    {/* Title + button */}
    <div className="mt-4 space-y-3 text-center">
      <S className="h-5 w-4/5 mx-auto rounded" />
      <S className="h-5 w-3/5 mx-auto rounded" />
      <S className="h-10 w-full rounded-xl" />
    </div>
  </div>
);

export const CertificatesGridSkeleton = () => (
  <section className="py-24">
    <div className="container mx-auto px-6">
      <S className="h-10 w-56 mx-auto rounded-xl mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <CertGridCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════
   CONTACT PAGE SKELETON
   Ghost contact link cards while social data is loading.
   ══════════════════════════════════════════════════════════════════════ */
export const ContactSkeleton = () => (
  <div className="min-h-[calc(100vh-100px)] py-20 flex items-center justify-center">
    <div className="container px-6 mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 flex flex-col items-center">
        <S className="h-14 w-80 rounded-xl" />
        <S className="h-5 w-full max-w-xl rounded" />
        <S className="h-5 w-4/5 max-w-xl rounded" />
      </div>

      {/* Cards grid */}
      <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-full sm:w-[280px]">
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-zinc-800/50 bg-card/30 space-y-4">
              <S className="w-14 h-14 rounded-full" />
              <S className="h-5 w-24 rounded-lg" />
              <S className="h-4 w-36 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   HERO SECTION
   ══════════════════════════════════════════════════════════════════════ */
export const HeroSkeleton = () => (
  <div className="flex flex-col items-center gap-6 pt-4 pb-10 text-center">
    {/* Portrait */}
    <S className="mx-auto w-52 h-72 sm:w-64 sm:h-80 rounded-2xl" />

    {/* Welcome chip */}
    <S className="w-48 h-8 rounded-full" />

    {/* Name heading */}
    <div className="space-y-3 w-full max-w-lg mx-auto">
      <S className="h-12 md:h-16 w-4/5 mx-auto rounded-xl" />
      <S className="h-6 md:h-8 w-3/5 mx-auto rounded-xl" />
    </div>

    {/* Bio */}
    <div className="space-y-2 w-full max-w-2xl mx-auto px-4">
      <S className="h-4 w-full rounded" />
      <S className="h-4 w-11/12 mx-auto rounded" />
      <S className="h-4 w-3/4 mx-auto rounded" />
    </div>

    {/* Chips row */}
    <div className="flex flex-wrap justify-center gap-3">
      {["w-28", "w-32", "w-36"].map((w, i) => (
        <S key={i} className={`h-8 ${w} rounded-full`} />
      ))}
    </div>

    {/* CTA button */}
    <S className="h-12 w-40 rounded-full mt-2" />
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   ABOUT SECTION
   ══════════════════════════════════════════════════════════════════════ */
export const AboutSkeleton = () => (
  <section className="py-24 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      {/* Header */}
      <div className="text-center space-y-4 mb-16 flex flex-col items-center">
        <S className="h-9 w-28 rounded-full" />
        <S className="h-12 w-72 rounded-xl" />
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {/* Text block */}
        <div className="space-y-4">
          {[100, 95, 80, 90].map((pct, i) => (
            <S key={i} className="h-4 rounded" style={{ width: `${pct}%` }} />
          ))}
          <S className="h-4 w-3/4 rounded" />

          {/* Stats row */}
          <div className="pt-4 border-t border-zinc-800/50 flex space-x-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <S className="h-8 w-14 rounded-lg" />
                <S className="h-3 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Bento card */}
        <S className="rounded-3xl h-64" />
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════
   EXPERIENCE SECTION
   ══════════════════════════════════════════════════════════════════════ */
const ExperienceCardSkeleton = () => (
  <div className="flex gap-6">
    {/* Timeline node */}
    <div className="flex flex-col items-center flex-shrink-0">
      <S className="w-12 h-12 rounded-xl" />
    </div>

    {/* Card */}
    <div className="flex-1 pb-8">
      <div className="rounded-2xl border border-border/60 bg-card/80 p-6 space-y-3">
        <div className="flex flex-col md:flex-row justify-between gap-3">
          <div className="space-y-2">
            <S className="h-6 w-48 rounded-lg" />
            <S className="h-4 w-32 rounded" />
          </div>
          <div className="space-y-2">
            <S className="h-4 w-28 rounded" />
            <S className="h-4 w-20 rounded" />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <S className="h-3 w-full rounded" />
          <S className="h-3 w-11/12 rounded" />
          <S className="h-3 w-4/5 rounded" />
        </div>

        {/* Tech pills */}
        <div className="flex gap-2 flex-wrap pt-2 border-t border-border/70">
          {["w-16", "w-20", "w-14", "w-18", "w-12"].map((w, i) => (
            <S key={i} className={`h-6 ${w} rounded-full`} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const ExperienceSkeleton = () => (
  <section className="py-24 cv-auto">
    <div className="container mx-auto px-6 space-y-16">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4 flex flex-col items-center">
        <S className="h-9 w-40 rounded-full" />
        <S className="h-10 w-56 rounded-xl" />
        <S className="h-4 w-80 rounded" />
      </div>

      {/* Cards */}
      <div className="max-w-4xl mx-auto space-y-8">
        {[1, 2].map((i) => (
          <ExperienceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════
   SKILLS SECTION
   ══════════════════════════════════════════════════════════════════════ */
const SkillCardSkeleton = () => (
  <div className="h-full p-4 rounded-xl border border-zinc-800/50 bg-card/30 space-y-3">
    <div className="flex justify-between items-center">
      <S className="h-4 w-24 rounded" />
      <S className="h-5 w-10 rounded-full" />
    </div>
    {/* Skill bar */}
    <S className="h-1.5 w-full rounded-full" />
    <div className="flex justify-between">
      <S className="h-3 w-16 rounded" />
      <S className="h-3 w-20 rounded" />
    </div>
  </div>
);

const SkillCategorySkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <S className="w-10 h-10 rounded-xl" />
      <div className="space-y-2">
        <S className="h-5 w-36 rounded-lg" />
        <S className="h-3 w-56 rounded" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <SkillCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const SkillsSkeleton = () => (
  <section className="py-24 cv-auto">
    <div className="container mx-auto px-6 space-y-16">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4 flex flex-col items-center">
        <S className="h-9 w-44 rounded-full" />
        <S className="h-10 w-60 rounded-xl" />
        <S className="h-4 w-96 rounded" />
      </div>

      {/* Categories */}
      <div className="space-y-16">
        {[1, 2, 3].map((i) => (
          <SkillCategorySkeleton key={i} />
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════
   CERTIFICATES SECTION
   ══════════════════════════════════════════════════════════════════════ */
const CertCardSkeleton = () => (
  <div className="flex flex-col justify-between p-4 rounded-2xl border border-zinc-500/15 bg-card/30 h-full space-y-3">
    <div className="flex justify-between items-start">
      <S className="w-10 h-10 rounded-xl" />
      <S className="h-6 w-12 rounded-full" />
    </div>
    {/* Preview area */}
    <S className="rounded-xl" style={{ aspectRatio: "3 / 2" }} />
    {/* Footer */}
    <div className="space-y-3">
      <S className="h-5 w-4/5 rounded" />
      <S className="h-5 w-2/3 rounded" />
      <div className="flex gap-2">
        <S className="h-10 flex-1 rounded-xl" />
        <S className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  </div>
);

export const CertificatesSkeleton = () => (
  <section className="py-24 cv-auto">
    <div className="container mx-auto px-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4 mb-12 flex flex-col items-center">
        <S className="h-9 w-32 rounded-full" />
        <S className="h-10 w-52 rounded-xl" />
        <S className="h-4 w-80 rounded" />
      </div>

      {/* Carousel placeholder — 3 ghost cards side-by-side */}
      <div className="flex gap-4 justify-center overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[260px] sm:min-w-[340px] h-[360px] flex-shrink-0">
            <CertCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════
   PROJECTS PAGE LIST
   ══════════════════════════════════════════════════════════════════════ */
const ProjectCardSkeleton = () => (
  <div className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl bg-secondary/5">
    {/* Image area */}
    <div className="md:w-1/3 lg:w-1/2">
      <S className="w-full rounded-lg" style={{ aspectRatio: "4/3" }} />
    </div>

    {/* Content area */}
    <div className="flex flex-col justify-between py-2 md:w-2/3 lg:w-1/2 space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <S className="h-5 w-40 rounded-lg" />
          <S className="h-4 w-8 rounded" />
        </div>
        <div className="space-y-2">
          <S className="h-3 w-full rounded" />
          <S className="h-3 w-11/12 rounded" />
        </div>
        {/* Tech pills */}
        <div className="flex flex-wrap gap-1.5">
          {["w-14", "w-16", "w-12", "w-20"].map((w, i) => (
            <S key={i} className={`h-5 ${w} rounded-full`} />
          ))}
        </div>
      </div>
      <S className="h-8 w-28 rounded-full" />
    </div>
  </div>
);

export const ProjectsListSkeleton = ({ count = 4 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProjectCardSkeleton key={i} />
    ))}
  </div>
);
