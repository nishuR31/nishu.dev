"use client";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import portfolioSlice, { DEFAULT_PORTFOLIO } from "@/slices/portfolioSlice";
import themeSlice from "@/slices/themeSlice";
import { useRef } from "react";

// Build a pre-seeded store from the server-side initialData.
// This runs on the CLIENT during hydration — the store is initialised
// with the SSR data so that every useSelector sees real data on first render,
// eliminating the skeleton flash caused by loading=true in the default state.
function makeStore(initialData) {
  const preloadedState = initialData && Object.keys(initialData).length > 0
    ? {
        portfolioSlice: {
          data: { ...DEFAULT_PORTFOLIO, ...initialData },
          loading: false,
          error: null,
        },
      }
    : undefined; // use slice default (loading: true) — client fetch will hydrate

  return configureStore({
    reducer: { portfolioSlice, themeSlice },
    preloadedState,
  });
}

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://nishu-dev-api.onrender.com";

export default function Providers({ children, initialData }) {
  // Create the store exactly once per page load, seeded with SSR data
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore(initialData);
  }

  const store = storeRef.current;

  return <Provider store={store}>{children}</Provider>;
}