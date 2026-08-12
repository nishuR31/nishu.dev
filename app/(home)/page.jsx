"use client";
import React from "react";
import dynamic from "next/dynamic";
import HeroSection from "./components/HeroSection";
import PageLoader from "@/components/ui/page-loader";

const GithubProjects = dynamic(() => import("./components/GithubProjects"), {
  ssr: false,
  loading: () => <PageLoader />,
});
const AboutSection = dynamic(() => import("./components/About"), {
  ssr: false,
  loading: () => <PageLoader />,
});
const ExperienceSection = dynamic(() => import("./components/Experience"), {
  ssr: false,
  loading: () => <PageLoader />,
});
const SkillsSection = dynamic(() => import("./components/Skills"), {
  ssr: false,
  loading: () => <PageLoader />,
});
const CertificatesSection = dynamic(() => import("./components/Certificates"), {
  ssr: false,
  loading: () => <PageLoader />,
});


import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import { usePortfolio } from "@/store";

const Home = () => {
  const { portfolioData } = usePortfolio();
  const developer = portfolioData?.developer ?? {};

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
        <GithubProjects />
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
              <button
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 rounded-full group glass-premium text-foreground hover-lift border border-border btn-shimmer hover:scale-105 active:scale-95"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
            <Link href="/certificates">
              <button
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 rounded-full group glass-premium text-foreground hover-lift border border-border btn-shimmer hover:scale-105 active:scale-95"
              >
                <span>View Certificates</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
