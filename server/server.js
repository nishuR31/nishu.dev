import { fireContactAndAutoMail } from "../lib/mailer.js";
import { fireContactAndAutoEmail } from "../lib/resend.js";
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
console.log("BOOTING SERVER...");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({ origin: [process.env.PUBLIC_FRONTEND, "http://localhost:3000"] }),
);

// ========================
// 🔥 CORE MAIL DISPATCHER
// ========================
function mail(data, provider) {
  if (provider === "nodemailer") {
    // fire-and-forget wrapper handles its own errors
    fireContactAndAutoMail(data);
    return;
  }

  if (provider === "resend") {
    // fire-and-forget wrapper handles its own errors
    fireContactAndAutoEmail(data);
    return;
  }

  throw new Error("Invalid provider");
}

// ========================
// HEALTH + CONFIG
// ========================
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is healthy",
    success: true,
    code: 200,
    env: process.env.NODE_ENV || "unknown",
  });
});

app.get("/config", (req, res) => {
  const required = [
    "PORT",
    "RESEND_API",
    "MAIL_USER",
    "MAIL_APP_PASSWORD",
    "MAIL_TO",
  ];

  const missing = required.filter((k) => !process.env[k]);
  const ok = missing.length === 0;

  return res.status(200).json({
    message: ok ? "Configs are configured" : "Configs are misconfigured",
    success: ok,
    code: 200,
    env: process.env.NODE_ENV || "unknown",
    systems: {
      mailConfig: { missing },
    },
  });
});

// ========================
// 📩 NODEMAILER (ASYNC FIRE)
// ========================
app.post("/sendmail", (req, res) => {
  const start = Date.now();

  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "name, email and message are required" });
  }

  try {
    mail(
      {
        name,
        email,
        message,
        submittedAt: new Date().toLocaleString(),
      },
      "nodemailer",
    );

    const duration = ((Date.now() - start) / 1000).toFixed(4);

    return res.status(202).json({
      sent: true,
      mode: "async-fire",
      provider: "nodemailer",
      time: `${duration}s`,
    });
  } catch (err) {
    console.error("[Express] sendmail failed:", err?.message || err);
    return res.status(500).json({
      error: err?.message || String(err),
    });
  }
});

// ========================
// 🚀 RESEND (ASYNC FIRE)
// ========================
app.post("/resend", (req, res) => {
  const start = Date.now();

  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "name, email and message are required" });
  }

  try {
    mail(
      {
        name,
        email,
        message,
        submittedAt: new Date().toLocaleString(),
      },
      "resend",
    );

    const duration = ((Date.now() - start) / 1000).toFixed(4);

    return res.status(202).json({
      sent: true,
      mode: "async-fire",
      provider: "resend",
      time: `${duration}s`,
      note: "Emails triggered, not awaited",
    });
  } catch (err) {
    console.error("[Express] resend failed:", err?.message || err);
    return res.status(500).json({
      error: err?.message || String(err),
    });
  }
});

// ========================
// 🧪 TEST ROUTE
// ========================
app.get("/test/:provider", (req, res) => {
  const start = Date.now();
  const { provider } = req.params;

  try {
    mail(
      {
        name: "Test",
        email: process.env.MAIL_TO || process.env.MAIL_USER,
        message: "Testing mail system",
        submittedAt: new Date().toLocaleString(),
      },
      provider,
    );

    const duration = ((Date.now() - start) / 1000).toFixed(4);

    return res.json({
      sent: true,
      provider,
      mode: "async-fire",
      time: `${duration}s`,
    });
  } catch (err) {
    console.error("[Server] test failed:", err?.message || err);
    return res.status(500).json({
      error: err?.message || String(err),
    });
  }
});

// ========================
// BASIC ROUTES
// ========================
app.get("/", (req, res) =>
  res.status(200).json({ message: "Server firedup", success: true, code: 200 }),
);

app.get("/ping", (req, res) => res.send("pong"));

// ========================
// FALLBACK
// ========================
app.all("/*spalt", (req, res) => {
  res.status(400).json({
    message: "Route not available",
    route: req.hostname + req.originalUrl,
  });
});

// ========================
// START
// ========================
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`[Express] listening on port ${PORT}`));
