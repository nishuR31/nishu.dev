"use client";
import React from "react";
import HeroSection from "./components/HeroSection";
import GithubProjects from "./components/GithubProjects";
import SkillsSection from "./components/Skills";
import ExperienceSection from "./components/Experience";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import { config } from "@/config";

const Home = () => {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: config.developer.name,
    jobTitle: config.developer.role,
    description: config.developer.bio,
    email: config.developer.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: config.developer.location,
    },
    url: "https://nishu.portfolio.vercel.app",
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
        <ExperienceSection />
      </RevealOnScroll>
      <RevealOnScroll delay={120}>
        <GithubProjects />
      </RevealOnScroll>
      <RevealOnScroll delay={160}>
        <SkillsSection />
      </RevealOnScroll>

      <section className="py-16 pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full glass-panel text-card-foreground text-sm font-medium transition-all duration-300 hover-lift"
              >
                <span>Get In Touch</span>
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
