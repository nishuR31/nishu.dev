import "dotenv/config";
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redis.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

redis
  .set("test", "1")
  .then((res) => {
    console.log("Redis SET status:", res);
    console.log(redis.get("test"));
    process.exit(0);
  })
  .catch((err) => {
    console.error("Redis SET failed:", err.message);
    process.exit(1);
  });
