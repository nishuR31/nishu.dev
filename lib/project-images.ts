/**
 * Single source of truth for picking a project's image.
 *
 * Rule: use the project's own image URL when it has one (the portfolio API
 * populates `images[]`, while `image` is null), otherwise fall back to the
 * local AVIF placeholder in `public/`.
 */
export const PROJECT_IMAGE_FALLBACK = "/logo.avif";

export function getProjectImage(project: any, options: { preferSecondary?: boolean } = {}): string {
  const images = Array.isArray(project?.images)
    ? project.images.filter(
        (src: unknown): src is string => typeof src === "string" && src.length > 0,
      )
    : [];

  if (images.length > 0) {
    return (options.preferSecondary && images[1]) || images[0];
  }

  if (typeof project?.image === "string" && project.image.length > 0) {
    return project.image;
  }

  return PROJECT_IMAGE_FALLBACK;
}
