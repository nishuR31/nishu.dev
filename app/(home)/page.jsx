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
const SoftAurora = dynamic(() => import("@/components/ui/softAurora"), {
  ssr: false,
  loading: () => <PageLoader />,
});

import Link from "next/link";
import { motion } from "framer-motion";
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

      <SoftAurora
        speed={0.6}
        scale={1.5}
        brightness={1}
        color1="#f7f7f7"
        color2="#e100ff"
        noiseFrequency={2.5}
        noiseAmplitude={1}
        bandHeight={0.5}
        bandSpread={1}
        octaveDecay={0.1}
        layerOffset={0}
        colorSpeed={1}
        enableMouseInteraction
        mouseInfluence={0.25}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-row justify-center gap-4"
          >
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 rounded-full group glass-premium text-purple-300 hover-lift border border-purple-500/20 btn-shimmer"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </Link>
            <Link href="/certificates">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 rounded-full group glass-panel text-card-foreground hover-lift"
              >
                <span>View Certificates</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

