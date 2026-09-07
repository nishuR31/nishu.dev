import { cache } from 'react';

export type PortfolioResult =
  | { ok: true; data: any }
  | { ok: false; error: string };

export const getPortfolioData = cache(async (): Promise<PortfolioResult> => {
  const configuredApi = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const apiCandidates = [
    configuredApi,
    "https://nishu-dev-api.onrender.com",
  ].filter((api, index, candidates): api is string => Boolean(api) && candidates.indexOf(api) === index);

  for (const api of apiCandidates) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // Allow 12s total

      const res = await fetch(`${api}/api/portfolio`, {
        signal: controller.signal,
        next: {
          tags: ["portfolio-v3"],
          revalidate: 30,
        },
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Portfolio API returned ${res.status}`);
      }
      const json = await res.json();
      const data = json.data ?? json;
      if (data?.developer?.name) {
        return { ok: true, data };
      }
      throw new Error("Invalid portfolio data received from API");
    } catch (error) {
      console.warn(`API fetch failed for ${api}:`, error);
    }
  }

  return { ok: false, error: "Failed to fetch portfolio data after retries" };
});
