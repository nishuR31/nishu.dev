"use client";
import React from "react";
import BackgroundEffects from "@/components/ui/background-effects";
import { usePortfolio } from "@/store";
import SectionTitle from "@/components/features/projects/SectionTitle";
import { ProjectsList } from "@/components/features/projects/ProjectsList";

const ProjectsPage = () => {
  const { portfolioData, loading } = usePortfolio();
  const projects = portfolioData?.projects ?? [];

  return (
    <section className="py-16" id="projects">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 xl:px-24">
        <BackgroundEffects
          variant="diagonal"
          colors={{ first: "secondary", second: "secondary" }}
          intensity="10"
          blurAmount="3xl"
        />

        <div className="relative">
          <SectionTitle />
          <ProjectsList projects={projects} loading={loading} />
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;
