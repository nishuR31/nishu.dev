"use client";
import React from "react";
import { GraduationCap, Calendar, Award } from "lucide-react";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
}

interface EducationSectionProps {
  portfolioData: any;
}

const EducationSection: React.FC<EducationSectionProps> = ({ portfolioData }) => {
  const education: Education[] = (portfolioData?.education ?? []).filter((e: any) => e.visible !== false);

  if (!education || education.length === 0) return null;

  return (
    <section className="py-24 cv-auto relative" id="education">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6 mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-emerald-500 backdrop-blur-sm">
            <GraduationCap className="w-5 h-5" />
            <span className="text-sm font-medium">Academic Background</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold font-outfit gradient-heading">
              Education
            </h2>
            <p className="text-lg text-muted-foreground">
              My academic journey and qualifications
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical connecting line */}
          <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent hidden md:block"></div>
          
          <div className="space-y-8">
            {education.map((edu, index) => (
              <div 
                key={edu.id || index}
                className="relative flex flex-col md:flex-row gap-6 md:gap-10 group"
              >
                {/* Timeline Node */}
                <div className="hidden md:flex flex-col items-center flex-shrink-0 z-10">
                  <div className="w-16 h-16 rounded-full bg-card border-4 border-background ring-2 ring-emerald-500/30 flex items-center justify-center shadow-lg group-hover:ring-emerald-500 transition-all duration-300">
                    <GraduationCap className="w-7 h-7 text-emerald-500" />
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1">
                  <div className="bg-card/60 backdrop-blur-md border border-border/60 hover:border-emerald-500/40 p-8 rounded-3xl transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden">
                    {/* Subtle corner accent */}
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-1 font-outfit">
                          {edu.institution}
                        </h3>
                        <p className="text-emerald-500 font-semibold text-lg">
                          {edu.degree} in {edu.field}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-2 sm:items-end text-sm text-muted-foreground font-medium bg-secondary/50 p-3 rounded-xl border border-border/50 shrink-0">
                        {(edu.startDate || edu.endDate) && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-emerald-500/70" />
                            {edu.startDate ? new Date(edu.startDate).getFullYear() : "?"} - {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
                          </div>
                        )}
                        {edu.grade && (
                          <div className="flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-amber-500/70" />
                            Grade: {edu.grade}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
