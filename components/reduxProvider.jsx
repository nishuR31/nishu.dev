"use client";

import { Provider } from "react-redux";
import { store } from "@/store/configStore";
import { fetchSuccess, fetchFailure, fetchStart } from "@/slices/portfolioSlice";
import { useEffect, useRef } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND ||
  "https://nishu-dev-api.onrender.com";

async function fetchWithRetry(url, maxAttempts = 3, timeoutMs = 20000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(tid);
      if (res.ok) {
        const json = await res.json();
        const data = json.data ?? json;
        if (data && typeof data === "object" && Object.keys(data).length > 0) {
          return data;
        }
      }
    } catch {
      clearTimeout(tid);
      if (attempt < maxAttempts) {
        // wait 2s between retries on client
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }
  return null;
}

export default function Providers({ children, initialData }) {
  const seeded = useRef(false);

  // Seed Redux immediately with SSR data (synchronous — before first paint)
  if (!seeded.current && initialData && typeof initialData === "object" && Object.keys(initialData).length > 0) {
    store.dispatch(fetchSuccess(initialData));
    seeded.current = true;
  }

  useEffect(() => {
    // Already seeded from SSR — no client fetch needed
    if (seeded.current) return;
    seeded.current = true;

    // SSR data was null (API cold start during build) — fetch on client with retry
    store.dispatch(fetchStart());

    fetchWithRetry(`${API_URL}/portfolio`).then((data) => {
      if (data) {
        store.dispatch(fetchSuccess(data));
      } else {
        store.dispatch(fetchFailure("Could not load portfolio data. Please refresh."));
      }
    });
  }, []);

  return <Provider store={store}>{children}</Provider>;
}