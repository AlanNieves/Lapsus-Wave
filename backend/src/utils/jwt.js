import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRATION = "15m";
const REFRESH_TOKEN_EXPIRATION = "7d";
const JWT_SECRET = process.env.JWT_SECRET;

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};