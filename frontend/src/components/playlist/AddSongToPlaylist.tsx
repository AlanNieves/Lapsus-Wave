import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";

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
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/songs");
        setSongs(res.data);
      } catch (error) {
        console.error("❌ Error al obtener canciones:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSongs();
    }
  }, [user]);

  const handleAddSong = async (songId: string) => {
    try {
      const res = await axiosInstance.patch(`/playlists/${playlistId}/add-song`, {
        songId,
      });

      if (res.status !== 200) throw new Error("No se pudo agregar la canción");

      const updated = res.data;
      onSongAdded(updated);
      onClose();
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
