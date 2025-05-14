import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import MusicSearch from "@/layout/components/MusicSearch/MusicSearch";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
  const { 
    currentSong, 
    isPlaying, 
    playAlbum, 
    togglePlay
  } = usePlayerStore();

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
  }, [fetchAlbumById, albumId]);

  if (isLoading) return null;

  const isAlbumPlaying = currentAlbum?.songs.some(
    (song) => song._id === currentSong?._id
  );

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;
    isAlbumPlaying ? togglePlay() : playAlbum(currentAlbum.songs, 0);
  };

  const handleSongClick = (index: number) => {
    if (!currentAlbum) return;
    currentSong?._id === currentAlbum.songs[index]._id 
      ? togglePlay() 
      : playAlbum(currentAlbum.songs, index);
  };

  return (
    <div className="h-full flex gap-6">
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-lapsus-1000 via-lapsus-1000 to-lapsus-1000 -z-10" />
        <ScrollArea className="h-full rounded-md">
          <div className="relative min-h-full">
            {/* Fondo gradiente */}
            <div className="absolute inset-0 bg-gradient-to-b from-lapsus-1000 via-lapsus-1000 to-red-1000 pointer-events-none" />

            {/* Encabezado del álbum */}
            <div className="relative z-10 pt-6 px-6 bg-lapsus-1000">
              <div className="flex gap-6 pb-8">
                <img
                  src={currentAlbum?.imageUrl}
                  alt={currentAlbum?.title}
                  className="w-[240px] h-[240px] shadow-xl rounded object-cover"
                />
                <div className="flex flex-col justify-end">
                  <p className="text-sm font-medium">Álbum</p>
                  <h1 className="text-5xl md:text-7xl font-bold my-4 text-white">
                    {currentAlbum?.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-zinc-100">
                    <span className="font-medium text-white">{currentAlbum?.artist}</span>
                    <span>• {currentAlbum?.songs.length} canciones</span>
                    <span>• {currentAlbum?.releaseYear}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra fija con controles */}
            <div className="sticky top-0 z-50 bg-gradient-1000 from-black/80 to-transparent backdrop-blur-sm">
              <div className="flex items-center justify-between px-6 py-4">
                <Button
                  onClick={handlePlayAlbum}
                  size="icon"
                  className="w-14 h-14 rounded-full bg-lapsus-1200 hover:bg-lapsus-1100 hover:scale-105 transition-all shadow-xl"
                >
                  {isAlbumPlaying && isPlaying ? (
                    <Pause className="h-7 w-7 text-lapsus-500 fill-current" />
                  ) : (
                    <Play className="h-7 w-7 text-lapsus-500 fill-current" />
                  )}
                </Button>

                <div className="w-[300px] mr-6">
                  <MusicSearch
                    tracks={currentAlbum?.songs.map(song => ({
                      _id: song._id,
                      title: song.title,
                      artist: song.artist,
                      duration: formatDuration(song.duration),
                      imageUrl: song.imageUrl
                    })) || []}
                    onResultSelect={(track) => {
                      const index = currentAlbum?.songs.findIndex(s => s._id === track._id);
                      if (index !== undefined && index >= 0) handleSongClick(index);
                    }}
                    placeholder="¿Qué canción buscas?"
                  />
                </div>
              </div>
            </div>

            {/* Lista de canciones */}
            <div className="bg-black/20 backdrop-blur-sm">
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-lapsus-100">
                <div className="flex justify-end">#</div>
                <div>Título</div>
                <div className="flex justify-start">Fecha</div>
                <div className="flex justify-start">Duración</div>
              </div>

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentAlbum?.songs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={`${song._id}-${index}`}
                        className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-lapsus-800 hover:bg-lapsus-1000 rounded-md group cursor-pointer"
                      >
                        <div 
                          className="flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSongClick(index);
                          }}
                        >
                          {isCurrentSong ? (
                            isPlaying ? (
                              <Pause className="h-4 w-4 text-lapsus-1100 fill-current" />
                            ) : (
                              <Play className="h-4 w-4 text-lapsus-1100 fill-current" />
                            )
                          ) : (
                            <>
                              <span className="group-hover:hidden">{index + 1}</span>
                              <Play className="h-4 w-4 hidden group-hover:block text-lapsus-500" />
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="size-10 rounded-sm"
                          />
                          <div>
                            <div className="font-medium text-lapsus-500">
                              {song.title}
                            </div>
                            <div className="text-lapsus-400">{song.artist}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-lapsus-400">
                          {song.createdAt.split("T")[0]}
                        </div>
                        <div className="flex items-center text-lapsus-400">
                          {formatDuration(song.duration)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AlbumPage;