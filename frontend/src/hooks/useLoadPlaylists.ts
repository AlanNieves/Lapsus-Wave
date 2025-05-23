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
      setPlaylists(data);
    } catch (err) {
      console.error("Error loading playlists:", err);
    }
  };

  return load;
};
