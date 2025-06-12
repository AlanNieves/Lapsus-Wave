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
	completeProfile
} from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Verificar autenticación con token
router.get("/check-auth", verifyToken, checkAuth);

// ✅ Registro / inicio / cierre de sesión
router.post("/signup", signup);
router.post("/login", login);
router.post("/google", loginWithGoogle);
router.post("/logout", logout);

// ✅ Verificación de correo
router.post("/verify-email", verifyEmail);

// ✅ Recuperación y reinicio de contraseña
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/complete-profile", verifyToken, completeProfile);


export default router;
