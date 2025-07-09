import jwt from "jsonwebtoken";

/**
 * Genera un JWT y lo guarda en una cookie segura.
 * @param {Response} res - Objeto de respuesta de Express
 * @param {string} userId - ID del usuario
 * @returns {string} token JWT generado
 */
export const generateTokensAndSetCookies = (res, userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 minutos
  });

  // Guardar el Refresh Token en cookie segura
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  });

  return accessToken;
};