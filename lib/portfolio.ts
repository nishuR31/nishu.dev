import { cache } from "react";
import fallback from "./portfolio-fallback";

export type PortfolioResult = { ok: true; data: any } | { ok: false; error: string; data: any };

export const PORTFOLIO_REVALIDATE_SECONDS = 120; // 2 minutes (60-300s target)
const FETCH_TIMEOUT_MS = 3500; // 3.5s timeout prevents 30s delays on sleeping Render instances

let memoryCachedData: any = null;

export const getPortfolioData = cache(async (): Promise<PortfolioResult> => {
  if (Number(process.env.FALLBACK) === 1) {
    return { ok: true, data: fallback };
  }

  const api = (process.env.NEXT_PUBLIC_API_URL || "https://nishu-dev-api.onrender.com").replace(
    /\/$/,
    "",
  );

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`${api}/api/portfolio`, {
      signal: controller.signal,
      next: {
        tags: ["portfolio"],
        revalidate: PORTFOLIO_REVALIDATE_SECONDS,
      },
    });

    if (!res.ok) {
      throw new Error(`Portfolio API returned status ${res.status}`);
    }

    const json = await res.json();
    const data = json.data ?? json;

    if (!data?.developer?.name) {
      throw new Error("Invalid portfolio response structure");
    }

    memoryCachedData = data;
    return { ok: true, data };
  } catch {
    // If backend is sleeping (Render cold start) or unavailable, immediately return cached or fallback data
    const resolvedData = memoryCachedData || fallback;
    return {
      ok: true,
      data: resolvedData,
    };
  } finally {
    clearTimeout(timeoutId);
  }
});

