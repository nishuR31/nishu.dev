import { Queue } from "bullmq";
import { createRedisConnection1, createRedisConnection2 } from "./redis.js";

export const CONTACT_MAIL_QUEUE_NAME = "contact-mail";

export const FAIL_RETRY_QUEUE_NAME = "contact-mail-fail-retry";

let contactMailQueue;
let failRetryQueue;

export function getContactMailQueue() {
  if (!contactMailQueue) {
    contactMailQueue = new Queue(CONTACT_MAIL_QUEUE_NAME, {
      connection: createRedisConnection1(),
      defaultJobOptions: {
        attempts: 1,
        backoff: {
          type: "fixed",
          delay: 500,
        },
        removeOnComplete: true,
        // automatically remove failed jobs so they don't accumulate
        // Note: keep this small or use a numeric limit if you want to retain failures for debugging
        removeOnFail: true,
      },
    });
  }
  return contactMailQueue;
}

export function getFailRetryQueue() {
  if (!failRetryQueue) {
    failRetryQueue = new Queue(FAIL_RETRY_QUEUE_NAME, {
      connection: createRedisConnection2(),
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: "fixed",
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: true,
      },
    });
  }
  return failRetryQueue;
}

export async function enqueueContactMail({ name, email, message }) {
  const queue = getContactMailQueue();
  const job = await queue.add("contact-message", {
    name,
    email,
    message,
    submittedAt: new Date().toLocaleString(),
  });

  return job;
}
