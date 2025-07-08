import Joi from "joi";

// Login
export const loginSchema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().min(6).required()
});

// Signup (inicio)
export const signupInitiateSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  nickname: Joi.string().min(3).required(),
  phone: Joi.string().pattern(/^(\+52\d{10}|\d{10})$/).required(),
  tokenDelivery: Joi.string().valid("email", "phone").required()
});

// Signup (completar)
export const signupCompleteSchema = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().length(6).required()
});

// Forgot Password
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

// Reset Password
export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required()
});

// Complete Profile
export const completeProfileSchema = Joi.object({
  nickname: Joi.string().min(3).required(),
  age: Joi.number().integer().min(1).required(),
  phone: Joi.string().pattern(/^(\+52\d{10}|\d{10})$/),
  email: Joi.string().email(),
  tokenDelivery: Joi.string().valid("email", "phone")
});
