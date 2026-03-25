import "dotenv/config";
import { Worker } from "bullmq";
import {
  _sendContactEmailLogged,
  _sendAutoResponderLogged,
} from "../lib/mailer.js";
import {
  CONTACT_MAIL_QUEUE_NAME,
  FAIL_RETRY_QUEUE_NAME,
  getFailRetryQueue,
} from "../lib/mail-queue.js";
import { getRedisConnection1, getRedisConnection2 } from "../lib/redis.js";
import { logFailedMail } from "../lib/failed-mail-logger.js";

const connection = getRedisConnection1();
const connectionRetry = getRedisConnection2();

const worker = new Worker(
  CONTACT_MAIL_QUEUE_NAME,
  async (job) => {
    const { name, email, message, forceFail } = job.data || {};

    // Support a test flag to force a job failure for diagnostics.
    if (forceFail) {
      console.log(`[Worker] forced-fail flag detected for job ${job.id}`);
      throw new Error("forced failure (test)");
    }

    const nodeEnv = process.env.NODE_ENV || "development";

    try {
      const start = Date.now();

      const autoRes = await _sendAutoResponderLogged({ name, email });
      const autoDuration = Date.now() - start;

      // Log durations in dev for debugging; in prod only log if unusually slow
      if (nodeEnv !== "production") {
        console.log(
          "[Worker] auto-responder result:",
          autoRes && (autoRes.response || autoRes.messageId) ?
            autoRes.response || autoRes.messageId
          : JSON.stringify(autoRes),
          "durationMs:",
          autoDuration,
        );
      } else if (autoDuration > 10000) {
        console.warn("[Worker] auto-responder slow durationMs:", autoDuration);
      }

      const startContact = Date.now();
      const contactRes = await _sendContactEmailLogged({
        name,
        email,
        message,
      });
      const contactDuration = Date.now() - startContact;

      if (nodeEnv !== "production") {
        console.log(
          "[Worker] contact-mail result:",
          contactRes && (contactRes.response || contactRes.messageId) ?
            contactRes.response || contactRes.messageId
          : JSON.stringify(contactRes),
          "durationMs:",
          contactDuration,
        );
      } else if (contactDuration > 10000) {
        console.warn("[Worker] contact-mail slow durationMs:", contactDuration);
      }
    } catch (err) {
      // allow BullMQ to mark job failed, but avoid noisy file writes in prod
      throw err;
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
  const nodeEnv = process.env.NODE_ENV || "development";
  console.error("Job failed:", job?.id, err && err.message ? err.message : err);
  try {
    if (job && job.data) {
      // In production avoid writing files; log concise details instead (handled by logger)
      if (nodeEnv === "production") {
        // failed-mail-logger will short-circuit file writes in prod; call it so prod logs go through a single place
        logFailedMail(job.data, err).catch(() => {});
      } else {
        // In dev keep the file-based record and print verbose errors
        logFailedMail(job.data, err).catch((e) =>
          console.error(
            "[FailedMailLogger] error:",
            e && e.message ? e.message : e,
          ),
        );
      }
    }
  } catch (e) {
    console.error(
      "[FailedMailLogger] unexpected error:",
      e && e.message ? e.message : e,
    );
  }
  // if the job exhausted retries (or reached threshold), forward to fail-retry queue
  try {
    const attempts = job?.attemptsMade || 0;
    const FORWARD_THRESHOLD = 3;
    if (attempts >= FORWARD_THRESHOLD) {
      // create a new job on the fail-retry queue carrying original data + metadata
      const payload = {
        ...job.data,
        originalJobId: job.id,
        failedReason: err && err.message ? err.message : String(err),
        forwardedAt: new Date().toLocaleString(),
      };
      // fire-and-forget the enqueue to avoid blocking the failed handler
      (async () => {
        try {
          const fq = getFailRetryQueue();
          const newJob = await fq.add(FAIL_RETRY_QUEUE_NAME, payload, {
            attempts: 5,
            removeOnComplete: true,
            removeOnFail: true,
          });
          console.log(
            `[Worker] forwarded failed job ${job.id} to fail-retry queue as ${newJob.id}`,
          );
        } catch (e) {
          console.error(
            "[Worker] error forwarding to fail-retry queue:",
            e && e.message ? e.message : e,
          );
        }
      })();
    }
  } catch (e) {
    console.error(
      "[Worker] fail-retry forward check error:",
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
