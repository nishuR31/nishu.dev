"use client";
import React from "react";
import { motion } from "framer-motion";
import { config } from "@/config";
import Link from "next/link";
import { BatteryCharging } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-6 sm:py-8 border-t border-secondary/20 flex items-center justify-center"
    >
      <div className="glass-panel rounded-2xl text-center px-4 py-3 w-full max-w-4xl mx-auto">
        <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 md:gap-2 leading-tight">
          <span className="whitespace-nowrap">
            © {new Date().getFullYear()} {config.developer.name}
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="whitespace-nowrap">All rights reserved</span>
          <span className="hidden sm:inline">•</span>
          <span className="whitespace-nowrap">
            Made by {config.developer.shortName} with help
          </span>
        </div>
        <div className="mt-3 flex justify-center">
          <Link href="/system-status" className="group">
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1.5 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span>System Live</span>
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
