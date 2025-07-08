import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { User } from "@/types";
import { useChatStore } from "./useChatStore";

interface AuthState {
  user: User | null;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  clearAuth: () => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<User>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),

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

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout", null, {
        withCredentials: true,
      });

      const { disconnectSocket } = useChatStore.getState();
      disconnectSocket();

      set({ user: null });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);

      const { disconnectSocket } = useChatStore.getState();
      disconnectSocket();

      set({ user: null });
    }
  },

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

  loginWithGoogle: async (credential: string): Promise<User> => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(
        "/auth/google",
        { credential },
        { withCredentials: true }
      );
      set({ user: res.data.user, isLoading: false });
      return res.data.user;
    } catch (error) {
      console.error("Error en login con Google:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  clearAuth: () => set({ user: null }),
}));
