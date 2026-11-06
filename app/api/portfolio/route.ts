import { NextResponse } from "next/server";
import { getPortfolioData, PORTFOLIO_REVALIDATE_SECONDS } from "@/lib/portfolio";

export const revalidate = PORTFOLIO_REVALIDATE_SECONDS;

export async function GET() {
  try {
    const result = await getPortfolioData();
    return NextResponse.json(
      result.ok ? { success: true, data: result.data } : { success: false, data: result.data },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${PORTFOLIO_REVALIDATE_SECONDS}, stale-while-revalidate=300`,
        },
      },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Portfolio API unavailable" },
      { status: 502 },
    );
  }
}

