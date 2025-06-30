import { axiosInstance } from "@/lib/axios";
import { User, Playlist } from "@/types"; // Asegúrate de tener estos tipos definidos

// Obtener el perfil público de un usuario por ID
export const fetchUserProfile = async (id: string): Promise<User> => {
  const { data } = await axiosInstance.get(`/users/${id}`);
  return data;
};

// Obtener playlists creadas por el usuario
export const fetchUserPlaylists = async (userId: string): Promise<Playlist[]> => {
  const { data } = await axiosInstance.get(`/playlists/user/${userId}`);
  return Array.isArray(data) ? data : data.playlists || [];
};

// (Opcional) Seguir a un usuario
export const followUser = async (userId: string) => {
  const { data } = await axiosInstance.post(`/follow/${userId}`);
  return data;
};

// (Opcional) Enviar un mensaje
export const sendMessage = async (receiverId: string, message: string) => {
  const { data } = await axiosInstance.post(`/messages/${receiverId}`, { message });
  return data;
};
