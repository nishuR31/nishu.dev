"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "@/store";
import { BatteryCharging, Battery } from "lucide-react";

const Footer = () => {
  const { portfolioData } = usePortfolio();
  const developer = portfolioData?.developer ?? "Nishu";

  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Battery API
  useEffect(() => {
    let battery = null;

    const initBattery = async () => {
      try {
        if (!("getBattery" in navigator)) {
          setBatteryLevel(null);
          return;
        }

        battery = await navigator.getBattery();

        const update = () => {
          setBatteryLevel(battery.level);
          setIsCharging(battery.charging);
        };

        update();

        battery.addEventListener("levelchange", update);
        battery.addEventListener("chargingchange", update);

        // cleanup fix (correct reference)
        return () => {
          battery.removeEventListener("levelchange", update);
          battery.removeEventListener("chargingchange", update);
        };
      } catch (err) {
        setBatteryLevel(null);
      }
    };

    let cleanup;
    initBattery().then((cb) => (cleanup = cb));

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const percentage =
    batteryLevel !== null ? Math.round(batteryLevel * 100) : null;

  const isFakeFull = isCharging && percentage === 100;

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex items-center justify-center py-6 border-t sm:py-8 border-secondary/20"
    >
      <div className="w-full max-w-4xl px-4 py-3 mx-auto text-center glass-panel rounded-2xl">
        <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 md:gap-2 leading-tight">
          <span>© {new Date().getFullYear()} {developer.name}</span>
          <span className="">•</span>
          <span>All rights reserved</span>
          <span className="">•</span>
          <span>Made by {developer.shortName}</span>
        </div>

        <div className="flex justify-center mt-3">
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1.5 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-sm">
              {isCharging ? <BatteryCharging /> : <Battery />}
            </span>

            <span
              className={`ml-1 ${percentage === null
                  ? "text-muted-foreground"
                  : percentage > 50
                    ? "text-emerald-400"
                    : percentage > 20
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
            >
              {percentage === null
                ? "--%"
                : isFakeFull
                  ? "Charging..."
                  : `${percentage}%`}
            </span>

            {hasMounted && (
              <span
                className={`ml-2 inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs font-medium border ${isOnline
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-400" : "bg-red-400"
                    }`}
                />
                <span>{isOnline ? "Online" : "Offline"}</span>
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
