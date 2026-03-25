import { enqueueContactMail, getContactMailQueue } from "../lib/mail-queue.js";
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
    let enqueue = await enqueueContactMail({ name, email, message });
    return res.status(202).json({
      message: enqueue,
      enqueued: true,
      createdAt: new Date().toLocaleString(),
    });
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
    .json({ enqueued: true, createdAt: new Date().toLocaleString() });
});

// Return current job counts and sample job data for debugging queue processing
app.get("/jobs", async (req, res) => {
  try {
    const queue = getContactMailQueue();
    const counts = await queue.getJobCounts();

    // helper to serialise jobs into JSON-safe objects
    async function sampleJobs(statuses, limit = 20) {
      try {
        const jobs = await queue.getJobs(statuses, 0, limit - 1);
        return jobs.map((j) => ({
          id: j.id,
          name: j.name,
          data: j.data,
          attemptsMade: j.attemptsMade,
          opts: j.opts,
          timestamp: j.timestamp,
          processedOn: j.processedOn || null,
          finishedOn: j.finishedOn || null,
        }));
      } catch (e) {
        return { error: (e && e.message) || String(e) };
      }
    }

    const waiting = await sampleJobs(["waiting", "paused"], 20);
    const active = await sampleJobs(["active"], 20);
    const delayed = await sampleJobs(["delayed"], 20);
    const failed = await sampleJobs(["failed"], 20);

    res.status(200).json({
      success: true,
      counts,
      samples: { waiting, active, delayed, failed },
      env: process.env.NODE_ENV || "unknown",
    });
  } catch (err) {
    console.error(
      "[Server] /jobs error:",
      err && err.message ? err.message : err,
    );
    res
      .status(500)
      .json({ error: err && err.message ? err.message : String(err) });
  }
});

// Clear failed jobs (up to a reasonable limit) to free queue space
// Use GET so callers can trigger without a request body
app.get("/jobs/clear-failed", async (req, res) => {
  try {
    const queue = getContactMailQueue();
    const failedJobs = await queue.getJobs(["failed"], 0, 99);
    let removed = 0;
    const removedIds = [];

    for (const j of failedJobs) {
      try {
        // ensure we have a Job instance to call remove()
        const job = await queue.getJob(j.id || j.jobId || j);
        if (job && typeof job.remove === "function") {
          await job.remove();
          removed++;
          removedIds.push(String(j.id || j.jobId || j));
        }
      } catch (e) {
        console.error(
          "[Server] failed to remove job:",
          j.id || j.jobId || j,
          e && e.message ? e.message : e,
        );
      }
    }

    res.status(200).json({ success: true, removed, removedIds });
  } catch (err) {
    console.error(
      "[Server] /jobs/clear-failed error:",
      err && err.message ? err.message : err,
    );
    res
      .status(500)
      .json({ error: err && err.message ? err.message : String(err) });
  }
});

const PORT = process.env.PORT || 4001;
import "../worker/file-worker.js";
app.listen(PORT, () => console.log(`[Express] listening on port ${PORT}`));
