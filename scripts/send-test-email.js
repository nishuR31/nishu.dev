#!/usr/bin/env node
import "dotenv/config";
import nodemailer from "nodemailer";

const user = process.env.MAIL_USER;
const pass = process.env.MAIL_APP_PASSWORD;

if (!user || !pass) {
  console.error("[Test] Missing MAIL_USER or MAIL_APP_PASSWORD in environment");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, pass },
});

export default async function run() {
  console.log(`[Test] starting send at ${new Date().toLocaleString()}`);
  const start = Date.now();

  try {
    const info = await transporter.sendMail({
      from: user,
      to: process.env.MAIL_TO || user,
      subject: "Portfolio SMTP test",
      text: `This is a test email sent at ${new Date().toLocaleString()}`,
    });

    const duration = Date.now() - start;
    console.log("[Test] sendMail succeeded");
    console.log("[Test] messageId:", info.messageId || null);
    console.log("[Test] response:", info.response || JSON.stringify(info));
    console.log("[Test] durationMs:", duration);
    process.exit(0);
  } catch (err) {
    const duration = Date.now() - start;
    console.error("[Test] sendMail failed after ms:", duration);
    console.error("[Test] error:", err && err.stack ? err.stack : err);
    // provide helpful hints for common Gmail issues
    if (err && err.code === "EAUTH") {
      console.error(
        "[Test] Authentication failed: check MAIL_USER / MAIL_APP_PASSWORD",
      );
    }
    if (err && err.code === "ECONNECTION") {
      console.error(
        "[Test] Connection failed: check network/firewall or SMTP provider",
      );
    }
    process.exit(1);
  }
}
