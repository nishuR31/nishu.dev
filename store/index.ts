"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "./configStore";
import { setTheme, type ThemeMode, getTheme } from "@/slices/themeSlice";

export function useTheme(theme?: ThemeMode) {
  const dispatch = useDispatch<AppDispatch>();
  const currentTheme = useSelector(getTheme);
  useEffect(() => {
    if (theme) dispatch(setTheme(theme));
  }, [dispatch, theme]);
  return {
    currentTheme,
    setTheme: (value: ThemeMode) => {
      try {
        localStorage.setItem("theme", value);
      } catch {}
      dispatch(setTheme(value));
    },
  };
}
