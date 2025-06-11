import { useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { axiosInstance } from "@/lib/axios";

const formatDuration = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
};

const PlaylistSongsTable = ({ playlistId }: { playlistId: string }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const {
    currentSong,
    isPlaying,
    playAlbum,
    togglePlay,
  } = usePlayerStore();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axiosInstance.get(`/playlists/${playlistId}`);
        const data = res.data;
        setSongs(data.songs || []);
      } catch (err) {
        console.error("Error al cargar canciones:", err);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayPause = (song: Song, index: number) => {
    if (!currentSong || currentSong._id !== song._id) {
      playAlbum(filteredSongs, index);
    } else {
      togglePlay();
    }
  };

  return (
    <div className="text-white p-6">
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
            <th className="pb-2">Nombre</th>
            <th className="pb-2">Artista</th>
            <th className="pb-2">Álbum</th>
            <th className="pb-2">Fecha</th>
            <th className="pb-2">Duración</th>
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
            filteredSongs.map((song, index) => {
              const isHovered = hoveredIndex === index;
              const isCurrent = currentSong?._id === song._id;

              return (
                <tr
                  key={song._id}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="border-b border-zinc-800 hover:bg-zinc-800 transition cursor-pointer"
                  onClick={() => handlePlayPause(song, index)}
                >
                  <td className="py-2 w-8">
                    {isCurrent ? (
                      isPlaying ? <Pause size={18} /> : <Play size={18} />
                    ) : isHovered ? (
                      <Play size={18} />
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td className="py-2">{song.title}</td>
                  <td className="py-2">{song.artist}</td>
                  <td className="py-2">{song.albumId}</td>
                  <td className="py-2">{new Date(song.createdAt).toLocaleDateString()}</td>
                  <td className="py-2">{formatDuration(song.duration)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PlaylistSongsTable;