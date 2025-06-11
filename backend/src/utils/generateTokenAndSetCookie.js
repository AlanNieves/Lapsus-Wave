import jwt from "jsonwebtoken";

/**
 * Genera un JWT y lo guarda en una cookie segura.
 * @param {Response} res - Objeto de respuesta de Express
 * @param {string} userId - ID del usuario
 * @returns {string} token JWT generado
 */
export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,                       // ✅ no accesible desde JS
    secure: process.env.NODE_ENV === "production", // ✅ solo HTTPS en prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ✅ compatibilidad con localhost
    maxAge: 7 * 24 * 60 * 60 * 1000,      // 7 días
  });

  return token;
};