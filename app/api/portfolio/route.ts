import { NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://nishu-dev-api.onrender.com";

export async function GET() {
  try {
    const response = await fetch(`${backendUrl.replace(/\/$/, "")}/api/portfolio`, {
      next: { revalidate: 0, tags: ["portfolio-v3"] },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Portfolio API unavailable" },
        { status: response.status },
      );
    }

    return NextResponse.json(await response.json(), {
      headers: { "Cache-Control": "s-maxage=1, stale-while-revalidate=59" },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Portfolio API unavailable" },
      { status: 502 },
    );
  }
}
