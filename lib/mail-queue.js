import { Queue } from "bullmq";
import { getRedisConnection } from "./redis.js";

export const CONTACT_MAIL_QUEUE_NAME = "contact-mail";

export const contactMailQueue = new Queue(CONTACT_MAIL_QUEUE_NAME, {
  connection: getRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1500,
    },
    removeOnComplete: true,
  },
});

export async function enqueueContactMail({ name, email, message }) {
  const job = await contactMailQueue.add("contact-message", {
    name,
    email,
    message,
    submittedAt: new Date().toISOString(),
  });

  return job;
}
