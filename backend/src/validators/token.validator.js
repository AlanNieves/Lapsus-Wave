import Joi from "joi";

// Enviar Token
export const sendTokenSchema = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^(\+52\d{10}|\d{10})$/),
}).or("email", "phone"); // Debe incluir al menos uno

// Verificar Token
export const verifyTokenSchema = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^(\+52\d{10}|\d{10})$/),
  token: Joi.string().length(6).required()
}).or("email", "phone");
