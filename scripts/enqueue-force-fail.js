import "dotenv/config";
import { enqueueContactMail } from "../lib/mail-queue.js";

export default async function run() {
  try {
    console.log("Enqueuing forced-fail job...");
    const job = await enqueueContactMail({
      name: "Test Fail",
      email: "fail@example.test",
      message: "This job should fail on purpose",
      forceFail: true,
    });
    console.log("Enqueued job id:", job.id);
    process.exit(0);
  } catch (e) {
    console.error(
      "Error enqueuing forced-fail job:",
      e && e.message ? e.message : e,
    );
    process.exit(2);
  }
}
