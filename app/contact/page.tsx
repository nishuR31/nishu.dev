import React from "react";
import { Github, Linkedin, Mail, Globe, Twitter, ArrowRight, Code, Bug } from "lucide-react";
import RevealOnScroll from "../../components/ui/reveal-on-scroll";
import Link from "next/link";
import { getPortfolioData } from "@/lib/portfolio";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Contact",
};

import { ContactSkeleton } from "@/components/ui/skeletons";
import { Suspense } from "react";

const ContactContent = async () => {
  const result = await getPortfolioData();
  const portfolioData = result.ok ? result.data : null;

  if (!result.ok && !portfolioData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100svh-80px)] w-full text-center px-4">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Failed to load contact info</h2>
        <p className="text-muted-foreground">{result.error}</p>
      </div>
    );
  }

  const developer = portfolioData.developer ?? {};
  const social = portfolioData.social ?? {};

  const formatUrl = (baseUrl: string, handle: string | undefined) => {
    if (!handle) return '#';
    if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
    return `${baseUrl}${handle}`;
  };

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
      value: social.github || "loading...",
      icon: <Github className="w-6 h-6" />,
      href: formatUrl("https://github.com/", social.github),
      color: "text-zinc-800 dark:text-zinc-200",
      bg: "bg-zinc-500/10",
      border: "border-zinc-500/20",
      stats: social?.githubFollowers ? [
        { label: "Followers", value: social.githubFollowers },
        { label: "Repos", value: social.githubRepos }
      ] : null
    },
    {
      name: "LinkedIn",
      value: social.linkedin || "loading...",
      icon: <Linkedin className="w-6 h-6" />,
      href: formatUrl("https://linkedin.com/in/", social.linkedin),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      name: "Website",
      value: "Nishan Portfolio",
      icon: <Globe className="w-6 h-6" />,
      href: process.env.NEXT_PUBLIC_SITE_URL || "loading...",
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
      href: formatUrl("https://twitter.com/", social.twitter),
      color: "text-sky-500",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
    });
  }
  if (social.leetcode) {
    contactLinks.push({
      name: "LeetCode",
      value: social.leetcode ?? "loading...",
      icon: <Code className="w-6 h-6" />,
      href: formatUrl("https://leetcode.com/u/", social.leetcode),
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      stats: social?.leetcodeSolved ? [
        { label: "Solved", value: social.leetcodeSolved },
        { label: "Rank", value: social.leetcodeRanking }
      ] : null
    });
  }
  if (social.hackerone) {
    contactLinks.push({
      name: "HackerOne",
      value: social.hackerone ?? "loading...",
      icon: <Bug className="w-6 h-6" />,
      href: formatUrl("https://hackerone.com/", social.hackerone),
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    });
  }

  return (
    <>
      <RevealOnScroll>
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-outfit">
            Let&apos;s <span className="gradient-heading">Connect</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            I&apos;m always open to discussing product design work, software engineering, or partnership opportunities.
            Feel free to reach out to me through any of the platforms below.
            For more information, visit <a href={`${process.env.NEXT_PUBLIC_SITE_URL}`} className="text-foreground font-medium underline underline-offset-4 decoration-purple-500/50 hover:decoration-purple-500 transition-colors">Nishan Portfolio</a>.
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
                {(link as any).stats && (
                  <div className="flex gap-4 mt-4 pt-4 border-t border-border/50 w-full justify-center">
                    {(link as any).stats.map((stat: any, i: number) => (
                      <div key={i} className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                        <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                )}
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
    </>
  );
};

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-100px)] py-20 relative overflow-hidden flex items-center justify-center">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-6 mx-auto relative z-10">
        <Suspense fallback={<ContactSkeleton />}>
          <ContactContent />
        </Suspense>
      </div>
    </div>
  );
}
