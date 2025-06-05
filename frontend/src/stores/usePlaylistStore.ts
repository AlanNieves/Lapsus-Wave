import { create } from "zustand";
import { Playlist } from "@/types";

interface PlaylistStore {
  [x: string]: any;
  playlists: Playlist[];
  setPlaylists: (playlists: Playlist[]) => void;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  setPlaylists: (playlists) => set({ playlists }),

  updatePlaylistCover: (id: string, coverImage: string) => {
    set((state) => ({
      playlists: state.playlists.map((pl) => 
        pl._id === id ? {...pl, coverImage } : pl
      ),
    }))
  }
}));

