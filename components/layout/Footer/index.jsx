"use client";
import React, { useState, useEffect } from "react";
import { BatteryCharging, Battery } from "lucide-react";

const Footer = () => {
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

  const [isBackendReachable, setIsBackendReachable] = useState(null);

  // Backend reachability check
  useEffect(() => {
    let isMounted = true;
    const checkBackend = async () => {
      try {
        const res = await fetch(`/api/ping`, { method: "GET", cache: "no-store" });
        if (isMounted) setIsBackendReachable(res.ok);
      } catch (err) {
        if (isMounted) setIsBackendReachable(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 1000 * 60 * 5); // Check every 5min
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Battery API
  useEffect(() => {
    let battery = null;
    let cleanup;

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

        return () => {
          battery.removeEventListener("levelchange", update);
          battery.removeEventListener("chargingchange", update);
        };
      } catch {
        setBatteryLevel(null);
      }
    };

    initBattery().then((cb) => (cleanup = cb));

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const percentage =
    batteryLevel !== null ? Math.round(batteryLevel * 100) : null;

  const isFakeFull = isCharging && percentage === 100;

  return (
    <footer className="flex items-center justify-center py-6 border-t sm:py-8 border-secondary/20">
      <div className="w-full max-w-4xl px-4 py-3 mx-auto text-center glass-panel rounded-2xl">

        <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 md:gap-2 leading-tight">
          <span>© {new Date().getFullYear()} Nishan Rajak</span>
          <span>•</span>
          <span>All rights reserved</span>
          <span>•</span>
          <span>Made by Nishu</span>
        </div>

        <div className="flex justify-center mt-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1.5 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors">

            {/* Backend Reachability */}
            {hasMounted && isBackendReachable !== null && (
              <span
                className={`mr-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium border ${isBackendReachable
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    : "bg-orange-500/10 border-orange-500/20 text-orange-400"
                  }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${isBackendReachable ? "bg-blue-400" : "bg-orange-400"
                    }`}
                />
                <span>{isBackendReachable ? "API Online" : "API Offline"}</span>
              </span>
            )}

            <span className="text-sm flex items-center justify-center">
              {isCharging ? <BatteryCharging className="w-4 h-4" /> : <Battery className="w-4 h-4" />}
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
                className={`ml-2 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium border ${isOnline
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
