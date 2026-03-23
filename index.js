import next from "next";
import { createServer } from "http";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// start worker

// spawn the worker in a separate Node process so Next and the worker
// run independently (avoids deployment platforms treating them as one)
const workerScript = fileURLToPath(
  new URL("./worker/mail-worker.js", import.meta.url),
);
console.log(workerScript);
const worker = spawn(process.execPath, [workerScript], {
  stdio: "inherit",
  env: process.env,
});

worker.on("exit", (code, signal) => {
  console.log(`[Mail Worker] exited with code=${code} signal=${signal}`);
});

const shutdownWorker = (signal) => {
  if (!worker.killed) {
    try {
      worker.kill(signal || "SIGTERM");
    } catch (e) {
      /* ignore */
    }
  }
};

process.on("SIGINT", () => shutdownWorker("SIGINT"));
process.on("SIGTERM", () => shutdownWorker("SIGTERM"));

const PORT = process.env.PORT || 3000; // 👈 THIS is the fix

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(PORT, () => {
    console.log(`Server + Worker running on port ${PORT}`);
  });
});
