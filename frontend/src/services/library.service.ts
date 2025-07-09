import { axiosInstance } from "@/lib/axios";

export const toggleLikedSong = async (songId: string) => {
  const { data } = await axiosInstance.post(
    `/library/liked-songs/${songId}`,
    {},
    { withCredentials: true }
  );
  return data; 
};

export const toggleSavedAlbum = async (
  albumId: string
): Promise<{ success: boolean; saved: boolean }> => {
  const { data } = await axiosInstance.post(
    `/library/saved-albums/${albumId}`,
    {},
    { withCredentials: true }
  );
  return data;
};

