// src/controller/signup.controller.js
import { deleteToken, verifyToken } from "../utils/tokenStore.js";
import User from "../models/user.model.js";

/**
 * Completa el registro: verifica token y crea usuario si es válido
 * @route POST /api/signup/complete
 */
export const completeSignup = async (req, res) => {
  try {
    const { email, phone, nickname, password, age, verifyBy, token } = req.body;
    const key = verifyBy === "phone" ? phone : email;

    const isValid = await verifyToken(key, token);
    if (!isValid) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const userExists = await User.findOne({
      $or: [{ email }, { phone }, { nickname }],
    });
    if (userExists) {
      return res.status(409).json({ message: "Ya existe un usuario con ese email, teléfono o nickname" });
    }

    const newUser = new User({
      email,
      phone,
      nickname,
      password, // será hasheado en el pre-save
      age,
      authProvider: "lapsus-wave",
      isProfileComplete: true,
    });

    await newUser.save();
    await deleteToken(key);

    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("Error en completeSignup:", error);
    res.status(500).json({ message: "Error al completar registro", error });
  }
};