import { enqueueContactMail } from "./lib/mail-queue.js";

async function run() {
  console.log("Enqueuing test mail...");
  const job = await enqueueContactMail({
    name: "Nishant Tester",
    email: "nishant@example.com",
    message: "This is a test message from the verification step.",
  });
  console.log("Enqueued job:", job.id);
  process.exit(0);
}

run().catch(console.error);
