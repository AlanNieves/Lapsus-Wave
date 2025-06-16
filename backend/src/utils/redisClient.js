import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 2,
  reconnectOnError: () => true,
  enableOfflineQueue: false,
  lazyConnect: false, // conecta inmediatamente
});

redis.on("connect", () => console.log("✅ Conectado a Redis (Upstash)"));
redis.on("error", (err) => console.error("❌ Error en Redis:", err.message));

export default redis;