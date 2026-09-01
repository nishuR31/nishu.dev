import React from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/features/home/HeroSection";
import AboutSection from "@/components/features/home/About";
import ExperienceSection from "@/components/features/home/Experience";
import SkillsSection from "@/components/features/home/Skills";
import { CertificatesSkeleton } from "@/components/ui/skeletons";

import GithubProjectsWrapper from "@/components/features/home/GithubProjectsWrapper";
import CertificatesSection from "@/components/features/home/Certificates";
import AssistantWidget from "@/components/features/home/Assistant";

import Link from "next/link";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import { getPortfolioData } from "@/lib/portfolio";
import { Suspense } from "react";

const Home = async () => {
  const result = await getPortfolioData();
  const portfolioData = result.ok ? result.data : null;
  
  const developer = portfolioData?.developer ?? {};
  const social = portfolioData?.social ?? {};

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: developer.name || "Nishan Rajak",
    jobTitle: developer.role || "Backend Developer",
    description: developer.bio || "",
    email: developer.email || "",
    address: {
      "@type": "PostalAddress",
      addressCountry: developer.location || "",
    },
    url: "https://nishudevportfolio.vercel.app",
  };

  if (!result.ok && !portfolioData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100svh-80px)] w-full text-center px-4">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Failed to load portfolio</h2>
        <p className="text-muted-foreground">{result.error}</p>
      </div>
    );
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <RevealOnScroll>
        <HeroSection portfolioData={portfolioData} />
      </RevealOnScroll>
      <RevealOnScroll delay={80}>
        <AboutSection portfolioData={portfolioData} />
      </RevealOnScroll>
      <RevealOnScroll delay={120}>
        <ExperienceSection portfolioData={portfolioData} />
      </RevealOnScroll>
      <RevealOnScroll delay={120}>
        <Suspense fallback={<div className="h-40 flex flex-col items-center justify-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mb-4" />Loading projects...</div>}>
          <GithubProjectsWrapper username={social.github} portfolioData={portfolioData} />
        </Suspense>
      </RevealOnScroll>
      <RevealOnScroll delay={160}>
        <SkillsSection portfolioData={portfolioData} />
      </RevealOnScroll>
      <RevealOnScroll delay={120}>
        <CertificatesSection portfolioData={portfolioData} />
      </RevealOnScroll>

      {/* Footer CTAs */}
      <section className="py-16 pb-24">
        <div className="container px-6 mx-auto">
          <RevealOnScroll delay={100}>
            <div className="flex flex-row justify-center gap-4">
              <Link href="/projects">
                <div
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 rounded-full group glass-premium text-foreground hover-lift border border-border btn-shimmer hover:scale-105 active:scale-95"
                >
                  <span>View Projects</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
              <Link href="/certificates">
                <div
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 rounded-full group glass-premium text-foreground hover-lift border border-border btn-shimmer hover:scale-105 active:scale-95"
                >
                  <span>View Certificates</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <AssistantWidget portfolioData={portfolioData} />
    </div>
  );
};

export default Home;
