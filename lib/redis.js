import { Redis } from "ioredis";

let redisConnection;

export function createRedisConnection() {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not configured");
  }

  const connection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  });

  connection.on("error", (error) => {
    console.error("[Redis] connection error:", error.message);
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
