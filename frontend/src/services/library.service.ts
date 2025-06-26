import { axiosInstance } from "@/lib/axios";

export const toggleLikedSong = async (songId: string) => {
  return axiosInstance.post(`/library/liked-songs/${songId}`, {}, { withCredentials: true });
};

export const toggleSavedAlbum = async (albumId: string) => {
  return axiosInstance.post(`/library/saved-albums/${albumId}`, {}, { withCredentials: true });
};
