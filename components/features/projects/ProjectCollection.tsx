"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Github, Grid2X2, RectangleHorizontal } from "lucide-react";
import dynamic from "next/dynamic";
import { getProjectSlugs } from "@/lib/slug-utils";
import { getProjectImage, PROJECT_IMAGE_FALLBACK } from "@/lib/project-images";
import { composeProjectPreview } from "@/lib/compose-project-preview";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

function FlexCarouselSkeleton() {
  return (
    <div
      className="project-carousel-skeleton project-carousel-viewport relative flex items-center justify-center"
      role="status"
      aria-busy="true"
      aria-label="Loading project showcase"
    >
      <div className="flex h-full w-full items-center justify-center gap-4 px-4">
        <div className="skeleton-shimmer hidden h-[280px] w-[180px] rounded-xl md:block" />
        <div className="skeleton-shimmer h-[260px] w-[190px] rounded-xl shadow-xl md:h-[360px] md:w-[260px]" />
        <div className="skeleton-shimmer hidden h-[280px] w-[180px] rounded-xl md:block" />
      </div>
    </div>
  );
}

function getProjectPreviewImage(project: any, mobile = false) {
  return getProjectImage(project, { preferSecondary: mobile });
}

/**
 * Latches once the collection scrolls near the viewport. Image composition is
 * expensive, so nothing should run while the section is still off-screen.
 */
function useNearViewport<T extends HTMLElement>(margin = 300) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: `0px 0px ${margin}px 0px` },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, inView };
}

const COMPOSITE_CONCURRENCY = 4;

/**
 * Pre-composes every project's laptop + phone preview. The WebGL carousel
 * takes one texture per card, so cards wait for their single composite image
 * instead of flashing through two separate sources.
 *
 * Work only starts once `enabled`, and runs through a small worker pool so a
 * long project list never floods the network or the main thread at once.
 */
function useProjectComposites(projects: any[], enabled: boolean) {
  const [composites, setComposites] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const entries = projects.map((project) => {
      const key = getProjectSlugs(project)[0] || String(project.id);
      const desktop = getProjectImage(project);
      const secondary = getProjectImage(project, { preferSecondary: true });
      return {
        key,
        desktop,
        mobile: secondary && secondary !== desktop ? secondary : undefined,
      };
    });

    if (entries.length === 0) {
      setComposites({});
      setReady(true);
      return;
    }

    setReady(false);

    const results: Array<readonly [string, string]> = [];
    let cursor = 0;

    const worker = async () => {
      while (!cancelled) {
        const index = cursor;
        cursor += 1;
        if (index >= entries.length) return;

        const { key, desktop, mobile } = entries[index];
        let src = desktop;
        try {
          src = await composeProjectPreview(desktop, mobile);
        } catch {
          // A failed composition should still leave a usable card.
        }
        if (cancelled) return;
        results.push([key, src] as const);
      }
    };

    const workers = Array.from({ length: Math.min(COMPOSITE_CONCURRENCY, entries.length) }, worker);

    Promise.all(workers).then(() => {
      if (cancelled) return;
      setComposites(Object.fromEntries(results));
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [projects, enabled]);

  return { composites, ready };
}

const FlexCarousel = dynamic(() => import("./FlexCarousel"), {
  ssr: false,
  loading: () => <FlexCarouselSkeleton />,
});

export default function ProjectCollection({
  projects,
  compact = false,
}: {
  projects: any[];
  compact?: boolean;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState("All projects");
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { ref: collectionRef, inView } = useNearViewport<HTMLDivElement>();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 700px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  const filters = ["All projects", "Full-stack", "Backend", "Frontend"];

  const visible = useMemo(() => {
    return projects
      .filter((p) => p.visible !== false)
      .filter(
        (p) =>
          filter === "All projects" ||
          (p.categories || []).some((c: string) => c.toLowerCase() === filter.toLowerCase()),
      );
  }, [projects, filter]);

  const shown = compact ? visible.slice(0, 3) : visible;

  // Only compose when the carousel is actually on screen and selected.
  const { composites, ready: compositesReady } = useProjectComposites(
    visible,
    inView && viewMode === "carousel" && visible.length > 0,
  );

  // Build items for FlexCarousel holding all cards. Each card uses one
  // pre-composed laptop + phone image.
  const carouselItems = useMemo(() => {
    const list = visible.length > 0 ? visible : projects;
    const baseItems = list.map((p, index) => {
      const slugs = getProjectSlugs(p);
      const slug = slugs[0] || String(p.id);
      const imgSrc = composites[slug] || getProjectImage(p);
      const subtitle =
        p.categories?.slice(0, 2).join(" • ") ||
        p.technologies?.slice(0, 3).join(" • ") ||
        "Project";

      return {
        src: imgSrc,
        fallbackSrc: PROJECT_IMAGE_FALLBACK,
        alt: `${p.title} - ${p.description || "Portfolio project"}`,
        title: p.title,
        subtitle: subtitle,
        project: p,
        slug: slug,
      };
    });

    // If there are fewer than 4 items, loop them to keep the continuous ribbon smooth
    if (baseItems.length > 0 && baseItems.length < 4) {
      return [...baseItems, ...baseItems, ...baseItems];
    }
    return baseItems;
  }, [visible, projects, composites]);

  const currentItem =
    carouselItems.length > 0
      ? carouselItems[activeCarouselIndex % carouselItems.length] || carouselItems[0]
      : null;
  const currentProject = currentItem?.project;
  const currentSlug = currentProject
    ? getProjectSlugs(currentProject)[0] || String(currentProject.id)
    : "";

  return (
    <>
      <div className="project-toolbar" ref={collectionRef}>
        <div className="project-filters" aria-label="Filter projects">
          {filters.map((f) => (
            <button
              type="button"
              key={f}
              aria-pressed={filter === f}
              onClick={() => {
                setFilter(f);
                setActiveCarouselIndex(0);
              }}
              className={filter === f ? "selected" : ""}
            >
              {f}
              {f === "All projects" && (
                <span>
                  {projects
                    .filter((p) => p.visible !== false)
                    .length.toString()
                    .padStart(2, "0")}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="project-toolbar-right">
          <div className="project-view-mode" role="group" aria-label="View mode">
            <button
              type="button"
              onClick={() => setViewMode("carousel")}
              className={viewMode === "carousel" ? "selected" : ""}
              aria-pressed={viewMode === "carousel"}
              aria-label="Carousel view"
              title="Carousel view"
            >
              <RectangleHorizontal size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "selected" : ""}
              aria-pressed={viewMode === "grid"}
              aria-label="Grid view"
              title="Grid view"
            >
              <Grid2X2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="empty-projects">No projects in this category yet. Try another filter.</p>
      ) : viewMode === "carousel" && compositesReady ? (
        <div className="project-carousel-showcase relative overflow-hidden">
          {/* FlickeringGrid decorative background */}
          <FlickeringGrid
            className="absolute inset-0 z-0 size-full pointer-events-none"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.18}
            flickerChance={0.08}
            width={1600}
            height={700}
          />

          {/* Horizontal-scroll hint badge — fades out after 3s via CSS animation */}
          <div
            className="carousel-scroll-hint absolute top-3 left-1/2 -translate-x-1/2 z-20
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full
                        bg-black/50 backdrop-blur-sm text-white/80 text-xs font-medium
                        pointer-events-none select-none animate-fadeOut"
            aria-hidden="true"
          >
            <span className="inline-block animate-nudgeLeft">←</span>
            Scroll horizontally to explore
            <span className="inline-block animate-nudgeRight">→</span>
          </div>

          <div
            style={{ width: "100%", height: "calc(100vh - 10rem)", position: "relative" }}
            className="project-carousel-viewport relative z-10"
          >
            <FlexCarousel
              items={carouselItems}
              preset="ribbon"
              intro="deal"
              cardHeight={0.5}
              gap={12}
              squeeze={0.1}
              focusOnClick
              captions
              fit="natural"
              radius={0}
              lensWidth={0.8}
              lensHeight={0.8}
              tilt={0}
              roundness={1}
              bend={0}
              reach={0.34}
              curl="twist"
              dispersion={0.4}
              liquid={0}
              followCursor={false}
              autoplay={true}
              interval={4}
              captureWheel
              onChange={(index: number) => {
                setActiveCarouselIndex(index);
              }}
              onSelect={(index: number, item: any) => {
                setActiveCarouselIndex(index);
                if (item?.project) {
                  const slug = getProjectSlugs(item.project)[0] || item.project.id;
                  router.push(`/projects/${slug}`);
                }
              }}
            />
          </div>

          {currentProject && (
            <div className="carousel-featured-card relative z-20">
              <article className="project-tile featured-project">
                <div className="project-copy">
                  <span className="featured-label">
                    ACTIVE SELECTION <span>↗</span>
                  </span>
                  <div className="project-meta">
                    <span>{currentProject.categories?.[0] || "Development"}</span>
                    <span>{currentProject.timeline?.split(" — ")[0] || "Selected work"}</span>
                  </div>
                  <h3>
                    <Link href={`/projects/${currentSlug}`}>
                      {currentProject.title}
                      <ArrowUpRight size={21} />
                    </Link>
                  </h3>
                  <p>{currentProject.description}</p>

                  {currentProject.solution && (
                    <div className="project-insight">
                      <span>THE APPROACH</span>
                      <p>{currentProject.solution}</p>
                    </div>
                  )}

                  <div className="tech-tags">
                    {currentProject.technologies?.slice(0, 5).map((tech: string) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>

                  <div className="project-links">
                    <Link href={`/projects/${currentSlug}`}>
                      Explore project <ArrowUpRight size={14} />
                    </Link>
                    {currentProject.github && (
                      <a
                        href={currentProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${currentProject.title} source on GitHub`}
                      >
                        <Github size={15} />
                      </a>
                    )}
                    {currentProject.demo && currentProject.demo !== "#" && (
                      <a href={currentProject.demo} target="_blank" rel="noopener noreferrer">
                        Live site <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </div>
          )}
        </div>
      ) : viewMode === "carousel" ? (
        <FlexCarouselSkeleton />
      ) : (
        <div className={`project-grid ${compact ? "selected-projects" : ""}`} aria-live="polite">
          {shown.map((p, i) => (
            <ProjectTile
              key={p.id || p.title}
              project={p}
              index={i}
              featured={compact && i === 0}
              mobile={isMobile}
            />
          ))}
        </div>
      )}
    </>
  );
}

function ProjectTile({
  project: p,
  index,
  featured,
  mobile,
}: {
  project: any;
  index: number;
  featured?: boolean;
  mobile: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const href = `/projects/${getProjectSlugs(p)[0]}`;
  const imgSrc = getProjectPreviewImage(p, mobile);

  // Cached images can finish before React hydrates, in which case `onLoad`
  // never fires. The ref check clears the skeleton in that situation.
  const handleImageRef = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete && image.naturalWidth > 0) setLoaded(true);
  }, []);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [imgSrc]);
  return (
    <article className={`project-tile ${featured ? "featured-project" : ""}`}>
      <Link
        href={href}
        className={`project-preview preview-${index % 3}`}
        aria-label={`Explore ${p.title}`}
      >
        <span className="preview-number">0{index + 1} / PROJECT</span>
        {imgSrc && !failed ? (
          <>
            {!loaded && (
              <span className="project-preview-skeleton skeleton-shimmer" aria-hidden="true" />
            )}
            <Image
              src={imgSrc}
              alt={`${p.title} interface`}
              fill
              sizes="(max-width: 700px) 90vw, 55vw"
              priority={featured || index === 0}
              ref={handleImageRef}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className="project-screenshot"
            />
          </>
        ) : (
          <div className="project-placeholder" aria-label={`${p.title} preview unavailable`}>
            <span className="project-placeholder-loader" aria-hidden="true">
              <Image src="/logo.avif" alt="" width={76} height={76} />
            </span>
            <strong>{p.title}</strong>
            <span>{p.technologies?.slice(0, 3).join(" / ")}</span>
          </div>
        )}
        <span className="preview-open">
          <ArrowUpRight size={18} />
        </span>
      </Link>
      <div className="project-copy">
        {featured && (
          <span className="featured-label">
            FEATURED CASE STUDY <span>↗</span>
          </span>
        )}
        <div className="project-meta">
          <span>{p.categories?.[0] || "Development"}</span>
          <span>{p.timeline?.split(" — ")[0] || "Selected work"}</span>
        </div>
        <h3>
          <Link href={href}>
            {p.title}
            <ArrowUpRight size={21} />
          </Link>
        </h3>
        <p>{p.description}</p>
        {featured && p.solution && (
          <div className="project-insight">
            <span>THE APPROACH</span>
            <p>{p.solution}</p>
          </div>
        )}
        <div className="tech-tags">
          {p.technologies?.slice(0, 4).map((tech: string) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <div className="project-links">
          <Link href={href}>
            Explore project <ArrowUpRight size={14} />
          </Link>
          {p.github && (
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.title} source on GitHub`}
            >
              <Github size={15} />
            </a>
          )}
          {p.demo && p.demo !== "#" && (
            <a href={p.demo} target="_blank" rel="noopener noreferrer">
              Live site <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
