"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "./configStore";


import {
    portfolioData as portfolio,
    portfolioLoading,
    portfolioError,
    fetchStart,
    fetchSuccess,
    fetchFailure,
} from "@/slices/portfolioSlice";

import { setTheme, ThemeMode, getTheme } from "@/slices/themeSlice";

const api = process.env.NEXT_PUBLIC_API_URL || "https://nishu-dev-api.onrender.com";

const getStoredTheme = (): ThemeMode | null => {
    if (typeof window === "undefined") return null;

    const theme = localStorage.getItem("theme");

    if (
        theme === "light" ||
        theme === "dark" ||
        theme === "system"
    ) {
        return theme;
    }

    return null;
};

export function useTheme(theme?: ThemeMode) {
    const dispatch = useDispatch<AppDispatch>();

    const currentTheme = useSelector(getTheme);

    useEffect(() => {
        if (!theme) return;

        dispatch(setTheme(theme));
    }, [dispatch, theme]);

    const isMounted = useRef(false);
    useEffect(() => {
        if (typeof window === "undefined") return;
        
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        localStorage.setItem("theme", currentTheme);
    }, [currentTheme]);

    useEffect(() => {
        const stored = getStoredTheme();

        if (stored && stored !== currentTheme) {
            dispatch(setTheme(stored));
        }
    }, [dispatch]);

    return {
        currentTheme,
        setTheme: (t: ThemeMode) => dispatch(setTheme(t)),
    };
}

export function usePortfolio() {
    const dispatch = useDispatch<AppDispatch>();
    const portfolioData = useSelector(portfolio);
    const loading = useSelector(portfolioLoading);
    const error = useSelector(portfolioError);

    // Fetch removed: Hydrated on server via reduxProvider.jsx

    return {
        portfolioData,
        loading,
        error,
    };
}
