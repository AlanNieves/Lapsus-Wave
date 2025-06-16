// src/routes/auth.route.js
import express from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  loginWithGoogle,
  completeProfile,
} from "../controller/auth.controller.js";

import { completeSignup } from "../controller/signup.controller.js";
import { verifyToken as verifyJWT } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Verificación por JWT (para usuarios logueados)
router.get("/check-auth", verifyJWT, checkAuth);

// ✅ Rutas clásicas
router.post("/signup", signup); // ya no usarás esta si usas SMS
router.post("/login", login);
router.post("/google", loginWithGoogle);
router.post("/logout", logout);

// ✅ Verificación de correo (Google)
router.post("/verify-email", verifyEmail);

// ✅ Recuperación de contraseña
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ✅ Registro por token (Lapsus)
router.post("/signup/complete", completeSignup);

// ✅ Completar perfil (usuarios Google o Lapsus)
router.post("/complete-profile", verifyJWT, completeProfile);

export default router;
