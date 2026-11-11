import fs from "fs";
import path from "path";

export async function GET() {
  const robotsPath = path.join(process.cwd(), "public/robots.txt");
  const content = fs.readFileSync(robotsPath, "utf-8");

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400",
    },
  });
}
