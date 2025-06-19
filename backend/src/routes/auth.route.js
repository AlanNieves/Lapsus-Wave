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
  validateUserData
} from "../controller/auth.controller.js";

import { completeSignup, initiateSignup } from "../controller/signup.controller.js";
import { verifyToken as verifyJWT } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Autenticación
router.post("/auth/login", login);
router.post("/auth/google", loginWithGoogle);
router.post("/auth/logout", logout);

// ✅ Check de sesión
router.get("/auth/check-auth", verifyJWT, checkAuth);

// ✅ Registro por token
router.post("/auth/signup/initiate", initiateSignup);
router.post("/auth/signup/complete", completeSignup);

// ✅ Verificación de datos / correo
router.post("/auth/validate-user", validateUserData);
router.post("/auth/verify-email", verifyEmail);

// ✅ Recuperación de contraseña
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password/:token", resetPassword);

// ✅ Completar perfil
router.post("/auth/complete-profile", verifyJWT, completeProfile);

export default router;