import { axiosInstance } from "@/lib/axios";

// ✅ LOGIN
export const login = (identifier: string, password: string) =>
  axiosInstance.post("/auth/login", { identifier, password }, { withCredentials: true });

// ✅ LOGIN CON GOOGLE
export const loginWithGoogle = (credential: string) =>
  axiosInstance.post("/auth/google", { credential }, { withCredentials: true });

// ✅ LOGOUT
export const logout = () =>
  axiosInstance.post("/auth/logout", null, { withCredentials: true });

// ✅ CHECK AUTH
export const checkAuth = () =>
  axiosInstance.get("/auth/check-auth", { withCredentials: true });

// ✅ VALIDAR USUARIO (antes de crear cuenta)
export const validateUserData = ({
  email,
  phone,
  nickname,
}: {
  email: string;
  phone: string;
  nickname: string;
}) =>
  axiosInstance.post("/auth/validate-user", {
    email,
    phone,
    nickname,
  });

// ✅ ENVIAR TOKEN (registro por SMS/correo)
export const initiateSignup = (key: string, method: "email" | "phone") =>
  axiosInstance.post("/token/send", { key, method });

// ✅ COMPLETAR REGISTRO (una vez verificado el token)
export const completeSignup = ({
  email,
  phone,
  nickname,
  password,
  age,
  verifyBy,
  token,
}: {
  email: string;
  phone: string;
  nickname: string;
  password: string;
  age: number;
  verifyBy: "email" | "phone";
  token: string;
}) =>
  axiosInstance.post("/auth/signup/complete", {
    email,
    phone,
    nickname,
    password,
    age,
    verifyBy,
    token,
  });

// ✅ COMPLETAR PERFIL
export const completeProfile = (payload: {
  nickname: string;
  age: number;
  phone?: string;
  tokenDelivery?: "email" | "phone";
}) =>
  axiosInstance.post("/auth/complete-profile", payload, {
    withCredentials: true,
  });

// ✅ RECUPERAR CONTRASEÑA
export const forgotPassword = (email: string) =>
  axiosInstance.post("/auth/forgot-password", { email });

// ✅ RESETEAR CONTRASEÑA
export const resetPassword = (token: string, password: string) =>
  axiosInstance.post(`/auth/reset-password/${token}`, { password });

// ✅ VERIFICAR EMAIL (opcional, si lo usas)
export const verifyEmail = (code: string) =>
  axiosInstance.post("/auth/verify-email", { code });
