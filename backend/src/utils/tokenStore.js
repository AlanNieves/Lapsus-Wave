import redis from "./redisClient.js";

const EXPIRATION_SECONDS = 5 * 60;

export const saveToken = async (key, token) => {
  await redis.set(key, token, "EX", EXPIRATION_SECONDS);
};

export const verifyToken = async (key, token) => {
  const storedToken = await redis.get(key);
  return storedToken === token;
};

export const deleteToken = async (key) => {
  await redis.del(key);
};
