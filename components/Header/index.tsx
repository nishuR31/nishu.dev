"use client";
import React, { useState, useRef, useEffect } from "react";
import { Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/theme-toggle";
import { prefersReducedMotion } from "@/lib/anime-utils";
import { NavSkeleton } from "@/components/ui/skeletons";

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
      <motion.span
        className={`relative flex flex-col items-center ${isMobile ? "px-4 py-3 text-base" : "px-4 py-2"} text-foreground/70 hover:text-foreground transition-colors ${isActive ? "text-foreground" : ""}`}
        initial="rest"
        animate="rest"
        whileHover={isMobile ? undefined : "hover"}
        whileTap={{ scale: 0.95 }}
      >
        {label}

        {/* Active background */}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-purple-500/10 border border-purple-500/20 rounded-lg backdrop-blur-sm"
            layoutId="activeNavBackground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
            <motion.line
              x1="0" y1="1" x2="60" y2="1"
              stroke={isActive ? "#a855f7" : "#a855f740"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="60"
              variants={{
                rest: { strokeDashoffset: isActive ? 0 : 60 },
                hover: { strokeDashoffset: 0 }
              }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
          </svg>
        )}
      </motion.span>
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
        <motion.div
          initial={prefersReducedMotion() ? undefined : { opacity: 0, rotateY: 90 }}
          animate={prefersReducedMotion() ? undefined : { opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          whileHover={{ opacity: 0.75, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src="/logo.avif"
            width={84}
            height={84}
            alt="logo"
            priority
            className={`${isMobile ? "w-10 h-10" : "w-12 h-12 sm:w-14 sm:h-14"} rounded-full ring-2 ring-purple-500/20`}
          />
        </motion.div>
        <motion.span
          className={`text-foreground/80 font-semibold ${isMobile ? "hidden" : "text-sm lg:text-base"} max-w-[46vw] xl:max-w-none truncate`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="lg:hidden">{developer?.name ?? "Nishu"}</span>
        </motion.span>
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
  <motion.nav
    className={isMobile ? "flex flex-col space-y-4" : "hidden md:flex space-x-2"}
    initial={isMobile ? { opacity: 0 } : { opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: isMobile ? 0 : 0.3, duration: 0.5 }}
  >
    {navItems.map((item, index) => (
      <motion.div
        key={item.href}
        initial={isMobile ? { opacity: 0, x: -20 } : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: isMobile ? index * 0.1 : 0.1 * index }}
        onClick={onLinkClick}
      >
        <NavLink {...item} isMobile={isMobile} />
      </motion.div>
    ))}
  </motion.nav>
);

const Header: React.FC = () => {
  const { portfolioData, loading } = usePortfolio();
  const developer = portfolioData?.developer ?? {};
  const navItems: NavItem[] = portfolioData?.NAV_ITEMS ?? [];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        className="sticky top-0 py-4 sm:py-5 z-50 text-foreground glass-panel-strong border-b border-purple-500/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-64 glass-premium border-l border-purple-500/15 z-50 md:hidden overflow-y-auto"
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
