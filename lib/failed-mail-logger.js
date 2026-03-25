// Lightweight failed-mail logger
// - Never write files to disk (developer requested no log files)
// - In production: log a concise, generic error message (no payloads)
// - In development: log detailed payload + error for debugging

export async function logFailedMail(payload, err) {
  try {
    const env = process.env.NODE_ENV || "development";

    if (env === "production") {
      console.error(
        "[FailedMailLogger] job failed (production): Something went wrong processing mail",
      );
      return;
    }

    // Development: print full payload and error for debugging
    console.error("[FailedMailLogger] failed mail payload:", payload);
    console.error(
      "[FailedMailLogger] error:",
      err && err.stack ? err.stack : err,
    );
  } catch (e) {
    // Never attempt to write files; just surface the exception to stderr
    console.error("[FailedMailLogger] unexpected logger error:", e);
  }
}

export default { logFailedMail };
