import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Song } from "@/types";
import {axiosInstance} from "@/lib/axios";
import { ScrollArea } from "@/components/ui/scroll-area";
/*import { Button } from "@/components/ui/button";*/
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
        const { data } = await axiosInstance.get(`${BASE_URL}/library/liked-songs`, {
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
    <div className="h-full w-full flex gap-6">
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-lapsus-1200/35 to-lapsus-900 -z-10" />
        <ScrollArea className="h-full rounded-md">
          <div className="relative min-h-full">
            {/* Header */}
            <div className="relative z-10 pt-10 px-10">
              <div className="flex gap-8 pb-10 items-end">
                <img
                  src="/heart-8bit.png"
                  alt="Liked Songs"
                  className="w-[220px] h-[220px] shadow-xl rounded-xl object-contain bg-white/10 p-4"
                />
                <div className="flex flex-col justify-end w-full">
                  <p className="text-sm font-medium uppercase text-lapsus-400">
                    Colección
                  </p>
                  <h1 className="text-6xl md:text-7xl font-bold my-3 text-white">
                    Me gusta
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-lapsus-300">
                    <span>{likedSongs.length} canciones</span>
                    <button
                      onClick={handlePlayAll}
                      className="w-10 h-10 rounded-full bg-pink-800 hover:bg-pink-700 flex items-center justify-center shadow-md transition"
                    >
                      <Play className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de canciones */}
            <div className="bg-white/5 backdrop-blur-md border-t border-white/10">
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-3 text-sm text-lapsus-100 font-medium uppercase tracking-widest">
                <div className="flex justify-end">#</div>
                <div>Título</div>
                <div className="flex justify-start">Artista</div>
                <div className="flex justify-start">Duración</div>
              </div>

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {likedSongs.map((song, /*index*/) => (
                    <div
                      key={song._id}
                      className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-white hover:bg-white/10 rounded-lg group cursor-pointer transition"
                      onClick={() => handlePlay(song)}
                    >
                      <div className="flex items-center justify-center">
                        {isPlayingThisSong(song) ? (
                          <Play className="h-4 w-4 text-lapsus-300 fill-current animate-pulse" />
                        ) : (
                          <Play className="h-4 w-4 text-lapsus-500" />
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="size-10 rounded-md"
                        />
                        <div>
                          <div className="font-semibold text-lapsus-300">
                            {song.title}
                          </div>
                          <div className="text-lapsus-400 text-sm">{song.artist}</div>
                        </div>
                      </div>

                      <div className="flex items-center text-lapsus-400">
                        {song.artist}
                      </div>
                      <div className="flex items-center text-lapsus-400">
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
