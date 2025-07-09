import { axiosInstance } from "@/lib/axios";
import { User, Playlist } from "@/types";

// ✅ Obtener perfil público
export const fetchUserProfile = async (id: string): Promise<User> => {
  const { data } = await axiosInstance.get(`/users/${id}`, { withCredentials: true });
  return data;
};

// ✅ Obtener playlists del usuario
export const fetchUserPlaylists = async (userId: string): Promise<Playlist[]> => {
  const { data } = await axiosInstance.get(`/playlists/user/${userId}`, { withCredentials: true });
  return Array.isArray(data) ? data : data.playlists || [];
};

// ✅ Seguir usuario
export const followUser = async (userId: string) => {
  const { data } = await axiosInstance.post(`/follow/${userId}`, null, { withCredentials: true });
  return data;
};

// ✅ Enviar mensaje
export const sendMessage = async (receiverId: string, message: string) => {
  const { data } = await axiosInstance.post(
    `/messages/${receiverId}`,
    { message },
    { withCredentials: true }
  );
  return data;
};
