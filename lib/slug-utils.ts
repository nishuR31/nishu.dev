export const getProjectSlugs = (p: any): string[] => {
  const slugs = new Set<string>();
  if (!p) return [];
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
