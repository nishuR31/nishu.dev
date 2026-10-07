"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTheme, setTheme, type ThemeMode } from "@/slices/themeSlice";

export default function ThemeController() {
  const dispatch = useDispatch();
  const theme = useSelector(getTheme);
  useEffect(() => {
    let stored: ThemeMode = "dark";
    try {
      const value = localStorage.getItem("theme");
      if (value === "dark" || value === "light" || value === "system") stored = value;
    } catch {}
    dispatch(setTheme(stored));
    const syncStorage = (event: StorageEvent) => {
      if (event.key === "theme")
        dispatch(
          setTheme(
            event.newValue === "light" || event.newValue === "system" ? event.newValue : "dark",
          ),
        );
    };
    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, [dispatch]);
  useEffect(() => {
    // The pre-paint script is authoritative until stored state is hydrated.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      let selected = theme;
      try {
        const stored = localStorage.getItem("theme");
        if (stored === "dark" || stored === "light" || stored === "system") selected = stored;
      } catch {}
      const resolved = selected === "system" ? (media.matches ? "dark" : "light") : selected;
      const isDark = resolved === "dark";
      if (document.documentElement.classList.contains("dark") !== isDark) {
        document.documentElement.classList.toggle("dark", isDark);
        document.documentElement.classList.toggle("light", !isDark);
        document.documentElement.style.colorScheme = resolved;
      }
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
  return null;
}
