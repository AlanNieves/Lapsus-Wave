import { create } from "zustand";
import {  Song } from "@/types";
import toast from 'react-hot-toast';


interface PlayerStore {
  // Estado del reproductor
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  originalQueue: Song[];
  currentIndex: number;
  isShuffleActive: boolean;
  repeatMode: number;
  showQueue: boolean;
  isExpandedViewOpen: boolean;
  //isMenuOpen: boolean;
  openMenuSongId: string | null;

 
  


  // Acciones del reproductor
  setQueue: (queue: Song[]) => void;
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
  toggleQueue: () => void;
  setShowQueue: (show: boolean) => void;
  toggleExpandedView: () => void;
  setOpenMenuSongId: (songId: string | null) => void;


  addToQueue: (song: Song) => void;
  addNextSong : (song: Song)=> void;
}




export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Estado inicial del reproductor
  currentSong: null,
  isPlaying: false,
  queue: [],
  originalQueue: [],
  currentIndex: -1,
  isShuffleActive: false,
  repeatMode: 0,
  showQueue: false,
  isExpandedViewOpen: false,
  openMenuSongId: null,


  

  // Acciones del reproductor
  initializeQueue: (songs) => {
    set({
      queue: songs,
      originalQueue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs, startIndex = 0) => {
    if (songs.length === 0) return;
    set({
      queue: songs,
      originalQueue: songs,
      currentSong: songs[startIndex],
      currentIndex: startIndex,
      isPlaying: true,
    });
  
  },


  setCurrentSong: (song) => {
    if (!song) return;
    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  playNext: () => {
    const { currentIndex, queue } = get();
    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      set({
        currentSong: queue[nextIndex],
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });
    }
  },

  playPrevious: () => {
    const { currentIndex, queue } = get();
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      set({
        currentSong: queue[prevIndex],
        currentIndex: prevIndex,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });
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
    const shuffledQueue = [...queue].sort(() => Math.random() - 0.5);
    if (currentSong) {
      const currentSongIndex = shuffledQueue.findIndex((song) => song._id === currentSong._id);
      if (currentSongIndex !== -1) {
        const [song] = shuffledQueue.splice(currentSongIndex, 1);
        shuffledQueue.unshift(song);
      }
    }
    set({ queue: shuffledQueue, currentIndex: 0 });
  },

  toggleRepeat: () => set((state) => ({ repeatMode: (state.repeatMode + 1) % 3 })),

  setRepeatMode: (mode) => set({ repeatMode: mode }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setQueue: (queue) => {
    set({ queue });
    const { currentSong } = get();
    if (currentSong && !queue.some((song) => song._id === currentSong._id)) {
      set({ currentSong: queue[0], currentIndex: 0 });
    }
  },
  addToQueue: (song) => {
    set((state) => {
      const newQueue = [...state.queue, song];
      return { queue: newQueue };
    });
  },

  addNextSong: (song) => {
  const { queue, currentIndex } = get();
  // Insertar la canción en la posición siguiente
  const newQueue = [...queue];
  newQueue.splice(currentIndex + 1, 0, song);
  // Solo actualiza la cola, NO cambia la canción actual
  set({
    queue: newQueue,
  });
  toast.success('Canción añadida a continuación');
},

  toggleQueue: () => set((state) => ({ showQueue: !state.showQueue })),

  setShowQueue: (show) => set({ showQueue: show }),

  toggleExpandedView: () => set((state) => ({ isExpandedViewOpen: !state.isExpandedViewOpen })),

  setOpenMenuSongId: (songId) => set({ openMenuSongId: songId }),

 
}));