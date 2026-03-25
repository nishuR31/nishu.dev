#!/usr/bin/env node
import "dotenv/config";
import nodemailer from "nodemailer";

const user = process.env.MAIL_USER;
const pass = process.env.MAIL_APP_PASSWORD;

if (!user || !pass) {
  console.error("Missing MAIL_USER or MAIL_APP_PASSWORD in environment");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, pass },
});

export default async function run() {
  try {
    await transporter.verify();
    console.log("[Test] transporter verified");
  } catch (err) {
    console.error(
      "[Test] transporter verify failed:",
      err && err.message ? err.message : err,
    );
  }

  try {
    const info = await transporter.sendMail({
      from: user,
      to: process.env.MAIL_TO || user,
      subject: "Portfolio SMTP test",
      text: `This is a test email sent at ${new Date().toLocaleString()}`,
    });

    console.log(
      "[Test] sendMail response:",
      info && info.response ? info.response : JSON.stringify(info),
    );
  } catch (err) {
    console.error(
      "[Test] sendMail failed:",
      err && err.message ? err.message : err,
    );
    process.exit(1);
  }
}

run();
