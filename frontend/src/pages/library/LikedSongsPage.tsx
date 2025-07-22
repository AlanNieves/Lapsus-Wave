import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Song } from "@/types";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const LikedSongsPage = () => {
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const { setCurrentSong, currentSong, isPlaying, togglePlay } = usePlayerStore();

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/library/liked-songs`, {
          withCredentials: true,
        });
        setLikedSongs(data);
      } catch (err) {
        console.error("Error cargando liked songs", err);
        navigate("/login");
      }
    };

    fetchLikedSongs();
  }, [navigate, BASE_URL]);

  const handlePlay = (song: Song) => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };

  const isPlayingThisSong = (song: Song) =>
    currentSong?._id === song._id && isPlaying;

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      setCurrentSong(likedSongs[0]);
    }
  };

  return (
    <div className="rounded-xl h-full w-full flex gap-6 border border-white/20">
      <div className="flex-1 relative">
        {/* Fondo igual que LeftSidebar */}
        <div className="rounded-xl absolute inset-0 bg-gradient-to-b from-[#1f102a]/50 to-[#0d0913]/90 -z-10  border-white/20" />

        <ScrollArea className="h-full rounded-md">
          <div className="relative min-h-full">
            {/* Header */}
            <div className="relative z-10 pt-10 px-10">
              <div className="flex gap-8 pb-10 items-end">
                {/* Corazón animado */}
                <div className="w-[220px] h-[220px] flex items-center justify-center bg-gradient-to-b from-purple-800/30 to-purple-900/20 shadow-xl rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-32 h-32 text-pink-500 animate-heartbeat"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42
                        4.42 3 7.5 3c1.74 0 3.41 0.81
                        4.5 2.09C13.09 3.81 14.76 3
                        16.5 3 19.58 3 22 5.42
                        22 8.5c0 3.78-3.4 6.86-8.55
                        11.54L12 21.35z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex flex-col justify-end w-full">
                  <p className="text-sm font-medium uppercase text-purple-400">
                    Colección
                  </p>
                  <h1 className="text-6xl md:text-7xl font-bold my-3 text-white">
                    Me gusta
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-purple-300">
                    <span>{likedSongs.length} canciones</span>
                    <button
                      onClick={handlePlayAll}
                      className="w-10 h-10 rounded-full bg-gradient-to-b from-purple-500/40 to-purple-700/40 hover:from-purple-500 hover:to-purple-700 flex items-center justify-center shadow-md hover:shadow-lg transition"
                    >
                      <Play className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de canciones */}
            <div className="bg-white/5 backdrop-blur-md border-t border-white/10">
              {/* Encabezado */}
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-3 text-sm text-purple-200 font-medium uppercase tracking-widest">
                <div className="flex justify-end">#</div>
                <div>Título</div>
                <div className="flex justify-start">Artista</div>
                <div className="flex justify-start">Duración</div>
              </div>

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {likedSongs.map((song) => (
                    <div
                      key={song._id}
                      className="group relative grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-white rounded-lg cursor-pointer transition"
                      onClick={() => handlePlay(song)}
                    >
                      {/* Efecto morado al hover */}
                      <div className="absolute inset-0 rounded-lg bg-purple-500/5 opacity-0 group-hover:opacity-100 transition" />

                      {/* Ícono de play */}
                      <div className="relative flex items-center justify-center z-10">
                        {isPlayingThisSong(song) ? (
                          <Play className="h-4 w-4 text-purple-400 fill-current animate-pulse" />
                        ) : (
                          <Play className="h-4 w-4 text-purple-500" />
                        )}
                      </div>

                      {/* Título y cover */}
                      <div className="flex items-center gap-3 z-10">
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="size-10 rounded-md"
                        />
                        <div>
                          <div className="font-semibold text-purple-200 truncate">
                            {song.title}
                          </div>
                          <div className="text-purple-400 text-sm truncate">
                            {song.artist}
                          </div>
                        </div>
                      </div>

                      {/* Artista */}
                      <div className="flex items-center text-purple-400 z-10">
                        {song.artist}
                      </div>

                      {/* Duración */}
                      <div className="flex items-center text-purple-400 z-10">
                        {formatDuration(song.duration)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LikedSongsPage;
