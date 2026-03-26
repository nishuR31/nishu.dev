import { _sendContactEmailLogged } from "../lib/mailer.js";
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
  let now = Date.now();
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "name, email and message are required" });
  }

  try {
    const result = await _sendContactEmailLogged({
      name,
      email,
      message,
      submittedAt: new Date().toLocaleString(),
    });
    return res.status(202).json({
      sent: true,
      provider: "nodemailer",
      time: `${(Date.now() - now) / 1000} s`,
      info:
        process.env.NODE_ENV === "production" ?
          undefined
        : result && (result.messageId || result.response),
    });
  } catch (err) {
    console.error(
      "[Express] contact send failed:",
      err && err.message ? err.message : err,
    );
    return res.status(500).json({
      error:
        process.env.NODE_ENV === "production" ? "Something went wrong"
        : err && err.message ? err.message
        : String(err),
    });
  }
});

app.get("/", (req, res) =>
  res.status(200).json({ message: "Server firedup", success: true, code: 200 }),
);

app.get("/ping", (req, res) => res.send("pong"));

app.get("/test", async (req, res) => {
  let now = Date.now();

  try {
    console.log("Before sending mail");
    const result = await _sendContactEmailLogged({
      name: "Test",
      email: process.env.MAIL_TO || process.env.MAIL_USER,
      message: "Testing the mailing service",
      submittedAt: new Date().toLocaleString(),
    });
    console.log("After sending mail");

    return res.status(200).json({
      sent: true,
      time: `${(Date.now() - now) / 1000} s`,

      info:
        process.env.NODE_ENV === "production" ?
          undefined
        : result && (result.messageId || result.response),
    });
  } catch (err) {
    console.error(
      "[Server] /test send failed:",
      err && err.message ? err.message : err,
    );
    return res
      .status(500)
      .json({ error: err && err.message ? err.message : String(err) });
  }
});

// Queue-related endpoints removed to keep mailing synchronous via Nodemailer

app.all("/*spalt", (req, res) => {
  res.status(400).json({
    message: "Route not available",
    route: req.hostname + req.originalUrl,
  });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`[Express] listening on port ${PORT} `));
