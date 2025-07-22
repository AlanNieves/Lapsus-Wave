import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { translations } from "@/locales";
import { Pause, Play, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MusicSearch from "@/layout/components/MusicSearch/MusicSearch";
import { toggleLikedSong } from "@/services/library.service";
import axios from "axios";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const SongPage = () => {
  const { songId } = useParams();
  const { fetchSongById, currentSongData, isLoading } = useMusicStore();
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const [isLiked, setIsLiked] = useState(false);
  const [animate, setAnimate] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (songId) {
      fetchSongById(songId);
      checkIfLiked(songId);
    }
  }, [songId]);

  const checkIfLiked = async (songId: string) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/library/liked-songs`, {
        withCredentials: true,
      });
      const liked = data.some((song: any) => song._id === songId);
      setIsLiked(liked);
    } catch (err) {
      console.error("Error al verificar canción favorita", err);
    }
  };

  if (isLoading || !currentSongData) return null;

  const isPlayingThisSong = currentSong?._id === currentSongData._id;

  const handlePlay = () => {
    if (isPlayingThisSong) {
      togglePlay();
    } else {
      setCurrentSong(currentSongData);
    }
  };

  const handleToggleLike = async () => {
    try {
      await toggleLikedSong(currentSongData._id);
      setIsLiked((prev) => !prev);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 400);
    } catch (err) {
      console.error("Error al dar like a la canción", err);
    }
  };

  return (
    <div className="h-full flex gap-6">
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1f102a]/50 to-[#0d0913]/90"/>

        <ScrollArea className="h-full rounded-md">
          <div className="relative min-h-full px-6 py-8">
            <div className="flex gap-6 mb-10">
              <img
                src={currentSongData.imageUrl}
                alt={currentSongData.title}
                className="w-60 h-60 shadow-xl rounded-xl object-cover border border-white/10"
              />

              <div className="flex flex-col justify-end">
                <p className="text-sm text-lapsus-400 font-semibold tracking-wide">SINGLE</p>
                <h1 className="text-5xl md:text-7xl font-bold my-3 text-white">
                  {currentSongData.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-lapsus-300">
                  <span className="font-medium text-lapsus-500">
                    {currentSongData.artist}
                  </span>
                  <span>• 1 {t.songs?.toLowerCase() || "canción"}</span>
                  <span>• {currentSongData.createdAt.split("T")[0]}</span>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <Button
                    onClick={handlePlay}
                    size="icon"
                    className="w-14 h-14 rounded-full bg-lapsus-1200 hover:bg-lapsus-1100 hover:scale-105 transition-all shadow-xl"
                  >
                    {isPlayingThisSong && isPlaying ? (
                      <Pause className="h-7 w-7 text-lapsus-500 fill-current" />
                    ) : (
                      <Play className="h-7 w-7 text-lapsus-500 fill-current" />
                    )}
                  </Button>

                  <button
                    onClick={handleToggleLike}
                    title={isLiked ? "Quitar de Me gusta" : "Agregar a Me gusta"}
                    className={`transition-transform duration-200 ${
                      animate ? "animate-ping-once" : "hover:scale-105"
                    }`}
                  >
                    <Heart
                      className={`w-8 h-8 ${
                        isLiked ? "text-red-500 fill-red-500" : "text-white hover:text-red-500"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end w-full mb-4">
              <div className="w-[300px]">
                <MusicSearch
                  tracks={[{
                    _id: currentSongData._id,
                    title: currentSongData.title,
                    artist: currentSongData.artist,
                    duration: formatDuration(currentSongData.duration),
                    imageUrl: currentSongData.imageUrl,
                  }]}
                  onResultSelect={() => handlePlay()}
                  placeholder={t.searchPlaceholder || "¿Qué canción buscas?"}
                />
              </div>
            </div>

            <div className="bg-black/30 border border-white/10 backdrop-blur-md rounded-xl overflow-hidden">
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-8 py-3 text-sm text-lapsus-400 border-b border-white/10">
                <div className="text-right">#</div>
                <div>{t.title || "Título"}</div>
                <div>{t.date || "Fecha"}</div>
                <div>{t.duration || "Duración"}</div>
              </div>

              <div className="px-6 py-4">
                <div
                  className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 rounded-lg cursor-pointer hover:bg-lapsus-1000 transition-colors"
                  onClick={handlePlay}
                >
                  <div className="flex items-center justify-center">
                    {isPlayingThisSong ? (
                      isPlaying ? (
                        <Pause className="h-4 w-4 text-lapsus-1100 fill-current" />
                      ) : (
                        <Play className="h-4 w-4 text-lapsus-1100 fill-current" />
                      )
                    ) : (
                      <Play className="h-4 w-4 text-lapsus-500" />
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={currentSongData.imageUrl}
                      alt={currentSongData.title}
                      className="w-10 h-10 rounded-sm object-cover"
                    />
                    <div>
                      <div className="font-medium text-lapsus-500">
                        {currentSongData.title}
                      </div>
                      <Link
                        to={`/artist/${currentSongData.artistId}`}
                        className="text-lapsus-400 hover:underline"
                      >
                        {currentSongData.artist}
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center text-lapsus-400">
                    {currentSongData.createdAt.split("T")[0]}
                  </div>

                  <div className="flex items-center text-lapsus-400">
                    {formatDuration(currentSongData.duration)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SongPage;
