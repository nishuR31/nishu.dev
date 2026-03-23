import "dotenv/config";
import { Worker } from "bullmq";
import { CONTACT_MAIL_QUEUE_NAME } from "../lib/mail-queue.js";
import { getRedisConnection, createRedisConnection } from "../lib/redis.js";
import {
  _sendContactEmailLogged as sendContactEmail,
  sendAutoResponderEmail,
} from "../lib/mailer.js";

const redis = getRedisConnection();
const HEARTBEAT_KEY =
  process.env.MAIL_WORKER_HEARTBEAT_KEY || "system:mail-worker:heartbeat";
const HEARTBEAT_INTERVAL_MS = 10000;
const HEARTBEAT_TTL_SECONDS = 30;

let heartbeatInterval;

async function publishHeartbeat() {
  try {
    if (redis.status === "wait") {
      await redis.connect();
    }

    await redis.set(
      HEARTBEAT_KEY,
      JSON.stringify({
        pid: process.pid,
        at: Date.now(),
      }),
      "EX",
      HEARTBEAT_TTL_SECONDS,
    );
  } catch (error) {
    console.error("[Mail Worker] heartbeat publish failed:", error.message);
  }
}

const worker = new Worker(
  CONTACT_MAIL_QUEUE_NAME,
  async (job) => {
    console.log(`Worker got Job:${JSON.stringify(job)}`);
    if (job.name !== "contact-message") {
      return;
    }

    await sendContactEmail(job.data);
    await sendAutoResponderEmail(job.data);
    console.log(
      `[Mail Worker] Sent contact mail and auto-reply for job ${job.id}`,
    );
  },
  {
    connection: createRedisConnection(),
    concurrency: 2,
  },
);

worker.on("ready", () => {
  console.log("[Mail Worker] ready and listening...");
  publishHeartbeat();
  heartbeatInterval = setInterval(publishHeartbeat, HEARTBEAT_INTERVAL_MS);
});

worker.on("failed", (job, error) => {
  console.error(`[Mail Worker] job ${job?.id} failed:`, error.message);
});

worker.on("error", (error) => {
  console.error("[Mail Worker] worker error:", error.message);
});

const shutdown = async () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }

  try {
    await redis.del(HEARTBEAT_KEY);
  } catch (error) {
    console.error("[Mail Worker] heartbeat cleanup failed:", error.message);
  }

  await worker.close();
  console.log("[Mail Worker] stopped");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
