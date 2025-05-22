import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LanguageState = {
  language: 'en' | 'es';
  toggleLanguage: () => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      toggleLanguage: () => set((state) => ({ 
        language: state.language === 'en' ? 'es' : 'en' 
      })),
    }),
    {
      name: 'language-storage', // LocalStorage key
    }
  )
);