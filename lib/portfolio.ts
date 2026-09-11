import { cache } from "react";
import fallback from "./portfolio-fallback";
import config from "./portfolio-fallback";

export type PortfolioResult = { ok: true; data: any } | { ok: false; error: string };

export const getPortfolioData = cache(async (): Promise<PortfolioResult> => {
  const api = (process.env.NEXT_PUBLIC_API_URL || "https://nishu-dev-api.onrender.com").replace(
    /\/$/,
    "",
  );
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(`${api}/api/portfolio`, {
      signal: controller.signal,
      next: { tags: ["portfolio"], revalidate: 0 },
    });
    if (!res.ok) throw new Error(`Portfolio API returned ${res.status}`);
    const json = await res.json();
    const data = Number(process.env.FALLBACK) === 1 ? config : (json.data ?? json);
    if (!data?.developer?.name) throw new Error("Invalid portfolio response");
    return { ok: true, data };
  } catch {
    return { ok: true, data: fallback };
  } finally {
    clearTimeout(timeout);
  }
});
