import { axiosInstance } from "@/lib/axios";
import { User } from "@/types";

// ✅ LOGIN
export const login = async (identifier: string, password: string) => {
  return axiosInstance.post(
    "/auth/login",
    { identifier, password },
    { withCredentials: true }
  );
};

// ✅ LOGIN CON GOOGLE
export const loginWithGoogle = async (
  credential: string
): Promise<User> => {
  const res = await axiosInstance.post("/auth/google", { credential });
  return res.data;
};

// ✅ LOGOUT
export const logout = () =>
  axiosInstance.post("/auth/logout", null, { withCredentials: true });

// ✅ CHECK AUTH
export const checkAuth = () =>
  axiosInstance.get("/auth/check-auth", { withCredentials: true });

// ✅ VALIDAR USUARIO
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

// ✅ ENVIAR TOKEN
export const initiateSignup = (value: string, method: "email" | "phone") =>
  axiosInstance.post(
    "/token/send",
    method === "phone" ? { phone: value } : { email: value }
  );

// ✅ COMPLETAR REGISTRO
export const completeSignup = (payload: {
  email: string;
  phone: string;
  nickname: string;
  password: string;
  age: number;
  verifyBy: "email" | "phone";
  token: string;
}) =>
  axiosInstance.post("/auth/signup/complete", payload);

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

// ✅ VERIFICAR EMAIL
export const verifyEmail = (code: string) =>
  axiosInstance.post("/auth/verify-email", { code });
