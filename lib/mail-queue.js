import { Queue } from "bullmq";
import { createRedisConnection } from "./redis.js";

export const CONTACT_MAIL_QUEUE_NAME = "contact-mail";

let contactMailQueue;

export function getContactMailQueue() {
  if (!contactMailQueue) {
    contactMailQueue = new Queue(CONTACT_MAIL_QUEUE_NAME, {
      connection: createRedisConnection(),
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: "fixed",
          delay: 1000,
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
