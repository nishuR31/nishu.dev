import React from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/features/home/HeroSection";
import AboutSection from "@/components/features/home/About";
import ExperienceSection from "@/components/features/home/Experience";
import SkillsSection from "@/components/features/home/Skills";
import { CertificatesSkeleton } from "@/components/ui/skeletons";

import GithubProjects from "@/components/features/home/GithubProjects";
import CertificatesSection from "@/components/features/home/Certificates";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import { getPortfolioData } from "@/lib/portfolio";
import { getGithubRepos } from "@/lib/github";

const Home = async () => {
  const portfolioData = await getPortfolioData();
  const developer = portfolioData?.developer ?? {};
  const social = portfolioData?.social ?? {};
  
  const githubRepos = social.github ? await getGithubRepos(social.github) : [];

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: developer.name,
    jobTitle: developer.role,
    description: developer.bio,
    email: developer.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: developer.location,
    },
    url: "https://nishudevportfolio.vercel.app",
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <RevealOnScroll>
        <HeroSection />
      </RevealOnScroll>
      <RevealOnScroll delay={80}>
        <AboutSection />
      </RevealOnScroll>
      <RevealOnScroll delay={120}>
        <ExperienceSection />
      </RevealOnScroll>
      <RevealOnScroll delay={120}>
        <GithubProjects initialRepos={githubRepos} />
      </RevealOnScroll>
      <RevealOnScroll delay={160}>
        <SkillsSection />
      </RevealOnScroll>
      <RevealOnScroll delay={120}>
        <CertificatesSection />
      </RevealOnScroll>

      {/* Footer CTAs */}
      <section className="py-16 pb-24">
        <div className="container px-6 mx-auto">
          <div
            className="flex flex-row justify-center gap-4 reveal-on-scroll opacity-0 translate-y-4 data-[state=visible]:animate-in data-[state=visible]:fade-in data-[state=visible]:slide-in-from-bottom-4 duration-500 fill-mode-both"
          >
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
        </div>
      </section>
    </div>
  );
};

export default Home;
