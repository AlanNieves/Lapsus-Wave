import express from "express";
import {
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  loginWithGoogle,
  completeProfile,
  validateUserData,
} from "../controller/auth.controller.js";

import {
  completeSignup,
  initiateSignup,
} from "../controller/signup.controller.js";
import { verifyToken as verifyJWT } from "../middleware/verifyToken.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  loginSchema,
  signupInitiateSchema,
  signupCompleteSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  completeProfileSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

// ✅ Autenticación
router.post("/auth/login", validateRequest(loginSchema), login);
router.post("/auth/google", loginWithGoogle);
router.post("/auth/logout", logout);

// ✅ Check de sesión
router.get("/auth/check-auth", verifyJWT, checkAuth);

// ✅ Registro por token
router.post(
  "/auth/signup/initiate",
  validateRequest(signupInitiateSchema),
  initiateSignup
);
router.post(
  "/auth/signup/complete",
  validateRequest(signupCompleteSchema),
  completeSignup
);

// ✅ Verificación de datos / correo
router.post("/auth/validate-user", validateUserData);
router.post("/auth/verify-email", verifyEmail);

// ✅ Recuperación de contraseña
router.post(
  "/auth/forgot-password",
  validateRequest(forgotPasswordSchema),
  forgotPassword
);
router.post(
  "/auth/reset-password/:token",
  validateRequest(resetPasswordSchema),
  resetPassword
);

// ✅ Completar perfil
router.post(
  "/auth/complete-profile",
  verifyJWT,
  validateRequest(completeProfileSchema),
  completeProfile
);

// ✅ Refrescar Access Token
router.post("/auth/refresh-token", async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

export default router;