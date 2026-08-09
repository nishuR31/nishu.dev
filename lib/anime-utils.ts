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
 * Runs an Anime.js animation once when the target element enters the viewport.
 * @param ref      - A React ref pointing to the element to observe
 * @param animate  - Callback receiving the element; call `anime({...})` inside
 * @param options  - IntersectionObserver options (default: rootMargin "-10% 0px")
 */
export function useAnimeOnScroll<T extends Element>(
  ref: RefObject<T | null>,
  animate: (el: T) => void,
  options: IntersectionObserverInit = { rootMargin: "-10% 0px", threshold: 0 }
): void {
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (animatedRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          observer.disconnect();
          if (!prefersReducedMotion()) {
            animate(el);
          } else {
            (el as unknown as HTMLElement).style.opacity = "1";
            (el as unknown as HTMLElement).style.transform = "none";
          }
        }
      });
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, []);
}

/**
 * Animates a number from 0 → `target` when the element enters the viewport.
 * Updates the text content of the ref element.
 */
export function useCountUp(
  ref: RefObject<HTMLElement | null>,
  target: number,
  duration = 1200,
  suffix = ""
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
      { rootMargin: "-10% 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration, suffix]);
}
