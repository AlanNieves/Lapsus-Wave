import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { axiosInstance } from "@/lib/axios";

export const useLoadPlaylists = () => {
  const setPlaylists = usePlaylistStore((state) => state.setPlaylists);

  const load = async () => {
    try {
      const res = await axiosInstance.get("/playlists");
      const data = res.data;

      const playlists = Array.isArray(data) ? data : data.playlists;

      if (Array.isArray(playlists)) {
        setPlaylists(playlists);
      } else {
        console.error("❌ El backend no devolvió un array válido:", data);
        setPlaylists([]);
      }
    } catch (err) {
      console.error("Error loading playlists:", err);
      setPlaylists([]);
    }
  };

  return load;
};