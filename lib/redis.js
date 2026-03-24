import { Redis } from "ioredis";

let redisConnection;

export function createRedisConnection() {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not configured");
  }

  // Determine if TLS should be enabled. Some Redis providers require rediss://
  const useTls =
    process.env.REDIS_URL.startsWith("rediss://") ||
    process.env.REDIS_TLS === "true";

  const connection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: true,
    tls: useTls ? {} : undefined,
  });

  connection.on("error", (error) => {
    console.error(
      "[Redis] connection error:",
      error && error.message ? error.message : error,
    );
  });

  connection.on("connect", () => {
    console.log("[Redis] socket connected");
  });

  connection.on("ready", () => {
    console.log("[Redis] client ready");
  });

  // attempt to connect and surface any connection errors early
  connection.connect().catch((err) => {
    console.error(
      "[Redis] connect() failed:",
      err && err.message ? err.message : err,
    );
  });

  return connection;
}

export function getRedisConnection() {
  if (redisConnection) {
    return redisConnection;
  }

  redisConnection = createRedisConnection();
  return redisConnection;
}

export async function redisPing() {
  return await redisConnection.ping();
}
