import { cache } from 'react';

export type PortfolioResult =
  | { ok: true; data: any }
  | { ok: false; error: string };

export const getPortfolioData = cache(async (): Promise<PortfolioResult> => {
  const api =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://nishu-dev-api.onrender.com";

  // Maximum 2 attempts (1 initial + 1 retry)
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const controller = new AbortController();
      // 8 second timeout per attempt
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`${api}/api/portfolio`, {
        signal: controller.signal,
        next: {
          revalidate: 3600,
          tags: ["portfolio-v2"], // Changed tag to bust Vercel's persistent cache
        },
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const data = json.data ?? json;
        if (data && data.developer && data.developer.name) {
          return { ok: true, data };
        }
        return { ok: false, error: "Invalid portfolio data received from API" };
      }
    } catch (error) {
      console.warn(`API fetch attempt ${attempt} failed:`, error);
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  return { ok: false, error: "Failed to fetch portfolio data after retries" };
});
