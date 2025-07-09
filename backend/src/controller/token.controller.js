// src/controller/token.controller.js
import { saveToken, verifyToken as checkToken, deleteToken } from "../utils/tokenStore.js";
import { sendVerificationSMS } from "../utils/sendSms.js";
import { sendVerificationEmail } from "../utils/sendEmail.js"; // ✅ Importación agregada

/**
 * Envía un token por SMS o correo electrónico (verificación previa al registro)
 * @route POST /api/token/send
 */
export const sendToken = async (req, res) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ message: "Debes proporcionar email o teléfono." });
  }

  try {
    const token = Math.floor(100000 + Math.random() * 900000).toString(); // Token de 6 dígitos

    if (email) {
      await saveToken(email, token);
      await sendVerificationEmail(email, token);
    } else if (phone) {
      await saveToken(phone, token);
      await sendVerificationSMS(phone, token);
    }

    res.status(200).json({ message: "Token enviado correctamente" });
  } catch (error) {
    console.error("Error en sendToken:", error);
    res.status(500).json({ message: "Error al enviar token", error: error.message });
  }
};


/**
 * Verifica un token enviado previamente
 * @route POST /api/token/verify
 */
export const verifyToken = async (req, res) => {
  const { key, token } = req.body;

  if (!key || !token) {
    return res.status(400).json({ message: "Faltan campos" });
  }

  try {
    const isValid = await checkToken(key, token);
    if (!isValid) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    res.status(200).json({ message: "Token válido" });
  } catch (error) {
    console.error("Error en verifyToken:", error);
    res.status(500).json({ message: "Error al verificar token", error: error.message });
  }
};