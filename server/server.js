import {
  enqueueContactMail,
  getContactMailQueue,
  getFailRetryQueue,
} from "../lib/mail-queue.js";
import { renderContactHtml, getLogoPath } from "../lib/mailer.js";
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { redisPing1, redisPing2, redisPing } from "../lib/redis.js";
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
  // Check required env vars and report which are missing so the UI can display details
  const required = [
    "REDIS_URL1",
    "REDIS_URL2",
    "PORT",
    "MAIL_USER",
    "MAIL_APP_PASSWORD",
    "MAIL_TO",
  ];

  const missing = required.filter((k) => !process.env[k]);

  const ok = missing.length === 0;

  return res.status(200).json({
    message: ok ? "Configs are configured" : "Configs are misconfigured",
    success: ok,
    code: ok ? 200 : 200,
    env: process.env.NODE_ENV || "unknown",
    systems: {
      mailConfig: {
        missing,
      },
    },
  });
});

app.get("/redis1", async (req, res) => {
  let response = await redisPing1();
  res.status(200).json({
    message: response ? "Redis1 server up" : "Redis1 server might be down",
    code: response ? 200 : 400,
    success: response ? true : false,
    env: process.env.NODE_ENV || "unknown",
  });
});
app.get("/redis2", async (req, res) => {
  let response = await redisPing2();
  res.status(200).json({
    message: response ? "Redis2 server up" : "Redis2 server might be down",
    code: response ? 200 : 400,
    success: response ? true : false,
    env: process.env.NODE_ENV || "unknown",
  });
});
app.get("/redis", async (req, res) => {
  let response = await redisPing();
  res.status(200).json({
    message: response ? "Redis servers up" : "Redis servers might be down",
    code: response ? 200 : 400,
    success: response ? true : false,
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

// POST /postemail - send immediately via SendGrid (mirrors /sendmail but calls SendGrid)
app.post("/postemail", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "name, email and message are required" });
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const SENDGRID_FROM = process.env.SENDGRID_FROM;
  const MAIL_TO = process.env.MAIL_TO;

  if (!SENDGRID_API_KEY || !SENDGRID_FROM || !MAIL_TO) {
    const missing = [
      !SENDGRID_API_KEY && "SENDGRID_API_KEY",
      !SENDGRID_FROM && "SENDGRID_FROM",
      !MAIL_TO && "MAIL_TO",
    ].filter(Boolean);
    console.error("[Express] /postemail missing env:", missing);
    if (process.env.NODE_ENV === "production") {
      return res.status(500).json({ error: "Something went wrong" });
    }
    return res
      .status(500)
      .json({ error: `Missing env: ${missing.join(", ")}` });
  }

  try {
    // build HTML using the same template as nodemailer
    const html = renderContactHtml({ name, email, message });

    // include inline logo (base64) if available
    const attachments = [];
    try {
      const logoPath = getLogoPath();
      const fs = await import("fs/promises");
      const buf = await fs.readFile(logoPath);
      const b64 = buf.toString("base64");
      attachments.push({
        content: b64,
        filename: "logo.png",
        type: "image/png",
        disposition: "inline",
        content_id: "app-logo",
      });
    } catch (e) {
      // non-fatal; continue without inline image
      console.warn(
        "[Express] /postemail could not read logo for inline attachment:",
        e && e.message ? e.message : e,
      );
    }

    const payload = {
      personalizations: [
        {
          to: [{ email: MAIL_TO }],
          subject: `Website contact from ${name}`,
        },
      ],
      from: { email: SENDGRID_FROM },
      content: [
        {
          type: "text/html",
          value: html,
        },
      ],
      attachments,
    };

    const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (resp.status === 202) {
      return res.status(202).json({ sent: true, provider: "sendgrid" });
    }

    const text = await resp.text();
    console.error("[Express] /postemail sendgrid error:", resp.status, text);
    if (process.env.NODE_ENV === "production") {
      return res.status(500).json({ error: "Something went wrong" });
    }
    return res
      .status(500)
      .json({ error: `sendgrid-failed: ${resp.status} ${text}` });
  } catch (err) {
    console.error(
      "[Express] /postemail exception:",
      err && err.message ? err.message : err,
    );
    if (process.env.NODE_ENV === "production") {
      return res.status(500).json({ error: "Something went wrong" });
    }
    return res
      .status(500)
      .json({ error: err && err.message ? err.message : String(err) });
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
app.get("/jobs2", async (req, res) => {
  try {
    const queue = getFailRetryQueue();
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
      "[Server] /jobs2 error:",
      err && err.message ? err.message : err,
    );
    res
      .status(500)
      .json({ error: err && err.message ? err.message : String(err) });
  }
});

// Return current job counts and sample job data for debugging queue processing
app.get("/jobs1", async (req, res) => {
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
      "[Server] /jobs2 error:",
      err && err.message ? err.message : err,
    );
    res
      .status(500)
      .json({ error: err && err.message ? err.message : String(err) });
  }
});

// Clear failed jobs (up to a reasonable limit) to free queue space
// Use GET so callers can trigger without a request body
app.get("/jobs/:i/clear-failed", async (req, res) => {
  try {
    let { i } = req.params;

    const queue = i == +1 ? getContactMailQueue() : getFailRetryQueue();
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
      `[Server] /jobs/${i}/clear-failed error:`,
      err && err.message ? err.message : err,
    );
    res
      .status(500)
      .json({ error: err && err.message ? err.message : String(err) });
  }
});

app.all("/*spalt", (req, res) => {
  res.status(400).json({
    message: "Route not available",
    route: req.hostname + req.originalUrl,
  });
});

const PORT = process.env.PORT || 4001;
import "../worker/file-worker.js";
app.listen(PORT, () => console.log(`[Express] listening on port ${PORT} `));
