import fs from "fs/promises";
import path from "path";

const LOG_DIR = path.resolve(process.cwd(), "queue", "logs");
const FAILED_FILE = path.join(LOG_DIR, "failed-mails.jsonl");

export async function logFailedMail(payload, err) {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    const entry = {
      ts: new Date().toISOString(),
      payload,
      error: (err && err.message) || String(err),
    };
    await fs.appendFile(FAILED_FILE, JSON.stringify(entry) + "\n", "utf8");
    console.log("[FailedMailLogger] wrote failed mail payload to", FAILED_FILE);
  } catch (writeErr) {
    console.error(
      "[FailedMailLogger] failed to write file:",
      writeErr && writeErr.message ? writeErr.message : writeErr,
    );
  }
}

export default { logFailedMail };
