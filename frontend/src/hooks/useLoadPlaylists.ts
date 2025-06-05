import { useAuth } from "@clerk/clerk-react";
import { usePlaylistStore } from "@/stores/usePlaylistStore";

export const useLoadPlaylists = () => {
  const { getToken } = useAuth();
  const setPlaylists = usePlaylistStore((state) => state.setPlaylists);

  const load = async () => {
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/playlists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // ✅ Asegurarse que lo que llega es un array
      const playlists = Array.isArray(data) ? data : data.playlists;

      if (Array.isArray(playlists)) {
        setPlaylists(playlists);
      } else {
        console.error("❌ El backend no devolvió un array válido:", data);
        setPlaylists([]); // evitar crasheo
      }
    } catch (err) {
      console.error("Error loading playlists:", err);
      setPlaylists([]); // fallback seguro
    }
  };

  return load;
};