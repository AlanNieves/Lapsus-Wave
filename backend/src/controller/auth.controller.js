import * as bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateTokensAndSetCookies } from "../utils/generateTokenAndSetCookie.js";
import { verifyGoogleToken } from "../utils/googleAuth.js";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../utils/sendEmail.js";
import { normalizePhone } from "../utils/normalizePhone.js";

// ✅ LOGIN LOCAL o LAPSUS-WAVE
// ✅ LOGIN LOCAL o LAPSUS-WAVE
export const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Faltan campos requeridos" });
    }

    let user = null;
    const isEmail = identifier.includes("@");
    const isPhone = /^\d+$/.test(identifier);

    if (isEmail) {
      user = await User.findOne({ email: identifier.toLowerCase() });
    } else if (isPhone) {
      user = await User.findOne({ phone: normalizePhone(identifier) });
    } else {
      user = await User.findOne({
        nickname: new RegExp(`^${identifier}$`, "i"),
      });
    }

    console.log("🟢 Body recibido:", req.body);
    console.log("🟡 Usuario encontrado:", user);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    if (!["local", "lapsus-wave"].includes(user.authProvider)) {
      console.log("🟠 authProvider incorrecto:", user.authProvider);
      return res.status(400).json({
        success: false,
        message: `Este usuario se registró con ${user.authProvider}. Usa ese método de inicio de sesión.`,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Credenciales inválidas" });
    }

    const accessToken = generateTokensAndSetCookies(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Sesión iniciada",
      accessToken,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

// ✅ LOGIN CON GOOGLE
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

    const accessToken = generateTokensAndSetCookies(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Sesión iniciada con Google",
      accessToken,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("Error en loginWithGoogle:", error);
    res
      .status(401)
      .json({ success: false, message: "Token inválido o expirado" });
  }
};

// ✅ VERIFICAR EMAIL
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
  const normalizedPhone = normalizePhone(phone);

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

  if (normalizedPhone) {
    const phoneExists = await User.findOne({ phone: normalizedPhone });
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
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "No hay token de acceso",
      });
    }

    //verificar token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no enontrado",
      });
    }
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email ?? null,
        nickname: user.nickname ?? null,
        phone: user.phone ?? null,
        age: user.age ?? null,
        avatar: user.avatar ?? null,
        authProvider: user.authProvider ?? null,
        isProfileComplete: user.isProfileComplete ?? false,
        googleId: user.googleId ?? null,
        facebookId: user.facebookId ?? null,
        appleId: user.appleId ?? null,
        lapsusId: user.lapsusId ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error en checkauth:", error);
    res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Token expirado"
          : "Token invalido",
    });
  }
};

// ✅ COMPLETE PROFILE
export const completeProfile = async (req, res) => {
  const { nickname, phone, age } = req.body;
  const normalizedPhone = normalizePhone(phone);

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

    if (
      !nickname ||
      !age ||
      (!normalizedPhone && user.authProvider === "local")
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Faltan campos obligatorios o el teléfono no es válido",
        });
    }

    const nicknameTaken = await User.findOne({ nickname });
    if (nicknameTaken) {
      return res
        .status(400)
        .json({ success: false, message: "Nickname ya está en uso" });
    }

    if (normalizedPhone) {
      const phoneTaken = await User.findOne({ phone: normalizedPhone });
      if (phoneTaken) {
        return res
          .status(400)
          .json({ success: false, message: "Teléfono ya está en uso" });
      }
    }

    user.nickname = nickname;
    user.age = age;
    if (normalizedPhone) user.phone = normalizedPhone;
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
