import "dotenv/config";
import { Worker } from "bullmq";
import { sendContactEmail, sendAutoResponderEmail } from "../lib/mailer.js";
import { CONTACT_MAIL_QUEUE_NAME } from "../lib/mail-queue.js";
import { getRedisConnection } from "../lib/redis.js";

let connection = getRedisConnection();

const worker = new Worker(
  CONTACT_MAIL_QUEUE_NAME,
  async (job) => {
    const { name, email, message } = job.data;

    try {
      await sendAutoResponderEmail({ name, email });
      await sendContactEmail({ name, email, message });
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
    job: { id: job.id, email: job.data.email },
  });
});

worker.on("completed", (job) => {
  console.log({
    msg: "Processing job:",
    job: { id: job.id, email: job.data.email },
  });
});

worker.on("failed", (job, err) => {
  console.error("Job failed:", job?.id, err);
});

worker.on("error", (err) => {
  console.error("Worker error:", err);
});

worker.on("stalled", (jobId) => {
  console.warn("Job stalled:", jobId);
});

export default worker;
