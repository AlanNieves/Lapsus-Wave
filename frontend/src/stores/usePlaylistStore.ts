import { create } from "zustand";
import { Playlist } from "@/types";

interface PlaylistStore {
  playlists: Playlist[];
  setPlaylists: (playlists: Playlist[]) => void;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  setPlaylists: (playlists) => set({ playlists }),
}));
