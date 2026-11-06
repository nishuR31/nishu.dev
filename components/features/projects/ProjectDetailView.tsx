"use client";

import React from "react";
import BackgroundEffects from "@/components/ui/background-effects";
import Link from "next/link";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Lightbulb,
  User,
  Calendar,
  Zap,
  Tag,
  ChevronRight,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getProjectSlugs } from "@/lib/slug-utils";

/* ── Skeleton shown while client-side data loads ─────────────────────── */
const DetailSkeleton = () => (
  <div className="min-h-screen py-24 px-6 max-w-5xl mx-auto space-y-10 animate-pulse">
    <div className="h-4 w-32 skeleton-shimmer rounded" />
    <div className="space-y-4">
      <div className="h-14 w-2/3 skeleton-shimmer rounded-xl" />
      <div className="h-5 w-full skeleton-shimmer rounded" />
      <div className="h-5 w-4/5 skeleton-shimmer rounded" />
    </div>
    <div className="flex gap-4">
      <div className="h-10 w-36 skeleton-shimmer rounded-full" />
      <div className="h-10 w-36 skeleton-shimmer rounded-full" />
    </div>
    <div className="aspect-video w-full skeleton-shimmer rounded-2xl" />
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-3">
        <div className="h-6 w-48 skeleton-shimmer rounded" />
        <div className="h-4 w-full skeleton-shimmer rounded" />
        <div className="h-4 w-5/6 skeleton-shimmer rounded" />
      </div>
      <div className="space-y-3">
        <div className="h-6 w-32 skeleton-shimmer rounded" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-6 w-24 skeleton-shimmer rounded-full inline-block mr-2" />
        ))}
      </div>
    </div>
  </div>
);

/* ── Not Found state ─────────────────────────────────────────────────── */
const NotFound = ({ slug }: { slug: string }) => (
  <div className="min-h-screen py-24 flex flex-col items-center justify-center gap-6 px-6 text-center">
    <h1 className="text-3xl font-bold font-outfit text-foreground">Project Not Found</h1>
    <p className="text-muted-foreground max-w-md">
      We couldn&apos;t find a project matching &quot;{slug}&quot;. It might have been renamed or
      moved.
    </p>
    <Button asChild variant="outline" className="rounded-full px-6">
      <Link href="/projects">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
      </Link>
    </Button>
  </div>
);

/* ── Info block ──────────────────────────────────────────────────────── */
const InfoBlock = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.FC<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-foreground font-semibold font-outfit">
      <Icon className="w-4 h-4 text-primary" />
      {title}
    </div>
    <div className="text-muted-foreground text-sm leading-relaxed">{children}</div>
  </div>
);

/* ── Main component ──────────────────────────────────────────────────── */
export default function ProjectDetailView({
  initialProject,
  slug,
}: {
  initialProject?: any;
  slug: string;
}) {
  const project = initialProject;

  if (!project) return <NotFound slug={slug} />;

  const demoUrl = project.demo || project.links?.live;
  const githubUrl = project.github || project.links?.github;

  return (
    <div className="min-h-screen py-24 relative overflow-hidden">
      <BackgroundEffects
        variant="diagonal"
        colors={{ first: "primary", second: "secondary" }}
        intensity="10"
        blurAmount="3xl"
      />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        {/* Back */}
        <div className="mb-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>

        <div className="space-y-10">
          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Categories */}
            {project.categories && project.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.categories.map((cat: string) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium"
                  >
                    <Tag className="w-3 h-3" />
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-6xl font-bold font-outfit gradient-heading">
              {project.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              {project.description}
            </p>

            {/* Timeline badge */}
            {project.timeline && (
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {project.timeline}
              </div>
            )}
          </div>

          {/* ── CTAs ───────────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-4">
            {demoUrl && (
              <Button asChild className="rounded-full px-6 glass-premium">
                <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live
                </a>
              </Button>
            )}
            {githubUrl && (
              <Button variant="outline" asChild className="rounded-full px-6 bg-card/50">
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  Source Code
                </a>
              </Button>
            )}
          </div>

          {/* ── Hero Image ─────────────────────────────────────────── */}
          {project.image && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border/50 glass-premium shadow-2xl">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            </div>
          )}

          {/* ── Rich write-up grid ─────────────────────────────────── */}
          <div className="grid md:grid-cols-3 gap-10 pt-10 border-t border-border/50">
            {/* Left: narrative */}
            <div className="md:col-span-2 space-y-10">
              {project.problem && (
                <InfoBlock icon={Lightbulb} title="The Problem">
                  {project.problem}
                </InfoBlock>
              )}

              {project.solution && (
                <InfoBlock icon={Wrench} title="The Solution">
                  {project.solution}
                </InfoBlock>
              )}

              {project.role && (
                <InfoBlock icon={User} title="My Role">
                  {project.role}
                </InfoBlock>
              )}

              {/* Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-foreground font-semibold font-outfit">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Key Highlights
                  </div>
                  <ul className="space-y-2">
                    {project.highlights.map((h: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <ChevronRight className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fallback: just description if no structured fields */}
              {!project.problem && !project.solution && (
                <InfoBlock icon={Wrench} title="Project Overview">
                  {project.description}
                </InfoBlock>
              )}
            </div>

            {/* Right: meta sidebar */}
            <div className="space-y-8">
              {/* Tech Stack */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 bg-card border border-border/60 rounded-lg text-xs text-muted-foreground font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">
                  Links
                </h3>
                <div className="flex flex-col gap-2">
                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      GitHub Repository
                    </a>
                  )}
                  {demoUrl && (
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
