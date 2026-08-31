export async function getPortfolioData() {
  const api =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND ||
    "https://nishu-dev-api.onrender.com";

  // Try up to 3 times to allow Render free instances to spin up (cold start is 30-50s)
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const controller = new AbortController();
      // Increase timeout to 30 seconds per attempt
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(`${api}/portfolio`, {
        signal: controller.signal,
        next: {
          revalidate: 3600,
          tags: ["portfolio"],
        },
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const data = json.data ?? json;
        // Validate that it's an actual portfolio payload by checking for developer.name
        if (data && data.developer && data.developer.name) {
          return data;
        }
      }
    } catch (error) {
      console.warn(`API fetch attempt ${attempt} failed (likely cold start):`, error);
      // If it failed and we have attempts left, wait 3 seconds before retrying
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  // If all attempts fail, return null to trigger graceful client-side hydration
  return null;
}
