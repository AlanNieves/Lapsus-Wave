import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  originalQueue: Song[];
  currentIndex: number;
  isShuffleActive: boolean;
  repeatMode: number; // 0: no repeat, 1: repeat once, 2: repeat twice

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  shuffleQueue: () => void;
  toggleRepeat: () => void;
  setRepeatMode: (mode: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  originalQueue: [],
  currentIndex: -1,
  isShuffleActive: false,
  repeatMode: 0,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      originalQueue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }
    set({
      queue: songs,
      originalQueue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;

    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity:
          willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
      });
    }

    set({
      isPlaying: willStartPlaying,
    });
  },

  playNext: () => {
    const { currentIndex, queue } = get();
    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
        });
      }

      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Idle`,
        });
      }
    }
  },

  playPrevious: () => {
    const { currentIndex, queue } = get();
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
        });
      }

      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Idle`,
        });
      }
    }
  },

  toggleShuffle: () => {
    const { isShuffleActive, originalQueue, currentSong } = get();

    if (isShuffleActive) {
      const currentSongIndex = originalQueue.findIndex((song) => song._id === currentSong?._id);
      set({
        queue: originalQueue,
        currentIndex: currentSongIndex !== -1 ? currentSongIndex : 0,
        isShuffleActive: false,
      });
    } else {
      get().shuffleQueue();
      set({ isShuffleActive: true });
    }
  },

  shuffleQueue: () => {
    const { queue, currentSong } = get();

    if (queue.length <= 1) return;

    const shuffledQueue = queue.slice();

    for (let i = shuffledQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQueue[i], shuffledQueue[j]] = [shuffledQueue[j], shuffledQueue[i]];
    }

    if (currentSong) {
      const currentSongIndex = shuffledQueue.findIndex((song) => song._id === currentSong._id);
      if (currentSongIndex !== -1) {
        const [song] = shuffledQueue.splice(currentSongIndex, 1);
        shuffledQueue.unshift(song);
      }
    }

    set({
      queue: shuffledQueue,
      currentIndex: 0,
    });
  },

  toggleRepeat: () => {
    const { repeatMode } = get();
    const newRepeatMode = (repeatMode + 1) % 3; // Cycle through 0, 1, 2
    set({ repeatMode: newRepeatMode });
  },

  setRepeatMode: (mode: number) => {
    set({ repeatMode: mode });
  },

  setIsPlaying: (isPlaying: boolean) => {
    set({ isPlaying });
  },
}));