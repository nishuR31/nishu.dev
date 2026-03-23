import { enqueueContactMail } from "../lib/mail-queue.js";
import "dotenv/config";
import express from "express";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors([process.env.PUBLIC_FRONTEND, "http://localhost:4000"]));
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is healthy",
    success: true,
    code: 200,
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

const PORT = process.env.PORT || 4000;
import "../worker/file-worker.js";
app.listen(PORT, () => console.log(`[Express] listening on port ${PORT}`));
