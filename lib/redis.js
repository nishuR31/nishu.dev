import { Redis } from "ioredis";

let redisConnection;

export function getRedisConnection() {
  if (redisConnection) {
    return redisConnection;
  }

  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not configured");
  }

  redisConnection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  });

  redisConnection.on("error", (error) => {
    console.error("[Redis] connection error:", error.message);
  });

  return redisConnection;
}
