"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { config } from "@/config";
import Link from "next/link";
import { BatteryCharging, Battery } from "lucide-react";

const Footer = () => {
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, []);
  useEffect(() => {
    let mounted = true;
    let battery = null;

    async function initBattery() {
      try {
        if (typeof navigator !== "undefined" && navigator.getBattery) {
          battery = await navigator.getBattery();
          if (!mounted) return;
          setBatteryLevel(battery.level);
          setIsCharging(battery.charging);

          const onLevel = () => mounted && setBatteryLevel(battery.level);
          const onCharging = () => mounted && setIsCharging(battery.charging);

          battery.addEventListener("levelchange", onLevel);
          battery.addEventListener("chargingchange", onCharging);

          return () => {
            try {
              battery.removeEventListener("levelchange", onLevel);
              battery.removeEventListener("chargingchange", onCharging);
            } catch (e) {
              // ignore
            }
          };
        }
      } catch (e) {
        // Battery API unavailable or denied
      }
    }

    const cleanupPromise = initBattery();
    return () => {
      mounted = false;
      if (cleanupPromise && typeof cleanupPromise.then === "function") {
        cleanupPromise.then((cb) => cb && cb());
      }
    };
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex items-center justify-center py-6 border-t sm:py-8 border-secondary/20"
    >
      <div className="w-full max-w-4xl px-4 py-3 mx-auto text-center glass-panel rounded-2xl">
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
        <div className="flex justify-center mt-3 ">
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
              <span>System Live</span>
              <span
                aria-live="polite"
                className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border border-border/50 bg-background/30`}
              >
                <span className="text-sm">
                  {isCharging ?
                    <BatteryCharging />
                  : <Battery />}
                </span>
                <span
                  className={`ml-1  ${
                    batteryLevel === null ? "text-muted-foreground"
                    : batteryLevel > 0.5 ? "text-emerald-400"
                    : batteryLevel > 0.2 ? "text-yellow-400"
                    : "text-red-400"
                  }`}
                >
                  {batteryLevel === null ?
                    "--%"
                  : `${Math.round(batteryLevel * 100)}%`}
                </span>
                <span
                  className={`ml-2 inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs font-medium border ${isOnline ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-400" : "bg-red-400"}`}
                  />
                  <span>{isOnline ? "Online" : "Offline"}</span>
                </span>
              </span>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
