import { deleteToken, verifyToken } from "../utils/tokenStore.js";
import User from "../models/user.model.js";
import * as bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

// ✅ Para mantener compatibilidad con /signup/initiate
export const initiateSignup = async (req, res) => {
  const { key, method } = req.body;

  if (!key || !["phone", "email"].includes(method)) {
    return res.status(400).json({ message: "Datos inválidos" });
  }

  try {
    res.redirect(307, "/api/token/send");
  } catch (err) {
    res.status(500).json({ message: "Error al iniciar el envío del token" });
  }
};

/**
 * Completa el registro: verifica token y crea usuario si es válido
 * @route POST /api/signup/complete
 */
export const completeSignup = async (req, res) => {
  try {
    const {
      email = "",
      phone = "",
      nickname,
      password,
      age,
      verifyBy,
      token,
    } = req.body;

    const key = verifyBy === "phone" ? phone : email;

    const isValid = await verifyToken(key, token);
    if (!isValid) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const userExists = await User.findOne({
      $or: [{ email }, { phone }, { nickname }],
    });
    if (userExists) {
      return res
        .status(409)
        .json({ message: "Ya existe un usuario con ese email, teléfono o nickname" });
    }

    

    const newUser = new User({
      email: email || undefined,
      phone: phone || undefined,
      nickname,
      password,
      age,
      authProvider: "local",
      isVerified: true,
      isProfileComplete: true,
    });

    await newUser.save();
    await deleteToken(key);

    generateTokenAndSetCookie(res, newUser._id);

    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      user: { ...newUser._doc, password: undefined },
    });
  } catch (error) {
    console.error("Error en completeSignup:", error);
    res.status(500).json({ message: "Error al completar registro", error });
  }
};
