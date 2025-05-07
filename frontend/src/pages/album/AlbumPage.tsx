import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import SongOptionsMenu from "@/layout/components/SongMenu";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay, isMenuOpen, setIsMenuOpen } = usePlayerStore();

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
  }, [fetchAlbumById, albumId]);

  if (isLoading) return null;

  const isAlbumPlaying = currentAlbum?.songs.some(
    (song) => song._id === currentSong?._id
  );

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    if (isAlbumPlaying) {
      togglePlay();
    } else {
      playAlbum(currentAlbum.songs, 0);
    }
  };

  const handleSongClick = (index: number) => {
    if (!currentAlbum) return;
    
    if (currentSong?._id === currentAlbum.songs[index]._id) {
      togglePlay();
    } else {
      playAlbum(currentAlbum.songs, index);
    }
  };

  return (
    <div className="h-full flex">
      <div className="flex-1">
        <ScrollArea className="h-full rounded-md">
          <div className="relative min-h-full">
            <div
              className="absolute inset-0 bg-gradient-to-b from-lapsus-1000 via-lapsus-1000 to-red-1000 pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div className="flex p-6 gap-6 pb-8">
                <img
                  src={currentAlbum?.imageUrl}
                  alt={currentAlbum?.title}
                  className="w-[240px] h-[240px] shadow-xl rounded"
                />
                <div className="flex flex-col justify-end">
                  <p className="text-sm font-medium">Album</p>
                  <h1 className="text-7xl font-bold my-4">{currentAlbum?.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-zinc-100">
                    <span className="font-medium text-white">{currentAlbum?.artist}</span>
                    <span>• {currentAlbum?.songs.length} songs</span>
                    <span>• {currentAlbum?.releaseYear}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-4 flex items-center gap-6">
                <Button
                  onClick={handlePlayAlbum}
                  size="icon"
                  className="w-14 h-14 rounded-full bg-lapsus-1200 hover:bg-lapsus-1100 hover:scale-105 transition-all"
                >
                  {isAlbumPlaying && isPlaying ? (
                    <Pause className="h-7 w-7 text-lapsus-500 fill-current" />
                  ) : (
                    <Play className="h-7 w-7 text-lapsus-500 fill-current" />
                  )}
                </Button>
              </div>

              <div className="bg-black/20 backdrop-blur-sm">
                <div className="grid grid-cols-[16px_4fr_2fr_1fr_auto] gap-4 px-10 py-2 text-sm text-lapsus-100">
                  <div className="flex justify-end -translate-x-[3px]">#</div>
                  <div>Title</div>
                  <div className="flex justify-start -translate-x-[55px]">Added Date</div>
                  <div className="flex justify-start -translate-x-[78px]">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>

                <div className="px-6">
                  <div className="space-y-2 py-4">
                    {currentAlbum?.songs.map((song, index) => {
                      const isCurrentSong = currentSong?._id === song._id;
                      return (
                        <div
                          key={`${song._id}-${index}`}
                          onMouseLeave={() => isMenuOpen && setIsMenuOpen(false)}
                          className="grid grid-cols-[16px_4fr_2fr_1fr_auto] gap-4 px-4 py-2 text-sm text-lapsus-800 hover:bg-lapsus-1000 rounded-md group cursor-pointer"
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
                              className="size-10"
                            />
                            <div>
                              <div className="font-medium text-lapsus-500">
                                {song.title}
                              </div>
                              <div>{song.artist}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {song.createdAt.split("T")[0]}
                          </div>
                          <div className="flex items-center">
                            {formatDuration(song.duration)}
                          </div>
                          <div
                            className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SongOptionsMenu song={song} playlistId={""} />
                          </div>
                        </div>
                      );
                    })}
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

export default AlbumPage;