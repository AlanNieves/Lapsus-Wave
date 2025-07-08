import { create } from "zustand";

interface SearchStore {
  showSearch: boolean;
  searchTerm: string;
  setShowSearch: (value: boolean) => void;
  setSearchTerm: (term: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  showSearch: false,
  searchTerm: "",
  setShowSearch: (value) => set({ showSearch: value }),
  setSearchTerm: (term) => set({ searchTerm: term }),
}));
