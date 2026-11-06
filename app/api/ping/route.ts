import { NextResponse } from "next/server";

export async function GET() {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL || "https://nishu-dev-api.onrender.com";
    const res = await fetch(`${api}/ping`, {
      method: "GET",
      cache: "no-store",
    });

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false }, { status: 502 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Backend unreachable" }, { status: 502 });
  }
}
