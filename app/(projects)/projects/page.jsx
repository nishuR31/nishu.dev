"use client";
import React from "react";
import BackgroundEffects from "@/components/ui/background-effects";
import { config } from "@/config";
import { usePortfolio } from "@/store";
import SectionTitle from "./components/SectionTitle";
import { ProjectsList } from "./components/ProjectsList";

const ProjectsPage = () => {
  const { portfolioData } = usePortfolio();
  const projects = portfolioData?.projects || config.projects;

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
          <ProjectsList projects={projects} />
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;
