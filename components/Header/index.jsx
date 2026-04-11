"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/theme-toggle";

const NAV_ITEMS = config.NAV_ITEMS;

const NavLink = ({ href, label, isMobile = false }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="relative">
      <motion.span
        className={`relative ${isMobile ? "px-4 py-3 text-base" : "px-4 py-2"} text-foreground/70 hover:text-foreground transition-colors ${isActive ? "text-foreground" : ""}`}
        whileHover={{ scale: isMobile ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {label}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-secondary/30  rounded-lg backdrop-blur-sm"
            layoutId="activeNavBackground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            style={{
              zIndex: -1,
            }}
          />
        )}
      </motion.span>
    </Link>
  );
};

const Logo = ({ isMobile = false }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Link
      href="/"
      className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
    >
      <motion.div whileHover={{ opacity: 0.5 }} whileTap={{ scale: 0.95 }}>
        <Image
          src="/logo.png"
          width={2000}
          height={2000}
          alt="logo"
          priority
          className={`${isMobile ? "w-10 h-10" : "w-12 h-12 sm:w-14 sm:h-14"} rounded-full`}
        />
      </motion.div>
      <motion.span
        className={`text-foreground/80 font-semibold ${isMobile ? "hidden" : "text-sm lg:text-base"} max-w-[46vw] xl:max-w-none truncate`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="hidden lg:inline">
          {config.developer.name} · {config.developer.role}
        </span>
        <span className="lg:hidden">{config.developer.name}</span>
      </motion.span>
    </Link>
  </motion.div>
);

const Navigation = ({ isMobile = false, onLinkClick }) => (
  <motion.nav
    className={
      isMobile ? "flex flex-col space-y-4" : "hidden md:flex space-x-2"
    }
    initial={isMobile ? { opacity: 0 } : { opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: isMobile ? 0 : 0.3, duration: 0.5 }}
  >
    {NAV_ITEMS.map((item, index) => (
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

// Contact page removed — keep theme toggle and repo link inline in header

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className="sticky top-0 py-4 sm:py-5 z-50 text-foreground backdrop-blur-xl bg-background/70 border-b border-border/60"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <Navigation />
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-foreground/70 hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ?
              <X className="w-6 h-6" />
            : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-64 bg-background/95 backdrop-blur-md border-l border-border z-50 md:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full p-6">
                {/* Mobile Logo */}
                <div className="mb-8">
                  <Logo isMobile={true} />
                </div>

                {/* Mobile Navigation */}
                <div className="flex-1">
                  <Navigation isMobile={true} onLinkClick={closeMobileMenu} />
                </div>

                {/* Mobile actions */}
                <div className="mb-4 flex justify-center">
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
