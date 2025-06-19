import * as bcrypt from "bcrypt";
import crypto from "crypto";

import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { verifyGoogleToken } from "../utils/googleAuth.js";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../utils/sendEmail.js";

// ✅ LOGIN LOCAL o LAPSUS-WAVE
export const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Faltan campos requeridos" });
    }

    const isEmail = identifier.includes("@");
    const normalizedIdentifier = isEmail
      ? identifier.toLowerCase()
      : identifier;

    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const user = await User.findOne({
      $or: [
        { email: normalizedIdentifier },
        {
          nickname: new RegExp(`^${escapeRegExp(normalizedIdentifier)}$`, "i"),
        },
        { phone: normalizedIdentifier },
      ],
    });

    console.log("🟢 Body recibido:", req.body);
    console.log("🟡 Usuario encontrado:", user);

    if (!user) {
      console.log("🔴 No se encontró usuario con:", identifier);
      return res
        .status(400)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    if (!["local", "lapsus-wave"].includes(user.authProvider)) {
      console.log("🟠 authProvider incorrecto:", user.authProvider);
      return res
        .status(400)
        .json({ success: false, message: "Proveedor inválido" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Comparando:", password, "con hash:", user.password);
    console.log("¿Es válida la contraseña?", isPasswordValid);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Credenciales inválidas" });
    }

    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Sesión iniciada",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

// ✅ LOGIN CON GOOGLE
// ✅ LOGIN CON GOOGLE (actualizado con migración de clerkId)
export const loginWithGoogle = async (req, res) => {
  const { credential } = req.body;

  try {
    if (!credential) {
      return res
        .status(400)
        .json({ success: false, message: "Token de Google requerido" });
    }

    const payload = await verifyGoogleToken(credential);
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ googleId });

    if (!user && email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      user = await User.create({
        googleId,
        email,
        nickname: name,
        imageUrl: picture,
        authProvider: "google",
        isVerified: true,
        isProfileComplete: false,
      });
    }

    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Sesión iniciada con Google",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("Error en loginWithGoogle:", error);
    res
      .status(401)
      .json({ success: false, message: "Token inválido o expirado" });
  }
};

<<<<<<< HEAD

// ✅ VERIFY EMAIL
=======
// ✅ VERIFICAR EMAIL
>>>>>>> f7f1535c733f3bfa8018fbf97048dd48287ea111
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Código inválido o expirado" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Correo verificado correctamente",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

// ✅ VALIDACIÓN DE USUARIO
export const validateUserData = async (req, res) => {
  const { email, phone, nickname, mode } = req.body;

  if (mode === "check") {
    try {
      const exists = await User.findOne({ email });
      return res.status(200).json({ exists: !!exists });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Error al verificar usuario" });
    }
  }

  const errors = {};

  if (email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) errors.email = "El correo ya está registrado";
  }

  if (phone) {
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) errors.phone = "El número telefónico ya está registrado";
  }

  if (nickname) {
    const nicknameExists = await User.findOne({ nickname });
    if (nicknameExists) errors.nickname = "El nickname ya está en uso";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(409).json({ success: false, errors });
  }

  res.status(200).json({ success: true });
};

// ✅ LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Sesión cerrada" });
};

// ✅ FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res
      .status(200)
      .json({ success: true, message: "Enlace enviado al correo electrónico" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Token inválido o expirado" });
    }

    
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();
    await sendResetSuccessEmail(user.email);

    res.status(200).json({ success: true, message: "Contraseña actualizada" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ CHECK AUTH
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Usuario no encontrado" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ COMPLETE PROFILE
export const completeProfile = async (req, res) => {
  const { nickname, phone, age } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });

    if (user.isProfileComplete)
      return res
        .status(400)
        .json({ success: false, message: "Perfil ya completado" });

    if (!nickname || !age || (!phone && user.authProvider === "local")) {
      return res
        .status(400)
        .json({ success: false, message: "Faltan campos obligatorios" });
    }

    const nicknameTaken = await User.findOne({ nickname });
    if (nicknameTaken) {
      return res
        .status(400)
        .json({ success: false, message: "Nickname ya está en uso" });
    }

    if (phone) {
      const phoneTaken = await User.findOne({ phone });
      if (phoneTaken) {
        return res
          .status(400)
          .json({ success: false, message: "Teléfono ya está en uso" });
      }
    }

    user.nickname = nickname;
    user.age = age;
    if (phone) user.phone = phone;
    user.isProfileComplete = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Perfil completado",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
