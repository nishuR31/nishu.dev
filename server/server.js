import { enqueueContactMail } from "../lib/mail-queue.js";
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { redisPing } from "../lib/redis.js";
console.log("BOOTING SERVER...");
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({ origin: [process.env.PUBLIC_FRONTEND, "http://localhost:3000"] }),
);

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is healthy",
    success: true,
    code: 200,
    env: process.env.NODE_ENV || "unknown",
  });
});
app.get("/config", (req, res) => {
  if (
    !process.env.REDIS_URL ??
    !process.env.NEXT_PUBLIC_PORT ??
    !process.env.PORT ??
    !process.env.MAIL_USE ??
    !process.env.MAIL_APP_PASSWORD ??
    !process.env.MAIL_TO
  ) {
    res.status(400).json({
      message: "Configs are misconfigured",
      success: !true,
      code: 400,
      env: process.env.NODE_ENV || "unknown",
    });
  }

  res.status(200).json({
    message: "Configs are configured",
    success: true,
    code: 200,
    env: process.env.NODE_ENV || "unknown",
  });
});

app.get("/redis", async (req, res) => {
  let response = await redisPing();
  res.status(200).json({
    message: response ?? "Redis might be down",
    code: 200,
    success: true,
    env: process.env.NODE_ENV || "unknown",
  });
});

app.post("/sendmail", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "name, email and message are required" });
  }

  try {
    enqueueContactMail({ name, email, message });
    return res
      .status(202)
      .json({ enqueued: true, createdAt: new Date().toISOString() });
  } catch (err) {
    console.error("[Express] contact enqueue failed:", err?.message || err);
    return res.status(500).json({ error: err?.message || "enqueue-failed" });
  }
});

app.get("/", (req, res) =>
  res.status(200).json({ message: "Server firedup", success: true, code: 200 }),
);

app.get("/ping", (req, res) => res.send("pong"));

app.get("/test", async (req, res) => {
  // enqueue a sample contact job

  enqueueContactMail({
    name: "Test",
    email: "testmail@gmail.com",
    message: "Testing the mailing service",
  });

  return res
    .status(202)
    .json({ enqueued: true, createdAt: new Date().toISOString() });
});

const PORT = process.env.PORT || 4001;
import "../worker/file-worker.js";
app.listen(PORT, () => console.log(`[Express] listening on port ${PORT}`));
