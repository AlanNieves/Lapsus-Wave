import { create } from "zustand";
import { SignupData } from "@/types";

interface SignupState {
  signupData: SignupData | null;
  setSignupData: (data: SignupData) => void;
  clearSignupData: () => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  signupData: null,
  setSignupData: (data) => set({ signupData: data }),
  clearSignupData: () => set({ signupData: null }),
}));
