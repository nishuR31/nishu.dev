import React from "react";
import { getPortfolioData } from "@/lib/portfolio";
import ProjectDetailView from "@/components/features/projects/ProjectDetailView";
import { getProjectSlugs } from "@/lib/slug-utils";
import type { Metadata } from "next";

export const dynamicParams = true;

export async function generateStaticParams() {
  const result = await getPortfolioData();
  const projects = result.ok ? (result.data?.projects ?? []) : [];
  const params: { slug: string }[] = [];

  for (const p of projects) {
    const projectSlugs = getProjectSlugs(p);
    for (const slug of projectSlugs) {
      params.push({ slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await getPortfolioData();
  const projects = result.ok ? (result.data?.projects ?? []) : [];
  const targetSlug = params.slug.toLowerCase();

  const project = projects.find((p: any) => getProjectSlugs(p).includes(targetSlug));

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const result = await getPortfolioData();
  const projects = result.ok ? (result.data?.projects ?? []) : [];
  const targetSlug = params.slug.toLowerCase();

  const initialProject = projects.find((p: any) => getProjectSlugs(p).includes(targetSlug));

  return <ProjectDetailView initialProject={initialProject} slug={params.slug} />;
}
