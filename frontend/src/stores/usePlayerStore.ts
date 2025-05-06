import { create } from "zustand";
import { Playlist, Song } from "@/types";



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
  isMenuOpen: boolean;
  isMuted: boolean;

  // Estado de las playlists
  playlists: Playlist[];

  showPlaylists: boolean;

  // Acciones del reproductor
  setQueue: (queue: Song[]) => void;
  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  reproducePlaylist:(songs: Song[], startIndex?: number) =>void;
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
  setIsMenuOpen: (show: boolean) => void;
  toggleMute: () => void;

  // Acciones de las playlists
  createPlaylist: (name: string, description?: string) => Playlist;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  updatePlaylist: (id: string, data: { name?: string; description?: string; imageUrl?: string }) => void;
  deletePlaylist: (playlistId: string) => void;
  
  toggleShowPlaylists: () => void;
}

//guardar funcion para cargar las playlists desde localstorage
const loadPlaylists = (): Playlist[] => {
  const playlists = localStorage.getItem("playlists");
  return playlists ? JSON.parse(playlists) : [];
};

const savePlaylists = (playlists: Playlist[]) => {
  localStorage.setItem("playlists", JSON.stringify(playlists));
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
  isMenuOpen: false,

  // Estado inicial de las playlists
  playlists: loadPlaylists(),
  currentPlaylist: null,
  showPlaylists: false,

  toggleShowPlaylists: () => set((state) => ({ showPlaylists: !state.showPlaylists })),

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
  reproducePlaylist :(songs, startIndex = 0) => {
      if(songs.length === 0) return;
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

  toggleQueue: () => set((state) => ({ showQueue: !state.showQueue })),

  setShowQueue: (show) => set({ showQueue: show }),

  toggleExpandedView: () => set((state) => ({ isExpandedViewOpen: !state.isExpandedViewOpen })),

  setIsMenuOpen: (show) => set({ isMenuOpen: show }),

  // Acciones de las playlists
  createPlaylist: (name, description = "") => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      songs: [],
      imageUrl: "",
    };
    set((state) => {
      const updatedPlaylists = [...state.playlists, newPlaylist];
      savePlaylists(updatedPlaylists);
      return { playlists: updatedPlaylists };
    });
    return newPlaylist;
  },

  updatePlaylist: (id, data) => {
    set((state) => {
      const updatedPlaylists = state.playlists.map((playlist) =>
        playlist.id === id ? { ...playlist, ...data } : playlist
      );
      savePlaylists(updatedPlaylists);
      return { playlists: updatedPlaylists };
    });
  },

  addSongToPlaylist: (playlistId, song) => {
    set((state) => {
      const updatedPlaylists = state.playlists.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, songs: [...playlist.songs, song] }
          : playlist
      );
      savePlaylists(updatedPlaylists);
      return { playlists: updatedPlaylists };
    });
  },

  removeSongFromPlaylist: (playlistId, songId) => {
    set((state) => {
      const updatedPlaylists = state.playlists.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, songs: playlist.songs.filter((s) => s._id !== songId) }
          : playlist
      );
      savePlaylists(updatedPlaylists);
      return { playlists: updatedPlaylists };
    });
  },

  deletePlaylist: (id) => {
    set((state) => {
      const updatedPlaylists = state.playlists.filter((playlist) => playlist.id !== id);
      savePlaylists(updatedPlaylists);
      return { playlists: updatedPlaylists };
    });
  },

  isMuted: false,

  toggleMute: () =>
    set((state) => ({
      isMuted: !state.isMuted
    })),




  
}));