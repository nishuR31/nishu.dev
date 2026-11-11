"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowLeft, Home, Settings, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";


const SITE_LINKS = [
  {
    title: "Home",
    url: "/",
    description: "Back to the main portfolio page",
  },
  {
    title: "About Me",
    url: "/#about",
    description: "Learn more about my background and philosophy",
  },
  {
    title: "Projects",
    url: "/projects",
    description: "Explore my open-source and personal projects",
  },
  {
    title: "Experience",
    url: "/experience",
    description: "Explore my professional experience and work history",
  },
  {
    title: "Experience Section",
    url: "/#experience",
    description: "View my experience section on the homepage",
  },
  {
    title: "Education",
    url: "/education",
    description: "My educational qualifications",
  },
  {
    title: "Certificates",
    url: "/certificates",
    description: "View my certifications and achievements",
  },
  {
    title: "Testimonials",
    url: "/testimonials",
    description: "See what colleagues, collaborators, and partners say about me",
  },
  {
    title: "Socials",
    url: "/socials",
    description: "Explore my social media and developer profiles",
  },
  {
    title: "Tech Stack",
    url: "/techstack",
    description: "Explore my development tools and technologies",
  },
  {
    title: "Contact",
    url: "/contact",
    description: "Get in touch with me",
  },
  {
    title: "Settings",
    url: "/settings",
    description: "Minimalist platform settings",
  },

  // Projects
  {
    title: "Project: StillTime",
    url: "/projects/stilltime",
    description: "StillTime project overview and details",
  },
  {
    title: "Project: Baksy",
    url: "/projects/baksy",
    description: "Product-focused full-stack application",
  },
  {
    title: "Project: Mathematics for All",
    url: "/projects/mathematics-for-all",
    description: "Making mathematics more accessible",
  },
  {
    title: "Project: Valor Fitness",
    url: "/projects/valor-fitness",
    description: "Fitness and workout-focused platform",
  },
  {
    title: "Project: Scafe",
    url: "/projects/scafe",
    description: "Full-stack application with modern backend architecture",
  },
  {
    title: "Project: RanchiKart",
    url: "/projects/ranchikart-hyper-local-e-commerce-platform",
    description: "Hyperlocal e-commerce platform",
  },
  {
    title: "Project: Lunarity",
    url: "/projects/lunarity",
    description: "Lunarity project overview and details",
  },
  {
    title: "Project: FocusMode",
    url: "/projects/focusmode",
    description: "Focus and productivity tracking system",
  },
  {
    title: "Project: Devclip Hub",
    url: "/projects/devclip-hub",
    description: "Developer-focused utility hub",
  },
  {
    title: "Project: GH Control",
    url: "/projects/gh-control",
    description: "Power-user GitHub command center",
  },
  {
    title: "Project: GuardianNest",
    url: "/projects/guardiannest",
    description: "GuardianNest project overview and details",
  },
  {
    title: "Project: NMOH",
    url: "/projects/nmoh",
    description: "NMOH project overview and details",
  },
  {
    title: "Project: SolFinder",
    url: "/projects/solfinder",
    description: "SolFinder project overview and details",
  },
  {
    title: "Project: MemoryWeb",
    url: "/projects/memoryweb-memory-web2",
    description: "GraphRAG-powered financial crime intelligence project",
  },
  {
    title: "Project: BoardVault",
    url: "/projects/boardvault",
    description: "Explore the BoardVault project",
  },
];

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);



const handleRev=(e)=>{
const icon=e.currentTarget;
icon.classList.remove("animate-spin","animate-spin-rev");
void icon.getBoundingClientRect();
icon.classList.add("animate-spin-rev");
};

const handleAnimationEnd=(e)=>{
const icon=e.currentTarget;
if(icon.classList.contains("animate-spin-rev")){
icon.classList.remove("animate-spin-rev");
icon.classList.add("animate-spin");
};
};
  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms delay
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter links based on debounced query
  const filteredLinks = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const lowerQuery = debouncedQuery.toLowerCase();
    return SITE_LINKS.filter(
      (link) =>
	link.url.toLowerCase().includes(lowerQuery) ||
        link.title.toLowerCase().includes(lowerQuery) ||
        link.description.toLowerCase().includes(lowerQuery),
    );
  }, [debouncedQuery]);
  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center relative overflow-hidden py-24">
      {/* Subtle ambient glows for the background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zinc-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-500/5 rounded-full blur-3xl pointer-events-none" />


      <div className="container px-6 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 max-w-6xl mx-auto">
          {/* Left Text Content */}
          <div className="flex-1 space-y-8 w-full max-w-xl text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-zinc-500 dark:text-zinc-400 font-semibold tracking-wider uppercase text-2xl sm:text-3xl">
                404 Error
              </h1>
              <h1 className="font-bold tracking-tight text-foreground font-outfit text-6xl sm:text-7xl md:text-8xl leading-[1.1]">
                Page not <br className="hidden lg:block" /> found
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
                Sorry, the page you are looking for doesn&apos;t exist or has been moved. Try
                searching our site or head back to safety.
              </p>
            </div>

            {/* Search Input & Dropdown */}
            <div className="relative w-full max-w-md mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)} // delay to allow clicks
                    placeholder="Search inside the app"
                    className="block w-full pl-10 pr-3 py-3 border border-zinc-500/20 rounded-xl leading-5 bg-card/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/40 focus:border-zinc-500/40 transition-all duration-300 glass-panel"
                  />
                </div>
              </div>

              {/* Search Results Dropdown */}
              {isFocused && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-zinc-500/30 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  {filteredLinks.length > 0 ? (
                    <ul className="max-h-60 overflow-y-auto py-2">
                      {filteredLinks.map((link, idx) => (
                        <li key={idx}>
                          <Link
                            href={link.url}
                            className="flex flex-col px-4 py-2 hover:bg-zinc-500/10 transition-colors group"
                          >
                            <span className="text-foreground font-medium flex items-center justify-between">
                              {link.title}
                              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {link.description}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No matching pages found for &quot;{debouncedQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Back Links */}
            <div className="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button
                asChild
                variant="ghost"
                className="rounded-full px-6 py-5 text-muted-foreground hover:text-foreground hover:bg-zinc-500/10 group"
              >
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Go back
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-6 py-5 glass-panel border-zinc-500/30 text-foreground hover:bg-foreground/5"
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Take me home
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex-1 w-full max-w-xl relative flex justify-center items-center">
            <div className="relative w-full aspect-video flex items-center justify-center opacity-80 select-none">
              {/* Abstract 404 Illustration using SVG */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-zinc-500/30 dark:text-zinc-500/60 stroke-current"
              >
                {/* Horizontal Tracks */}
                <line x1="20" y1="40" x2="380" y2="40" strokeWidth="2" />
                <line x1="20" y1="160" x2="380" y2="160" strokeWidth="2" />

                {/* First '4' */}
                <path d="M120 40 L60 120 L120 120 Z" strokeWidth="2" strokeLinejoin="round" />
                <line x1="120" y1="40" x2="120" y2="160" strokeWidth="2" />
                <circle cx="120" cy="40" r="12" fill="currentColor" />
                <circle cx="60" cy="120" r="12" fill="currentColor" />
                <circle cx="120" cy="120" r="12" fill="currentColor" />
                <circle cx="120" cy="160" r="12" fill="currentColor" />

                {/* The '0' is replaced by the absolute Settings icon below */}

                {/* Second '4' */}
                <path d="M340 40 L280 120 L340 120 Z" strokeWidth="2" strokeLinejoin="round" />
                <line x1="340" y1="40" x2="340" y2="160" strokeWidth="2" />
                <circle cx="340" cy="40" r="12" fill="currentColor" />
                <circle cx="280" cy="120" r="12" fill="currentColor" />
                <circle cx="340" cy="120" r="12" fill="currentColor" />
                <circle cx="340" cy="160" r="12" fill="currentColor" />
              </svg>

              {/* Spinning Gear for '0' */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                <Settings
                  className="w-24 cursor-pointer animate-spin h-24 sm:w-32 sm:h-32 text-zinc-500/30 dark:text-zinc-500/60  "
		onAnimationEnd={handleAnimationEnd}
		onClick={handleRev}
                  strokeWidth={1.5}
                />
              </div>

              {/* Glass overlay effect to make it premium */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background opacity-20 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
