import React from "react";
import { getPortfolioData } from "@/lib/portfolio";
import BackgroundEffects from "@/components/ui/background-effects";
import { BriefcaseBusiness, Calendar, Code2, GraduationCap, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience | Nishan Rajak",
  description:
    "Professional experience, education, and engineering track record of Nishan Rajak — backend-focused software engineering student.",
  robots: {
    index: true,
    follow: true,
  },
};

import { ExperienceSkeleton } from "@/components/ui/skeletons";
import JourneySwitcher from "@/components/features/journey/JourneySwitcher";
import { Suspense } from "react";

const ExperienceContent = async () => {
  const result = await getPortfolioData();
  const portfolioData = result.ok ? result.data : null;
  const experiences = portfolioData?.experiences ?? [];
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 z-0 w-px bg-gradient-to-b from-primary/25 via-border/60 to-transparent hidden md:block" />

      <div className="space-y-10">
        {experiences.length > 0 ? (
          experiences.map((exp: any, index: number) => {
            const isBTech =
              (exp.position || exp.title || "").toLowerCase().includes("b.tech") ||
              (exp.company || exp.organization || "").toLowerCase().includes("icfai");
            const TimelineIcon = isBTech ? GraduationCap : index === 0 ? Code2 : BriefcaseBusiness;

            return (
              <div key={index} className="flex gap-6 group">
                {/* Timeline node */}
                <div className="flex-shrink-0 relative z-10 hidden md:flex flex-col items-center">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center shadow-lg ${
                      isBTech
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                        : "bg-primary/10 border-primary/15 text-primary"
                    }`}
                  >
                    <TimelineIcon className="w-5 h-5" />
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1 pb-2">
                  <div className="relative overflow-hidden rounded-2xl border-2 border-border/60 bg-card/70 backdrop-blur-md p-6">
                    {/* Top accent */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl ${
                        isBTech
                          ? "bg-gradient-to-b from-blue-500/80 to-blue-500/25"
                          : "bg-gradient-to-b from-primary/80 to-primary/25"
                      }`}
                    />

                    <div className="pl-3">
                      {/* Header row */}
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-foreground font-outfit mb-1">
                            {exp.position || exp.title || exp.role}
                          </h2>
                          <p className="text-primary/80 font-medium text-sm">
                            {exp.company || exp.organization}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5 items-start md:items-end text-sm text-muted-foreground shrink-0">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {typeof exp.period === "string"
                                ? exp.period
                                : `${exp.period?.start} – ${exp.period?.end || "Present"}`}
                            </span>
                          </div>
                          {exp.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{exp.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      {exp.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                          {exp.description}
                        </p>
                      )}

                      {/* Responsibilities / Achievements */}
                      {(exp.responsibilities || exp.achievements || []).length > 0 && (
                        <ul className="space-y-2 mb-5">
                          {(exp.responsibilities || exp.achievements || []).map(
                            (item: string, idx: number) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="text-primary/60 mt-1 shrink-0">▸</span>
                                <span>{item}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      )}

                      {/* Tech pills */}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                          {exp.technologies.map((tech: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No experience data configured.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ExperiencePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundEffects
        variant="diagonal"
        colors={{ first: "primary", second: "secondary" }}
        intensity="8"
        blurAmount="3xl"
      />

      <div className="container mx-auto px-6 py-24 max-w-5xl relative z-10">
        {/* Back nav */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="journey-page__split-header">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-foreground text-sm font-medium">
              <BriefcaseBusiness className="w-4 h-4" />
              Experience
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-outfit gradient-heading">
              My Journey
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A timeline of my professional growth and engineering practice.
            </p>
          </div>
          <JourneySwitcher current="experience" />
        </div>

        <Suspense fallback={<ExperienceSkeleton />}>
          <ExperienceContent />
        </Suspense>
      </div>
    </div>
  );
}
