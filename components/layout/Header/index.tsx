"use client";
import React, { useState, useRef, useEffect } from "react";
import { Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { prefersReducedMotion } from "@/lib/anime-utils";
import { NavSkeleton } from "@/components/ui/skeletons";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/theme-toggle";

interface NavItem {
  href: string;
  label: string;
}

interface NavLinkProps {
  href: string;
  label: string;
  isMobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, isMobile = false }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="relative">
      <span
        className={`relative flex flex-col items-center group ${isMobile ? "px-4 py-3 text-base" : "px-4 py-2"} text-foreground/70 hover:text-foreground transition-colors ${isActive ? "text-foreground" : ""} active:scale-95`}
      >
        {label}

        {/* Active background */}
        {isActive && (
          <div
            className="absolute inset-0 bg-purple-500/10 border border-purple-500/20 rounded-lg backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300"
            style={{ zIndex: -1 }}
          />
        )}

        {/* Animated underline via SVG */}
        {!isMobile && (
          <svg
            className="absolute bottom-0 left-2 right-2"
            height="2"
            style={{ overflow: "visible", pointerEvents: "none" }}
            aria-hidden="true"
          >
            <line
              x1="0" y1="1" x2="60" y2="1"
              stroke={isActive ? "#a855f7" : "#a855f740"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="60"
              className="transition-all duration-300 ease-out group-hover:![stroke-dashoffset:0]"
              style={{ strokeDashoffset: isActive ? 0 : 60 }}
            />
          </svg>
        )}
      </span>
    </Link>
  );
};

interface LogoProps {
  isMobile?: boolean;
  developer: Record<string, string>;
}

const Logo: React.FC<LogoProps> = ({ isMobile = false, developer }) => {
  return (
    <div>
      <Link
        href="/"
        className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
      >
        <div
          className="hover:opacity-75 hover:scale-105 active:scale-95 transition-all animate-in fade-in duration-500 delay-200"
        >
          <Image
            src="/logo.avif"
            width={84}
            height={84}
            alt="logo"
            priority
            className={`${isMobile ? "w-10 h-10" : "w-12 h-12 sm:w-14 sm:h-14"} rounded-full ring-2 ring-purple-500/20`}
          />
        </div>
        <span
          className={`text-foreground/80 font-semibold ${isMobile ? "hidden" : "text-sm lg:text-base"} max-w-[46vw] xl:max-w-none truncate animate-in fade-in duration-500 delay-400 fill-mode-both`}
        >
          <span className="lg:hidden">{developer?.name ?? "Nishu"}</span>
        </span>
      </Link>
    </div>
  );
};

interface NavigationProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
  navItems: NavItem[];
}

const Navigation: React.FC<NavigationProps> = ({ isMobile = false, onLinkClick, navItems = [] }) => (
  <nav
    className={`${isMobile ? "flex flex-col space-y-4 animate-in fade-in duration-500" : "hidden md:flex space-x-2 animate-in fade-in slide-in-from-top-4 duration-500 delay-300 fill-mode-both"}`}
  >
    {navItems.map((item, index) => (
      <div
        key={item.href}
        className={`${isMobile ? "animate-in slide-in-from-left-4 fade-in duration-300 fill-mode-both" : "animate-in slide-in-from-top-4 fade-in duration-300 fill-mode-both"}`}
        style={{ animationDelay: `${index * 100}ms` }}
        onClick={onLinkClick}
      >
        <NavLink {...item} isMobile={isMobile} />
      </div>
    ))}
  </nav>
);

const Header: React.FC = () => {
  const { portfolioData, loading } = usePortfolio();
  const developer = portfolioData?.developer ?? {};
  const navItems: NavItem[] = portfolioData?.NAV_ITEMS ?? [];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 py-4 sm:py-5 z-50 text-foreground glass-panel-strong border-b border-purple-500/10 animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both"
      >
        <div className="container mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo developer={developer} />
          {loading ? <NavSkeleton /> : <Navigation navItems={navItems} />}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/settings" className="p-2 text-foreground/70 hover:text-foreground transition-colors" aria-label="Settings">
              <Settings className="w-5 h-5" />
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="md:hidden p-2 text-foreground/70 hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className="fixed top-0 right-0 h-full w-64 glass-premium border-l border-purple-500/15 z-50 md:hidden overflow-y-auto animate-in slide-in-from-right duration-300"
          >
            <div className="flex flex-col h-full p-6">
              <div className="mb-8">
                <Logo isMobile developer={developer} />
              </div>
              <div className="flex-1">
                <Navigation isMobile onLinkClick={() => setIsMobileMenuOpen(false)} navItems={navItems} />
              </div>
              <div className="mb-4 flex justify-center items-center gap-6">
                <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-foreground/70 hover:text-foreground transition-colors" aria-label="Settings">
                  <Settings className="w-5 h-5" />
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
