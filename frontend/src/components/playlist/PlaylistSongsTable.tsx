import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

interface Song {
  _id: string;
  title: string;
  artist: string;
  album: string;
  createdAt: string;
  duration: number;
}

const formatDuration = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
};

const PlaylistSongsTable = ({ playlistId }: { playlistId: string }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/playlists/${playlistId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("No autorizado");

        const data = await res.json();
        setSongs(data.songs || []);
      } catch (err) {
        console.error("Error al cargar canciones:", err);
      }
    };

    fetchPlaylist();
  }, [playlistId, getToken]);

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-white p-6">
      {/* Input de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar canción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded bg-zinc-800 text-white w-full max-w-xs outline-none"
        />
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-zinc-700">
            <th className="pb-2">#</th>
            <th className="pb-2">Name</th>
            <th className="pb-2">Artist</th>
            <th className="pb-2">Album</th>
            <th className="pb-2">Date</th>
            <th className="pb-2">Length</th>
          </tr>
        </thead>
        <tbody>
          {filteredSongs.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-4 text-center text-zinc-400">
                No se encontraron canciones.
              </td>
            </tr>
          ) : (
            filteredSongs.map((song, index) => (
              <tr
                key={song._id}
                className="border-b border-zinc-800 hover:bg-zinc-800 transition"
              >
                <td className="py-2">{index + 1}</td>
                <td className="py-2">{song.title}</td>
                <td className="py-2">{song.artist}</td>
                <td className="py-2">{song.album}</td>
                <td className="py-2">{new Date(song.createdAt).toLocaleDateString()}</td>
                <td className="py-2">{formatDuration(song.duration)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PlaylistSongsTable;
