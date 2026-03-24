"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const ThemeContext = createContext({ theme: "system", setTheme: () => {} });

export function ThemeProvider({ children, defaultTheme = "dark" }) {
  const [theme, setThemeState] = useState("system");

  // resolve and apply class to documentElement
  const applyTheme = useCallback((raw) => {
    if (typeof window === "undefined") return;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved =
      raw === "system" ?
        prefersDark ? "dark"
        : "light"
      : raw;
    if (resolved === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored) setThemeState(stored);
      else setThemeState(defaultTheme || "system");
    } catch (e) {
      setThemeState(defaultTheme || "system");
    }
  }, [defaultTheme]);

  // apply whenever theme state changes
  useEffect(() => {
    applyTheme(theme);

    let mql = null;
    const handleChange = () => applyTheme(theme);

    if (typeof window !== "undefined" && window.matchMedia) {
      mql = window.matchMedia("(prefers-color-scheme: dark)");
      mql.addEventListener?.("change", handleChange);
    }

    return () => {
      if (mql) mql.removeEventListener?.("change", handleChange);
    };
  }, [theme, applyTheme]);

  const setTheme = useCallback(
    (value) => {
      try {
        if (value === "system") {
          localStorage.removeItem("theme");
          setThemeState("system");
          applyTheme("system");
        } else {
          localStorage.setItem("theme", value);
          setThemeState(value);
          applyTheme(value);
        }
      } catch (e) {
        // ignore storage errors
        setThemeState(value);
        applyTheme(value);
      }
    },
    [applyTheme],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
