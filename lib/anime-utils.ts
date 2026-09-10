/**
 * anime-utils.ts
 * Shared typed helpers for Anime.js animations across the portfolio.
 * All animations respect `prefers-reduced-motion` and the `data-motion="off"` attribute.
 */
"use client";

import { useEffect, useRef, RefObject } from "react";

/** Returns true when the user prefers reduced motion */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.dataset.motion === "off"
  );
}

/**
 * Animates a number from 0 → `target` when the element enters the viewport.
 * Updates the text content of the ref element.
 */
export function useCountUp(
  ref: RefObject<HTMLElement | null>,
  target: number,
  duration = 1200,
  suffix = "",
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) {
      if (el) el.textContent = `${target}${suffix}`;
      return;
    }

    let start: number | null = null;
    let raf: number;
    let triggered = false;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(eased * target)}${suffix}`;
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !triggered) {
          triggered = true;
          observer.disconnect();
          raf = requestAnimationFrame(step);
        }
      },
      { rootMargin: "-10% 0px" },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref, target, duration, suffix]);
}

/**
 * Custom hook to add a 'data-state="visible"' attribute to elements when they scroll into view.
 */
export function useScrollReveal({ threshold = 0.1, rootMargin = "0px" } = {}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (prefersReducedMotion()) {
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
        el.setAttribute("data-state", "visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-state", "visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin },
    );

    // Use a small timeout to ensure DOM is fully rendered before querying
    const timeoutId = setTimeout(() => {
      document.querySelectorAll(".reveal-on-scroll:not([data-state='visible'])").forEach((el) => {
        observer.observe(el);
      });
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [threshold, rootMargin]);
}
