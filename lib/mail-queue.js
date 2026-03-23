import { Queue } from "bullmq";
import { createRedisConnection } from "./redis.js";

export const CONTACT_MAIL_QUEUE_NAME = "contact-mail";

let contactMailQueue;

export function getContactMailQueue() {
  if (!contactMailQueue) {
    contactMailQueue = new Queue(CONTACT_MAIL_QUEUE_NAME, {
      connection: createRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1500,
        },
        removeOnComplete: true,
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
    submittedAt: new Date().toISOString(),
  });

  return job;
}
