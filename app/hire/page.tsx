import React from "react";
import BackgroundEffects from "@/components/ui/background-effects";
import { getPortfolioData } from "@/lib/portfolio";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, Download, Mail, ArrowRight, FileText } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire Me - CVs & Resumes | Nishan Rajak",
  description: "Download professional resumes and contact for opportunities.",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function HirePage() {
  const result = await getPortfolioData();
  const portfolioData = result.ok ? result.data : null;

  const cvs = portfolioData?.cvs || [];
  const developer = portfolioData?.developer;

  return (
    <main className="min-h-screen py-24 relative overflow-hidden">
      <BackgroundEffects
        variant="diagonal"
        colors={{ first: "primary", second: "secondary" }}
        intensity="10"
        blurAmount="3xl"
      />
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary mb-6 shadow-xl shadow-primary/5">
              <Briefcase className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-outfit gradient-heading">
              Curated Resumes
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional, detailed backgrounds of my technical expertise, ready for download.
              Choose the profile that best matches your hiring needs.
            </p>
          </div>

          {/* CVs Grid */}
          {cvs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {cvs.map((cv: any) => (
                <div
                  key={cv.id}
                  className="p-8 rounded-2xl bg-card border border-border/50 glass-premium flex flex-col justify-between space-y-6 hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center text-foreground">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-semibold font-outfit text-foreground">
                      {cv.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {cv.description}
                    </p>
                    {cv.lastUpdated && (
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Last Updated: {cv.lastUpdated}
                      </p>
                    )}
                  </div>
                  <Button
                    asChild
                    className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                  >
                    <a href={cv.url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-card/50 rounded-2xl border border-border/30">
              <p className="text-muted-foreground">
                No CVs are currently available. Please check back later.
              </p>
            </div>
          )}

          {/* Contact Section */}
          <div className="mt-20 pt-16 border-t border-border/30 text-center space-y-8">
            <h3 className="text-2xl md:text-3xl font-bold font-outfit text-foreground">
              Ready to collaborate?
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              I am currently open to new opportunities. Let&apos;s discuss how my skills can add
              value to your team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                variant="default"
                className="rounded-full px-8 py-6 w-full sm:w-auto text-base"
              >
                <a href={`mailto:${developer?.email || "nishan.developer.dev@gmail.com"}`}>
                  <Mail className="w-5 h-5 mr-2" />
                  Email Me Directly
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-8 py-6 w-full sm:w-auto text-base bg-card border-border/50"
              >
                <Link href="/contact">
                  Visit Contact Page
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
