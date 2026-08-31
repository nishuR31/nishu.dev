"use client";
import React from "react";
import BackgroundEffects from "../../../components/ui/background-effects";
import { usePortfolio } from "../../../store";
import SectionTitle from "../../../components/features/projects/SectionTitle";
import { ProjectsList } from "../../../components/features/projects/ProjectsList";
import { Code, Terminal } from "lucide-react";

const ProjectsPage = () => {
  const { portfolioData, loading } = usePortfolio();
  const projects = portfolioData?.projects ?? [];
  const additionalProjects = portfolioData?.additionalProjects ?? [];

  return (
    <section className="py-16" id="projects">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 xl:px-24">
        <BackgroundEffects
          variant="diagonal"
          colors={{ first: "secondary", second: "secondary" }}
          intensity="10"
          blurAmount="3xl"
        />

        <div className="relative space-y-16">
          <div>
            <SectionTitle />
            <ProjectsList projects={projects} loading={loading} />
          </div>

          {additionalProjects.length > 0 && (
            <div className="pt-12 border-t border-border/50 space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-outfit text-foreground">
                    Additional & Utility Projects
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Modular utilities, cron workers, and developer tools
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {additionalProjects.map((item: string, idx: number) => {
                  const [title, ...descParts] = item.split("—");
                  const desc = descParts.join("—").trim();
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-card/60 border border-border/60 backdrop-blur-md hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-primary shrink-0" />
                          <h4 className="font-semibold text-foreground text-sm">
                            {title.trim()}
                          </h4>
                        </div>
                        {desc && (
                          <p className="text-xs text-muted-foreground pl-6">
                            {desc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;
