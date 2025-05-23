import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { Playlist } from "@/types";
import toast from "react-hot-toast";

interface PlaylistStore {
  currentPlaylist: Playlist | null;
  userPlaylists: Playlist[];
  isLoading: boolean;
  error: string | null;
 
  // Acciones
  fetchPlaylistById: (id: string) => Promise<void>;
  fetchUserPlaylists: () => Promise<void>;
  createPlaylist: (name: string, description?: string, isPublic?: boolean) => Promise<void>;
  addSongsToPlaylist: (playlistId: string, songIds: string[]) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  updatePlaylist: (
    id: string, 
    updates: { 
      name?: string; 
      description?: string; 
      isPublic?: boolean;
      coverImage?: string 
    }
  ) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  currentPlaylist: null,
  userPlaylists: [],
  isLoading: false,
  error: null,

  fetchPlaylistById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/playlists/${id}`);
      set({ currentPlaylist: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Error fetching playlist" });
      toast.error("Failed to load playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserPlaylists: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/playlists");
      set({ userPlaylists: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Error fetching playlists" });
    } finally {
      set({ isLoading: false });
    }
  },

  createPlaylist: async (name, description = "", isPublic = false) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/playlists", { 
        name, 
        description, 
        isPublic 
      });
      set((state) => ({ 
        userPlaylists: [response.data, ...state.userPlaylists] 
      }));
      toast.success("Playlist created!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  addSongsToPlaylist: async (playlistId, songIds) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.patch(`/playlists/${playlistId}/songs`, {songIds});
      set((state) => {
        if (state.currentPlaylist?._id === playlistId) {
          return {
            currentPlaylist: {
              ...state.currentPlaylist,
              songs: [...state.currentPlaylist.songs, ...response.data.addedSongs],
            },
          };
        }
        return {};
      });
      toast.success("Song added to playlist");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error adding song");
    } finally {
      set({ isLoading: false });
    }
  },

  removeSongFromPlaylist: async (playlistId, songId) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/playlists/${playlistId}/songs/${songId}`);
      set((state) => {
        if (state.currentPlaylist?._id === playlistId) {
          return {
            currentPlaylist: {
              ...state.currentPlaylist,
              songs: state.currentPlaylist.songs.filter(
                (song) => song._id !== songId
              ),
            },
          };
        }
        return {};
      });
      toast.success("Song removed from playlist");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error removing song");
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/playlists/${id}`);
      set((state) => ({
        userPlaylists: state.userPlaylists.filter(
          (playlist) => playlist._id !== id
        ),
        currentPlaylist: 
          state.currentPlaylist?._id === id ? null : state.currentPlaylist,
      }));
      toast.success("Playlist deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error deleting playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  updatePlaylist: async (id, updates) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/playlists/${id}`, updates);
      set((state) => ({
        userPlaylists: state.userPlaylists.map((playlist) =>
          playlist._id === id ? response.data : playlist
        ),
        currentPlaylist:
          state.currentPlaylist?._id === id
            ? response.data
            : state.currentPlaylist,
      }));
      toast.success("Playlist updated");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating playlist");
    } finally {
      set({ isLoading: false });
    }
  },
}));