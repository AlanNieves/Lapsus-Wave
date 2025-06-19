// src/utils/sendEmail.js
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Envía un token de verificación al correo electrónico
 * @param {string} to - Email del destinatario
 * @param {string} code - Código de verificación numérico (6 dígitos)
 */
export const sendVerificationEmail = async (to, code) => {
  const msg = {
    to,
    from: {
      email: process.env.SENDGRID_SENDER_EMAIL,
      name: process.env.SENDGRID_SENDER_NAME || "Lapsus Wave",
    },
    subject: "Tu código de verificación - Lapsus",
    html: `
      <div style="font-family: sans-serif; text-align: center;">
        <h2>Hola 👋</h2>
        <p>Tu código de verificación para Lapsus es:</p>
        <h1 style="font-size: 36px; color: #8b5cf6;">${code}</h1>
        <p>Este código es válido por 5 minutos.</p>
        <br />
        <small>No respondas a este correo.</small>
      </div>
    `,
  };

  await sgMail.send(msg);
};

/**
 * Envío de correo de bienvenida
 * @param {string} to - Email del destinatario
 * @param {string} name - Nombre del usuario
 */
export const sendWelcomeEmail = async (to, name = "") => {
  const msg = {
    to,
    from: {
      email: process.env.SENDGRID_SENDER_EMAIL,
      name: process.env.SENDGRID_SENDER_NAME || "Lapsus Wave",
    },
    subject: "Bienvenido a Lapsus",
    html: `
      <div style="font-family: sans-serif; text-align: center;">
        <h2>¡Bienvenido, ${name}!</h2>
        <p>Gracias por unirte a Lapsus Wave.</p>
      </div>
    `,
  };

  await sgMail.send(msg);
};

/**
 * Enlace para restablecer la contraseña
 * @param {string} to - Email del destinatario
 * @param {string} link - Enlace de restablecimiento
 */
export const sendPasswordResetEmail = async (to, link) => {
  const msg = {
    to,
    from: {
      email: process.env.SENDGRID_SENDER_EMAIL,
      name: process.env.SENDGRID_SENDER_NAME || "Lapsus Wave",
    },
    subject: "Restablece tu contraseña - Lapsus",
    html: `
      <div style="font-family: sans-serif; text-align: center;">
        <h2>¿Olvidaste tu contraseña?</h2>
        <p>Haz clic en el siguiente enlace para restablecerla:</p>
        <a href="${link}" style="color: #8b5cf6;">Restablecer contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
      </div>
    `,
  };

  await sgMail.send(msg);
};

/**
 * Confirmación tras restablecer la contraseña
 * @param {string} to - Email del destinatario
 */
export const sendResetSuccessEmail = async (to) => {
  const msg = {
    to,
    from: {
      email: process.env.SENDGRID_SENDER_EMAIL,
      name: process.env.SENDGRID_SENDER_NAME || "Lapsus Wave",
    },
    subject: "Contraseña actualizada - Lapsus",
    html: `
      <div style="font-family: sans-serif; text-align: center;">
        <h2>¡Tu contraseña ha sido actualizada!</h2>
        <p>Si no realizaste este cambio, contáctanos inmediatamente.</p>
      </div>
    `,
  };

  await sgMail.send(msg);
};
