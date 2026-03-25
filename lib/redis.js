import { Redis } from "ioredis";

let redisConnection1;
let redisConnection2;

export function createRedisConnection1() {
  if (!process.env.REDIS_URL1) {
    throw new Error("REDIS_URL 1 is not configured");
  }

  // Determine if TLS should be enabled. Some Redis providers require rediss://
  const useTls =
    process.env.REDIS_URL1.startsWith("rediss://") ||
    process.env.REDIS_TLS === "true";

  const connection = new Redis(process.env.REDIS_URL1, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: true,
    tls: useTls ? {} : undefined,
  });

  connection.on("error", (error) => {
    console.error(
      "[Redis1] connection error:",
      error && error.message ? error.message : error,
    );
  });

  connection.on("connect", () => {
    console.log("[Redis1] socket connected");
  });

  connection.on("ready", () => {
    console.log("[Redis1] client ready");
  });

  // attempt to connect and surface any connection errors early
  connection.connect().catch((err) => {
    console.error(
      "[Redis1] connect() failed:",
      err && err.message ? err.message : err,
    );
  });

  return connection;
}
export function createRedisConnection2() {
  if (!process.env.REDIS_URL2) {
    throw new Error("REDIS_URL 2 is not configured");
  }

  // Determine if TLS should be enabled. Some Redis providers require rediss://
  const useTls =
    process.env.REDIS_URL2.startsWith("rediss://") ||
    process.env.REDIS_TLS === "true";

  const connection = new Redis(process.env.REDIS_URL2, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: true,
    tls: useTls ? {} : undefined,
  });

  connection.on("error", (error) => {
    console.error(
      "[Redis2] connection error:",
      error && error.message ? error.message : error,
    );
  });

  connection.on("connect", () => {
    console.log("[Redis2] socket connected");
  });

  connection.on("ready", () => {
    console.log("[Redis2] client ready");
  });

  // attempt to connect and surface any connection errors early
  connection.connect().catch((err) => {
    console.error(
      "[Redis2] connect() failed:",
      err && err.message ? err.message : err,
    );
  });

  return connection;
}

export function getRedisConnection1() {
  if (redisConnection1) {
    return redisConnection1;
  }

  redisConnection1 = createRedisConnection1();
  return redisConnection1;
}

export function getRedisConnection2() {
  if (redisConnection2) {
    return redisConnection2;
  }

  redisConnection2 = createRedisConnection2();
  return redisConnection2;
}

export async function redisPing1() {
  try {
    const conn = getRedisConnection1();
    const pong = await conn.ping();
    return pong === "PONG" || pong === "OK" || !!pong;
  } catch (e) {
    console.error("[Redis1] ping error:", e && e.message ? e.message : e);
    return false;
  }
}
export async function redisPing2() {
  try {
    const conn = getRedisConnection2();
    const pong = await conn.ping();
    return pong === "PONG" || pong === "OK" || !!pong;
  } catch (e) {
    console.error("[Redis2] ping error:", e && e.message ? e.message : e);
    return false;
  }
}
export async function redisPing() {
  try {
    const results = await Promise.all([redisPing1(), redisPing2()]);
    // return true only if both pings succeeded
    return results.every((r) => !!r);
  } catch (e) {
    console.error("[Redis] ping error:", e && e.message ? e.message : e);
    return false;
  }
}

// Backwards-compatible helpers used elsewhere in the codebase
export function createRedisConnection() {
  // default to connection1
  return createRedisConnection1();
}

export function getRedisConnection() {
  return getRedisConnection1();
}
