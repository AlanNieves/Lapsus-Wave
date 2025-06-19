import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

export interface User {
  _id: string;
  email: string;
  imageUrl: string;
  isVerified: boolean;
  isProfileComplete: boolean;
  authProvider: string;
  nickname: string;
  phone: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;

  // Métodos
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<{ user: User }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  // ✅ Permite actualizar manualmente el estado del usuario
  setUser: (user) => set({ user }),

  // ✅ Verifica si hay sesión activa
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/auth/check-auth", {
        withCredentials: true,
      });
      set({ user: res.data.user, isLoading: false });
    } catch (error) {
      console.error("Error al verificar sesión:", error);
      set({ user: null, isLoading: false });
    }
  },

  // ✅ Cierra sesión
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout", null, {
        withCredentials: true,
      });
      set({ user: null });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  },

  // ✅ Login con email, teléfono o nickname
  login: async (identifier: string, password: string) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(
        "/auth/login",
        { identifier, password },
        { withCredentials: true }
      );
      set({ user: res.data.user, isLoading: false });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // ✅ Login con Google
  loginWithGoogle: async (credential: string): Promise<{ user: User }> => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(
        "/auth/google",
        { credential },
        { withCredentials: true }
      );
      set({ user: res.data.user, isLoading: false });
      return res.data;
    } catch (error) {
      console.error("Error en login con Google:", error);
      set({ isLoading: false });
      throw error;
    }
  },
}));
