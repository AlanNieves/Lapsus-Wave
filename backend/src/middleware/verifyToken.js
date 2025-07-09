import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // 🚩 Leer la cookie accessToken
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "No hay token de acceso",
      });
    }

    // 🚩 Verificar el token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // 🚩 Guardar userId en req para los controladores
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Error en verifyToken:", error);
    res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Token expirado"
          : "Token inválido",
    });
  }
};