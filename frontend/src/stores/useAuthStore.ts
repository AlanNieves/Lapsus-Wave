import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

export interface User {
  _id: string;
  email: string;
  fullName: string;
  imageUrl: string;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credentials: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/auth/check-auth");
      set({ user: res.data.user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  logout: async () => {
    await axiosInstance.post("/auth/logout");
    set({ user: null });
  },

  login: async (email: string, password: string) => {
  try {
    set({ isLoading: true });
    const res = await axiosInstance.post("/auth/login", { email, password });
    set({ user: res.data.user, isLoading: false });
  } catch (error) {
    console.error("Error al iniciar sesión", error);
    set({ isLoading: false });
  }
},

loginWithGoogle: async (credential: string) => {
  try {
    set({ isLoading: true });
    const res = await axiosInstance.post("/auth/google", { credential }, { withCredentials: true });
    set({ user: res.data.user, isLoading: false });
  } catch (error) {
    console.error("Error al iniciar sesión con Google", error);
    set({ isLoading: false });
    throw error;
  }
},


}));