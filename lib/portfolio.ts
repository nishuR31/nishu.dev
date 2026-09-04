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

  // Maximum 2 attempts (1 initial + 1 retry)
  for (const api of apiCandidates) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const controller = new AbortController();
        // 8 second timeout per attempt
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(`${api}/api/portfolio`, {
          signal: controller.signal,
          next: {
            revalidate: 0,
            tags: ["portfolio-v3"],
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
        console.warn(`API fetch attempt ${attempt} failed for ${api}:`, error);
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }
  }

  return { ok: false, error: "Failed to fetch portfolio data after retries" };
});
