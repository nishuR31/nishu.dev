import { NextResponse } from "next/server";
import { enqueueContactMail } from "@/lib/mail-queue";

export const runtime = "nodejs";

function isValidEmail(email) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    const email = body?.email?.trim();
    const message = body?.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (message.length > 4000) {
      return NextResponse.json(
        { error: "Message is too long" },
        { status: 400 },
      );
    }

    const job = await enqueueContactMail({ name, email, message });

    return NextResponse.json({ queued: true, jobId: job.id }, { status: 200 });
  } catch (error) {
    console.error("[Contact API] enqueue failed:", error);
    return NextResponse.json(
      { error: "Unable to process request right now" },
      { status: 500 },
    );
  }
}
