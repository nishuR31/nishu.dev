"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ImageWithAvif from "../../ImageWithAvif";
import { Button } from "../../ui/button";
import { ExternalLink, Github, Info } from "lucide-react";
import { getProjectSlugs } from "@/lib/slug-utils";

export const ProjectCard = ({ project, index }) => {
  const [imgError, setImgError] = useState(false);
  const mainSlug = getProjectSlugs(project)[0] || "";

  return (
    <div
      className="flex flex-col items-stretch gap-6 p-4 transition-colors duration-300 group sm:flex-row lg:flex-row bg-secondary/5 hover:bg-secondary/10 rounded-xl"
    >
      <div className="md:w-1/3 lg:w-1/2">
        <div className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[3/2] rounded-lg overflow-hidden bg-secondary/20">
          {!imgError ? (
            <ImageWithAvif
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              className="object-cover w-full h-full transition-transform duration-300 transform group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-card skeleton-shimmer">
              <Image
                src="/logo.avif"
                alt="Fallback Logo"
                width={80}
                height={80}
                className="opacity-50 grayscale mix-blend-overlay"
              />
            </div>
          )}
          <div className="absolute inset-0 transition-colors duration-300 bg-black/40 group-hover:bg-black/20" />
        </div>
      </div>

      <div className="flex flex-col justify-between py-2 md:w-2/3 lg:w-1/2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              {project.title}
              {project.status === "In Progress" && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-amber-500/10 text-amber-500 border border-amber-500/20 whitespace-nowrap">
                  In Progress
                </span>
              )}
            </h3>
            <span className="text-xs text-muted-foreground">
              #{String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {project.company && (
              <span className="font-medium text-foreground opacity-80 text-xs flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-primary" /> {project.company}
              </span>
            )}
            <p className="line-clamp-2">{project.description}</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4">
          {project.demo && (
            <Button size="sm" className="h-8 px-4 text-xs rounded-full" asChild>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                Live
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          )}

          {project.github && (
            <Button size="sm" variant="outline" className="h-8 px-4 text-xs rounded-full bg-background" asChild>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                <Github className="w-3 h-3" />
                GitHub
              </a>
            </Button>
          )}

          {mainSlug && (
            <Button size="sm" variant="secondary" className="h-8 px-4 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 border-none" asChild>
              <Link
                href={`/projects/${mainSlug}`}
                className="flex items-center gap-1.5"
              >
                <Info className="w-3 h-3" />
                About
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
