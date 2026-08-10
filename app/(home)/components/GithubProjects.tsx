"use client";
import React, { useMemo, useRef, useEffect } from "react";
import {
  AlertCircle, ExternalLink, GitBranch, Github, Loader2, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/store";
import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { prefersReducedMotion } from "@/lib/anime-utils";

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  private: boolean;
  updated_at: string;
  size: string;
}

const ITEMS_PER_PAGE = 6;

const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#2b7489",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  "C#": "#178600",
  PHP: "#4F5D95",
  Rust: "#dea584",
};

const getProjectSize = (index: number): string => {
  const sizes = [
    "sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1",
    "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-2",
    "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-2",
    "sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1",
    "sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1",
    "sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1",
  ];
  return sizes[index % sizes.length];
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    const error = new Error("Failed to fetch GitHub projects") as Error & { info: string; status: number };
    error.info = errorData.message;
    error.status = res.status;
    throw error;
  }
  return res.json();
};

const ProjectSkeleton: React.FC = () => (
  <div className="rounded-xl sm:rounded-2xl bg-card/80 border-border/60 border p-3 sm:p-4 md:p-5 min-h-[120px] sm:min-h-[140px] h-full w-full">
    <div className="flex flex-col gap-2 sm:gap-3 h-full justify-between">
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 bg-muted/70" />
          <Skeleton className="h-3 w-3 rounded-full bg-muted/70" />
        </div>
        <Skeleton className="h-8 sm:h-12 w-full bg-muted/70" />
      </div>
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        <Skeleton className="h-2 sm:h-2.5 w-10 sm:w-12 bg-muted/70" />
        <Skeleton className="h-2 sm:h-2.5 w-8 sm:w-10 bg-muted/70" />
      </div>
    </div>
  </div>
);

const ErrorAlert: React.FC<{ error: Error; onRetry: () => void }> = ({ error, onRetry }) => (
  <Alert variant="destructive" className="col-span-full">
    <AlertCircle className="w-4 h-4" />
    <AlertDescription className="flex items-center justify-between">
      <span>Failed to load projects. Rate limit may be exceeded.</span>
      <Button variant="outline" size="sm" onClick={onRetry} className="ml-4">
        Try Again
      </Button>
    </AlertDescription>
  </Alert>
);

const ProjectCard: React.FC<{ project: GithubRepo & { size: string } }> = ({ project }) => {
  const topics = project.topics || [];
  const langColor = project.language ? (languageColors[project.language] || "#8b5cf6") : null;

  return (
    <a
      href={project.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative group project-card ${project.size}`}
    >
      <div className="
        bg-card/80 border-border/60 border
        p-3 sm:p-4 md:p-5
        rounded-xl sm:rounded-2xl
        backdrop-blur-md cursor-pointer
        relative overflow-hidden h-full w-full
        min-h-[120px] sm:min-h-[140px]
        flex flex-col
        shadow-[0_4px_6px_rgba(0,0,0,0.18)]
        transition-all duration-300
        group-hover:border-primary/40
        group-hover:shadow-[0_8px_24px_rgba(255,255,255,0.05)]
      ">
        {/* Language accent bar at top */}
        {langColor && (
          <div
            className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
            style={{ background: `linear-gradient(to right, ${langColor}80, ${langColor}, ${langColor}80)` }}
          />
        )}

        {/* Shiny sweep */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent shiny-sweep" />
        </div>

        <div className="relative flex flex-col gap-2 sm:gap-3 w-full z-10 h-full justify-between">
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1 min-w-0">
                <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-foreground flex-shrink-0" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-bold text-foreground text-[10px] sm:text-xs md:text-sm truncate">
                        {project.name}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent><p>{project.name}</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-muted-foreground group-hover:text-muted-foreground transition-colors flex-shrink-0" />
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
              {project.description || "No description provided"}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 sm:gap-2 mt-auto">
            {topics.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {topics.slice(0, project.size.includes("row-span-2") ? 3 : 2).map((topic) => (
                  <span
                    key={topic}
                    className="text-[9px] sm:text-[10px] md:text-xs bg-primary/10 text-foreground px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full border border-primary/20"
                  >
                    {topic}
                  </span>
                ))}
                {topics.length > (project.size.includes("row-span-2") ? 3 : 2) && (
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground">
                    +{topics.length - (project.size.includes("row-span-2") ? 3 : 2)}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 flex-wrap">
              {project.language && (
                <div className="flex items-center space-x-0.5 sm:space-x-1">
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full"
                    style={{ backgroundColor: langColor || "#ccc" }}
                  />
                  <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">
                    {project.language}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-0.5 sm:space-x-1">
                <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-muted-foreground" />
                <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">
                  {project.stargazers_count}
                </span>
              </div>
              <div className="flex items-center space-x-0.5 sm:space-x-1">
                <GitBranch className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-muted-foreground" />
                <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">
                  {project.forks_count}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

const GithubProjects: React.FC = () => {
  const { portfolioData } = usePortfolio();
  const FEATURED_REPOS: string[] = portfolioData?.featuredProjects || [];
  const social = portfolioData?.social ?? {};
  const gridRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = React.useState(1);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const { data, error, isLoading, mutate: revalidateData } = useSWR(
    social?.github
      ? `https://api.github.com/users/${social.github}/repos?sort=updated&per_page=${ITEMS_PER_PAGE * page}`
      : null,
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 300000, shouldRetryOnError: false }
  );

  const projects = useMemo(() => {
    if (!data) return [];
    return (data as GithubRepo[])
      .filter(
        (p) =>
          !p.fork &&
          !p.private &&
          (p.name.toLowerCase().includes("portfolio") ||
            FEATURED_REPOS.includes(p.name.toLowerCase()) ||
            (p.topics && p.topics.some((t) => t.toLowerCase().includes("portfolio"))))
      )
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, ITEMS_PER_PAGE * page)
      .map((p, index) => ({ ...p, size: getProjectSize(index) }));
  }, [data, page, FEATURED_REPOS]);

  // Anime.js stagger entrance for project cards
  useEffect(() => {
    if (prefersReducedMotion() || isLoading || !gridRef.current) return;
    let triggered = false;

    const run = async () => {
      try {
        const { animate, stagger } = await import("animejs");
        const el = gridRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && !triggered) {
              triggered = true;
              observer.disconnect();
              const cards = el.querySelectorAll<HTMLElement>(".project-card");
              cards.forEach((c) => { c.style.opacity = "0"; });
              animate(cards, {
                opacity: [0, 1],
                scale: [0.9, 1],
                translateY: [20, 0],
                easing: "easeOutBack",
                duration: 500,
                delay: stagger(60),
              });
            }
          },
          { rootMargin: "-5% 0px" }
        );
        observer.observe(el);
      } catch {
        gridRef.current?.querySelectorAll<HTMLElement>(".project-card").forEach((c) => {
          c.style.opacity = "1";
        });
      }
    };
    run();
  }, [isLoading, projects.length]);

  const handleRetry = async () => {
    try {
      setIsLoadingMore(true);
      await revalidateData();
    } catch { /* ignore */ } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <section className="py-20 relative cv-auto">
      <div className="w-full">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="space-y-8 sm:space-y-12">
            {/* Header */}
            <div className="space-y-3 sm:space-y-4 text-center">
              <div className="inline-flex items-center space-x-2 glass-premium px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-foreground backdrop-blur-sm shadow-lg">
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold">Latest Github Projects</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Outfit',sans-serif] gradient-heading px-4">
                Open Source Projects
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                Check out my public portfolio projects on GitHub
              </p>
            </div>

            {/* Grid */}
            <div
              ref={gridRef}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 auto-rows-fr gap-3 sm:gap-4 w-full max-w-6xl mx-auto"
            >
              {isLoading
                ? Array(ITEMS_PER_PAGE).fill(0).map((_, index) => (
                  <div key={index} className={getProjectSize(index)}>
                    <ProjectSkeleton />
                  </div>
                ))
                : error
                  ? <ErrorAlert error={error} onRetry={handleRetry} />
                  : projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-8 sm:mt-0">
              {!error && data && (data as GithubRepo[]).length > projects.length && (
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isLoadingMore}
                  className="rounded-full px-5 py-5 sm:px-6 sm:py-6 text-sm sm:text-base w-full sm:w-auto"
                >
                  {isLoadingMore ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Loading...</>
                  ) : "Load More Projects"}
                </Button>
              )}
              <Button
                variant="outline"
                Icon={Github}
                iconPlacement="right"
                className="group rounded-full px-5 py-5 sm:px-6 sm:py-6 text-sm sm:text-base w-full sm:w-auto glass-panel text-foreground hover:bg-foreground/5 hover:border-foreground/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                asChild
              >
                <a
                  href={`https://github.com/${social?.github}?tab=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View More on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GithubProjects;
