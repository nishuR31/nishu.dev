export async function getPortfolioData() {
  try {
    const api =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND ||
      "https://nishu-dev-api.onrender.com";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${api}/portfolio`, {
      signal: controller.signal,
      next: {
        revalidate: 3600,
        tags: ["portfolio"],
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    return json.data ?? json;
  } catch (error) {
    console.warn("Failed to fetch portfolio data from API during server render", error);
    return null;
  }
}
