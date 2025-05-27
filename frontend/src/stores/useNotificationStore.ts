import { create } from "zustand";

interface NotificationStore {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  increment: () => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  increment: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
  reset: () => set({ unreadCount: 0 }),
}));
