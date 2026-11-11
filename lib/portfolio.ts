import { cache } from "react";

export type PortfolioResult = { ok: true; data: any } | { ok: false; error: string; data: any };

export const PORTFOLIO_REVALIDATE_SECONDS = 120; // 2 minutes (60-300s target)
const FETCH_TIMEOUT_MS = 3500; // 3.5s timeout prevents 30s delays on sleeping Render instances

export const getPortfolioData = cache(async (): Promise<PortfolioResult> => {
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

    return { ok: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown portfolio API error";
    console.warn("Portfolio API request failed, falling back to local snapshot:", message);

    try {
      const fallback = await import("./fallback-portfolio.json");
      const data = fallback.default?.data ?? fallback.default;
      return { ok: true, data };
    } catch {
      throw new Error(`Portfolio data unavailable: ${message}`);
    }
  } finally {
    clearTimeout(timeoutId);
  }
});
