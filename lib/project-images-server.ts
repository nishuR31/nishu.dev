import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Server-side helpers for project images.
 *
 * The portfolio API still contains a couple of `/projects/*.avif` paths whose
 * local files were removed. Those must never reach the client: the browser
 * would request the missing asset, the `[slug]` route would answer with an HTML
 * 404 page, and the image would briefly flash as a broken/grey tile.
 *
 * Keep this module server-only (it touches the filesystem); client components
 * should keep using `lib/project-images.ts`.
 */

/** True when a project image reference can actually be served. */
export function isUsableImage(src: unknown): src is string {
  if (typeof src !== "string" || src.length === 0) return false;
  if (/^data:/i.test(src)) return true;
  // Absolute or protocol-relative URL: leave it to the browser/CDN.
  if (/^[a-z][a-z0-9+.-]*:/i.test(src) || src.startsWith("//")) return true;

  const [pathname] = src.split(/[?#]/);
  if (!pathname.startsWith("/")) return true;

  return existsSync(path.join(process.cwd(), "public", pathname));
}

/**
 * Strip dead local image references from a project so `getProjectImage()` can
 * fall back to the AVIF placeholder instead of requesting a missing file.
 */
export function withUsableImages<T>(project: T | undefined): T | undefined {
  if (!project || typeof project !== "object") return project;

  const source = project as Record<string, any>;
  const images = Array.isArray(source.images) ? source.images.filter(isUsableImage) : source.images;
  const image = isUsableImage(source.image) ? source.image : null;

  if (images === source.images && image === source.image) return project;

  return { ...source, images, image } as T;
}

/** Real project image only — no placeholder — for metadata/JSON-LD. */
export function getProjectImageUrl(project: any): string | undefined {
  const fromList = Array.isArray(project?.images) ? project.images.find(isUsableImage) : undefined;
  if (fromList) return fromList;
  return isUsableImage(project?.image) ? project.image : undefined;
}
