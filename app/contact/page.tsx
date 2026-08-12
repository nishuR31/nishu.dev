"use client";
import React from "react";
import { usePortfolio } from "@/store";
import { Github, Linkedin, Mail, Globe, Twitter, ArrowRight, Code, Bug } from "lucide-react";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import Link from "next/link";
import { ContactSkeleton } from "@/components/ui/skeletons";

export default function ContactPage() {
  const { portfolioData, loading } = usePortfolio();

  if (loading) return <ContactSkeleton />;

  const developer = portfolioData.developer ?? {};
  const social = portfolioData.social ?? {};

  const contactLinks = [
    {
      name: "Email",
      value: developer.email || "loading...",
      icon: <Mail className="w-6 h-6" />,
      href: `mailto:${developer.email || "loading..."}`,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    {
      name: "GitHub",
      value: social.github || "nishur31",
      icon: <Github className="w-6 h-6" />,
      href: `https://github.com/${social.github || "nishur31"}`,
      color: "text-zinc-800 dark:text-zinc-200",
      bg: "bg-zinc-500/10",
      border: "border-zinc-500/20",
    },
    {
      name: "LinkedIn",
      value: social.linkedin || "nishan-rajak",
      icon: <Linkedin className="w-6 h-6" />,
      href: `https://linkedin.com/in/${social.linkedin || "nishan-rajak"}`,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      name: "Website",
      value: "Nishan Portfolio",
      icon: <Globe className="w-6 h-6" />,
      href: process.env.NEXT_PUBLIC_FRONTEND_URL || "https://nishudevportfolio.vercel.app",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  ];

  if (social.twitter) {
    contactLinks.push({
      name: "Twitter",
      value: social.twitter,
      icon: <Twitter className="w-6 h-6" />,
      href: `https://twitter.com/${social.twitter}`,
      color: "text-sky-500",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
    });
  }
  if (social.leetcode) {
    contactLinks.push({
      name: "LeetCode",
      value: social.leetcode ?? "nishanr_19",
      icon: <Code className="w-6 h-6" />,
      href: `https://leetcode.com/u/${social.leetcode ?? "nishanr_19"}`,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    });
  }
  if (social.hackerone) {
    contactLinks.push({
      name: "HackerOne",
      value: social.hackerone ?? "nishur",
      icon: <Bug className="w-6 h-6" />,
      href: `https://hackerone.com/${social.hackerone ?? "nishur"}`,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    });
  }

  return (
    <div className="min-h-[calc(100vh-100px)] py-20 relative overflow-hidden flex items-center justify-center">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-6 mx-auto relative z-10">
        <RevealOnScroll>
          <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-outfit">
              Let's <span className="gradient-heading">Connect</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              I'm always open to discussing product design work, software engineering, or partnership opportunities.
              Feel free to reach out to me through any of the platforms below.
              For more information, visit <a href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}`} className="text-foreground font-medium underline underline-offset-4 decoration-purple-500/50 hover:decoration-purple-500 transition-colors">Nishan Portfolio</a>.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {contactLinks.map((link, index) => (
              <Link key={index} href={link.href} target="_blank" rel="noopener noreferrer" className="block w-full sm:w-[280px]">
                <div
                  className={`flex flex-col items-center justify-center p-8 h-full rounded-2xl glass-panel hover-lift border transition-all duration-300 ${link.border} hover:border-purple-500/30 group cursor-pointer hover:-translate-y-1 hover:scale-[1.02] active:scale-95`}
                >
                  <div className={`p-4 rounded-full ${link.bg} ${link.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {link.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{link.name}</h3>
                  <p className="text-sm text-muted-foreground text-center truncate w-full group-hover:text-foreground transition-colors duration-300">
                    {link.value}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <div className="mt-20 flex justify-center">
            <Link href="/">
              <button
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium transition-all duration-300 rounded-full group glass-premium text-foreground hover-lift border border-purple-500/20 btn-shimmer hover:scale-105 active:scale-95"
              >
                <span>Back to Home</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}
