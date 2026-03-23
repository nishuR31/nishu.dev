import "dotenv/config";
import { Worker } from "bullmq";
import {
  _sendContactEmailLogged,
  _sendAutoResponderLogged,
} from "../lib/mailer.js";
import { CONTACT_MAIL_QUEUE_NAME } from "../lib/mail-queue.js";
import { getRedisConnection } from "../lib/redis.js";
import { logFailedMail } from "../lib/failed-mail-logger.js";

const connection = getRedisConnection();

const worker = new Worker(
  CONTACT_MAIL_QUEUE_NAME,
  async (job) => {
    const { name, email, message } = job.data || {};

    try {
      const autoRes = await _sendAutoResponderLogged({ name, email });
      console.log(
        "[Worker] auto-responder result:",
        autoRes && (autoRes.response || autoRes.messageId) ?
          autoRes.response || autoRes.messageId
        : JSON.stringify(autoRes),
      );

      const contactRes = await _sendContactEmailLogged({
        name,
        email,
        message,
      });
      console.log(
        "[Worker] contact-mail result:",
        contactRes && (contactRes.response || contactRes.messageId) ?
          contactRes.response || contactRes.messageId
        : JSON.stringify(contactRes),
      );
    } catch (err) {
      throw err; // allow BullMQ to mark job failed
    }
  },
  { connection },
);

worker.on("ready", () => {
  console.log("Worker ready and listening...");
});

worker.on("active", (job) => {
  console.log({
    msg: "Processing job:",
    job: { id: job.id, email: job.data?.email },
  });
});

worker.on("completed", (job) => {
  console.log({
    msg: "Job completed:",
    job: { id: job.id, email: job.data?.email },
  });
});

worker.on("failed", (job, err) => {
  console.error("Job failed:", job?.id, err && err.message ? err.message : err);
  try {
    if (job && job.data) {
      logFailedMail(job.data, err).catch((e) =>
        console.error(
          "[FailedMailLogger] error:",
          e && e.message ? e.message : e,
        ),
      );
    }
  } catch (e) {
    console.error(
      "[FailedMailLogger] unexpected error:",
      e && e.message ? e.message : e,
    );
  }
});

worker.on("error", (err) => {
  console.error("Worker error:", err && err.message ? err.message : err);
});

worker.on("stalled", (jobId) => {
  console.warn("Job stalled:", jobId);
});

export default worker;
