import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

interface Song {
  _id: string;
  title: string;
  artist: string;
}

interface AddSongToPlaylistProps {
  playlistId: string;
  onClose: () => void;
  onSongAdded: (updated: any) => void;
}

const AddSongToPlaylist = ({ playlistId, onClose, onSongAdded }: AddSongToPlaylistProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/songs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setSongs(data);
      } catch (error) {
        console.error("❌ Error al obtener canciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [getToken]);

  const handleAddSong = async (songId: string) => {
    try {
      const token = await getToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/playlists/${playlistId}/add-song`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ songId }),
        }
      );

      if (!res.ok) throw new Error("No se pudo agregar la canción");

      const updated = await res.json();
      onSongAdded(updated); // ✅ Pasamos la playlist actualizada al padre
      onClose(); // ✅ Opcional: cerrar el modal al agregar canción
    } catch (error) {
      console.error("❌ Error agregando canción:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-neutral-900 p-6 rounded-lg w-full max-w-md text-white relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-sm bg-red-600 px-2 py-1 rounded"
        >
          Cerrar
        </button>
        <h2 className="text-xl font-semibold mb-4">Agregar canción a playlist</h2>
        {loading ? (
          <p className="text-zinc-300">Cargando canciones...</p>
        ) : (
          <ul className="space-y-2 max-h-[300px] overflow-y-auto">
            {songs.map((song) => (
              <li key={song._id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-zinc-400">{song.artist}</p>
                </div>
                <button
                  onClick={() => handleAddSong(song._id)}
                  className="bg-emerald-600 px-2 py-1 rounded text-sm"
                >
                  Agregar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddSongToPlaylist;
