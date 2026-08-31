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

const api = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND || "https://nishu-dev-api.onrender.com";

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

let isFetchingPortfolio = false;

export function usePortfolio() {
    const dispatch = useDispatch<AppDispatch>();
    const portfolioData = useSelector(portfolio);
    const loading = useSelector(portfolioLoading);
    const error = useSelector(portfolioError);

    useEffect(() => {
        // If on mount we are still loading, it means server hydration failed/timed out.
        // We must fetch on the client to avoid being stuck on blank UI skeletons.
        if (loading && !isFetchingPortfolio) {
            isFetchingPortfolio = true;
            const fetchData = async () => {
                dispatch(fetchStart());
                try {
                    const res = await fetch(`${api}/portfolio`);
                    if (res.ok) {
                        const json = await res.json();
                        const data = json.data ?? json;
                        if (data && data.developer && data.developer.name) {
                            dispatch(fetchSuccess(data));
                        } else {
                            dispatch(fetchFailure("Invalid portfolio data received"));
                        }
                    } else {
                        dispatch(fetchFailure("Failed to load portfolio data"));
                    }
                } catch (err) {
                    dispatch(fetchFailure("Network error"));
                } finally {
                    isFetchingPortfolio = false;
                }
            };
            fetchData();
        }
    }, [dispatch, loading]);

    return {
        portfolioData,
        loading,
        error,
    };
}
