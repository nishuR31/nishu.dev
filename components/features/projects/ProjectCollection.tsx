"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github, Code2 } from "lucide-react";
import { getProjectSlugs } from "@/lib/slug-utils";

export default function ProjectCollection({
  projects,
  compact = false,
}: {
  projects: any[];
  compact?: boolean;
}) {
  const [filter, setFilter] = useState("All projects");
  const filters = ["All projects", "Full-stack", "Backend", "Frontend"];
  const visible = projects
    .filter((p) => p.visible !== false)
    .filter(
      (p) =>
        filter === "All projects" ||
        (p.categories || []).some((c: string) => c.toLowerCase() === filter.toLowerCase()),
    );
  const shown = compact ? visible.slice(0, 3) : visible;
  return (
    <>
      <div className="project-toolbar">
        <div className="project-filters" aria-label="Filter projects">
          {filters.map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
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
        <span className="small-mono project-note">A FEW THINGS I’VE PUT INTO THE WORLD</span>
      </div>
      <div className={`project-grid ${compact ? "selected-projects" : ""}`} aria-live="polite">
        {shown.map((p, i) => (
          <ProjectTile key={p.id || p.title} project={p} index={i} featured={compact && i === 0} />
        ))}
      </div>
      {!shown.length && (
        <p className="empty-projects">No projects in this category yet. Try another filter.</p>
      )}
    </>
  );
}
function ProjectTile({
  project: p,
  index,
  featured,
}: {
  project: any;
  index: number;
  featured?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const href = `/projects/${getProjectSlugs(p)[0]}`;
  return (
    <article className={`project-tile ${featured ? "featured-project" : ""}`}>
      <Link
        href={href}
        className={`project-preview preview-${index % 3}`}
        aria-label={`Explore ${p.title}`}
      >
        <span className="preview-number">0{index + 1} / PROJECT</span>
        {p.image && !failed ? (
          <Image
            src={p.image}
            alt={`${p.title} interface`}
            fill
            sizes="(max-width: 700px) 90vw, 55vw"
            onError={() => setFailed(true)}
            className="project-screenshot"
          />
        ) : (
          <div className="project-placeholder">
            <Code2 size={40} />
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
