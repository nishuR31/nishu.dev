import type { MetadataRoute } from "next";
import { getPortfolioData } from "../lib/portfolio";
import { getProjectSlugs } from "../lib/slug-utils";

const BASE_URL = "https://nishudevportfolio.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/experience`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/testimonials`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/socials`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/certificates`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  try {
    const result = await getPortfolioData();
    const projects = result.ok ? (result.data?.projects ?? []) : [];
    const addedSlugs = new Set<string>();

    for (const project of projects) {
      const slugs = getProjectSlugs(project);
      if (slugs && slugs.length > 0) {
        // Prefer slug or URL-safe title slug
        const canonicalSlug =
          project.slug?.toLowerCase() ||
          (project.title
            ? project.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "")
            : slugs[0]);

        if (canonicalSlug && !addedSlugs.has(canonicalSlug)) {
          addedSlugs.add(canonicalSlug);
          routes.push({
            url: `${BASE_URL}/projects/${canonicalSlug}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
          });
        }
      }
    }
  } catch {
    // Return base routes if data fetching fails
  }

  return routes;
}
