import React from "react";
import { getPortfolioData } from "@/lib/portfolio";
import { notFound } from "next/navigation";
import BackgroundEffects from "@/components/ui/background-effects";
import Link from "next/link";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const dynamicParams = true;

const getProjectSlugs = (p: any): string[] => {
  const slugs = new Set<string>();
  if (p.slug) slugs.add(p.slug.toLowerCase());
  if (p.title) {
    slugs.add(p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    slugs.add(p.title.toLowerCase().replace(/[^a-z0-9]+/g, ""));
  }
  if (p.github) {
    const repoName = p.github.split("/").pop();
    if (repoName) slugs.add(repoName.toLowerCase());
  }
  if (p.id !== undefined && p.id !== null) slugs.add(String(p.id));
  return Array.from(slugs);
};

export async function generateStaticParams() {
  const data = await getPortfolioData();
  const projects = data?.projects || [];
  const params: { slug: string }[] = [];

  for (const p of projects) {
    const projectSlugs = getProjectSlugs(p);
    for (const slug of projectSlugs) {
      params.push({ slug });
    }
  }

  return params;
}

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const data = await getPortfolioData();
  const projects = data?.projects || [];

  const targetSlug = params.slug.toLowerCase();

  const project = projects.find((p: any) => {
    const slugs = getProjectSlugs(p);
    return slugs.includes(targetSlug);
  });

  if (!project) {
    notFound();
  }

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
        <div className="mb-8">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>

        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            {project.categories && project.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.categories.map((cat: string) => (
                  <span key={cat} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
                    {cat}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-outfit gradient-heading">
              {project.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            {demoUrl && (
              <Button asChild className="rounded-full px-6 glass-premium">
                <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live Site
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

          {/* Hero Image */}
          {project.image && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border/50 glass-premium shadow-2xl mt-12">
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

          {/* Tech Stack */}
          <div className="grid md:grid-cols-3 gap-12 mt-16 pt-16 border-t border-border/50">
            <div className="md:col-span-2 space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-outfit text-foreground">Project Overview</h2>
                <div className="prose prose-invert max-w-none text-muted-foreground">
                  <p>
                    {project.description}
                  </p>
                </div>
              </section>
            </div>
            
            <div className="space-y-8">
              {project.technologies && project.technologies.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string) => (
                      <span key={tech} className="px-3 py-1.5 bg-card border border-border/50 rounded-lg text-sm text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
