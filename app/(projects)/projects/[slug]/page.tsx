import React from "react";
import { getPortfolioData } from "@/lib/portfolio";
import ProjectDetailView, { getProjectSlugs } from "@/components/features/projects/ProjectDetailView";

export const dynamicParams = true;

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

  const initialProject = projects.find((p: any) => {
    const slugs = getProjectSlugs(p);
    return slugs.includes(targetSlug);
  });

  return <ProjectDetailView initialProject={initialProject} slug={params.slug} />;
}
