import { NextResponse } from "next/server";
import { getPortfolioData, PORTFOLIO_REVALIDATE_SECONDS } from "@/lib/portfolio";
import { withUsableImages } from "@/lib/project-images-server";

export const revalidate = PORTFOLIO_REVALIDATE_SECONDS;

export async function GET() {
  try {
    const result = await getPortfolioData();
    const data = result.ok
      ? {
          ...result.data,
          projects: Array.isArray(result.data?.projects)
            ? result.data.projects.map((p: any) => withUsableImages(p))
            : result.data?.projects,
        }
      : result.data;

    return NextResponse.json(
      { success: result.ok, data },
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

