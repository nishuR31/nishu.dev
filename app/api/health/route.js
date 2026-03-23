import { NextResponse } from "next/server";
import { getRedisConnection } from "@/lib/redis";
import { getContactMailQueue } from "@/lib/mail-queue";

export const runtime = "nodejs";

async function checkRedis() {
  try {
    const redis = getRedisConnection();
    if (redis.status === "wait") {
      await redis.connect();
    }
    const pong = await redis.ping();
    return {
      ok: pong === "PONG",
      status: redis.status,
      message: pong,
    };
  } catch (error) {
    return {
      ok: false,
      message: error.message,
    };
  }
}

async function checkQueue() {
  try {
    const contactMailQueue = getContactMailQueue();
    const counts = await contactMailQueue.getJobCounts(
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed",
    );

    let workerCount = null;
    if (typeof contactMailQueue.getWorkers === "function") {
      const workers = await contactMailQueue.getWorkers();
      workerCount = workers.length;
    }

    return {
      ok: true,
      counts,
      workerCount,
    };
  } catch (error) {
    return {
      ok: false,
      message: error.message,
    };
  }
}

function checkMailConfig() {
  const required = ["MAIL_USER", "MAIL_APP_PASSWORD", "MAIL_TO", "REDIS_URL"];
  const missing = required.filter((key) => !process.env[key]);

  return {
    ok: missing.length === 0,
    missing,
  };
}

async function checkWorkerHeartbeat() {
  const heartbeatKey =
    process.env.MAIL_WORKER_HEARTBEAT_KEY || "system:mail-worker:heartbeat";
  const staleThresholdMs = Number(process.env.MAIL_WORKER_STALE_MS || 30000);

  try {
    const redis = getRedisConnection();

    if (redis.status === "wait") {
      await redis.connect();
    }

    const raw = await redis.get(heartbeatKey);

    if (!raw) {
      return {
        ok: false,
        online: false,
        heartbeatKey,
        message: "No heartbeat found",
      };
    }

    const parsed = JSON.parse(raw);
    const lastSeenMs = Date.now() - Number(parsed.at || 0);
    const online =
      Number.isFinite(lastSeenMs) && lastSeenMs <= staleThresholdMs;

    return {
      ok: online,
      online,
      heartbeatKey,
      pid: parsed.pid,
      lastSeenMs,
      staleThresholdMs,
      lastSeenAt: new Date(Number(parsed.at || Date.now())).toISOString(),
    };
  } catch (error) {
    return {
      ok: false,
      online: false,
      heartbeatKey,
      message: error.message,
    };
  }
}

export async function GET() {
  const startedAt = Date.now();
  const [redis, queue, workerHeartbeat] = await Promise.all([
    checkRedis(),
    checkQueue(),
    checkWorkerHeartbeat(),
  ]);
  const mailConfig = checkMailConfig();

  const systems = {
    api: { ok: true },
    redis,
    queue,
    workerHeartbeat,
    mailConfig,
  };

  const allOk = Object.values(systems).every((system) => system.ok);

  return NextResponse.json(
    {
      ok: allOk,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      responseTimeMs: Date.now() - startedAt,
      systems,
    },
    { status: allOk ? 200 : 503 },
  );
}
