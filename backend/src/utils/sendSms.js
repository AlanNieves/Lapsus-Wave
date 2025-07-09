import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Envía un SMS con el token de verificación
 * @param {string} phone - número en formato internacional, ej. +5214491234567
 * @param {string} code - código de verificación de 6 dígitos
 */
export const sendVerificationSMS = async (phone, code) => {
  try {
    const message = await client.messages.create({
      body: `Tu código de verificación para Lapsus es: ${code}`,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });

    console.log("✅ SMS enviado con SID:", message.sid);
    return message;
  } catch (error) {
    console.error("❌ Error al enviar SMS:", error);
    throw error;
  }
};