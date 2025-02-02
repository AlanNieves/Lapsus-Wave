import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { SignedIn } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle, Music } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Song } from "@/types";
import QueueSkeleton from "@/components/skeletons/QueueListSkeleton"
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { motion, AnimatePresence } from "framer-motion";


const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  const {
    showQueue,
    queue,
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    isShuffleActive,
    originalQueue,
    setShowQueue,
  } = usePlayerStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Fetch albums on component mount
  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  useEffect(() => {
    if(showQueue){
      setShowQueue(false)
    }
  }, [location.pathname, setShowQueue]);

  // Scroll to the active song in the queue
  useEffect(() => {
    if (scrollRef.current && currentSong) {
      const activeItem = scrollRef.current.querySelector(".active-song");
      if (activeItem) {
        activeItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [currentSong, showQueue]);

  // Handle song click
  const handleSongClick = (song: Song) => {
    setCurrentSong(song);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  // Use the original queue if shuffle is active
  const visibleQueue = isShuffleActive ? originalQueue : queue;

  // Animación de entrada difuminada
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Retraso entre la aparición de cada elemento
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation menu */}
      <div className="rounded-lg bg-gradient-to-b from-lapsus-1200/35 to-lapsus-1200/35 p-4">
        <div className="space-y-2">
          <Link
            to={"/"}
            className={cn(
              "w-full justify-start text-lapsus-500 truncate hover:bg-lapsus-1000 p-2 rounded-md transition-colors flex items-center gap-2"
            )}
          >
            <HomeIcon className="size-5 flex-shrink-0" />
            <span className="truncate">Home</span>
          </Link>

          <SignedIn>
            <Link
              to={"/chat"}
              className={cn(
                "w-full justify-start text-lapsus-500 hover:bg-lapsus-1000 p-2 rounded-md transition-colors flex items-center gap-2"
              )}
            >
              <MessageCircle className="size-5 flex-shrink-0" />
              <span className="truncate">Messages</span>
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Library/Queue section */}
      <div className="flex-1 rounded-lg bg-gradient-to-b from-lapsus-1200/30 to-lapsus-900 p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-lapsus-500 px-2">
            <Library className="size-5 mr-2 flex-shrink-0" />
            <span className="hidden md:inline truncate">
              {showQueue ? "Now Playing" : "Your Library"}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showQueue ? (
            <motion.div
              key="queue"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="h-full"
            >
              <ScrollArea className="h-[calc(100vh-220px)]" ref={scrollRef}>
                {isLoading ? (
                  <QueueSkeleton />
                ) : (
                  <motion.div className="space-y-2 pr-2">
                    {visibleQueue.map((song, index) => (
                      <motion.div
                        key={`${song._id}-${index}`}
                        variants={itemVariants}
                        className={cn(
                          "p-2 hover:bg-lapsus-1000 rounded-md flex items-center gap-3 group cursor-pointer relative",
                          currentSong?._id === song._id &&
                            "bg-lapsus-1000/80 active-song border-l-4 border-lapsus-500"
                        )}
                        onClick={() => handleSongClick(song)}
                      >
                        <img
                          src={song.imageUrl}
                          alt="Song cover"
                          className="size-12 rounded-md flex-shrink-0 object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{song.title}</p>
                            {currentSong?._id === song._id && (
                              <Music className="size-4 text-lapsus-500 animate-pulse" />
                            )}
                          </div>
                          <p className="text-sm text-lapsus-800 truncate">
                            {song.artist}
                          </p>
                        </div>
                        {currentSong?._id === song._id && (
                          <div className="absolute top-0 left-0 w-1 h-full bg-lapsus-500 rounded-r-full" />
                        )}
                      </motion.div>
                    ))}
                    {visibleQueue.length === 0 && (
                      <motion.div
                        variants={itemVariants}
                        className="text-center text-lapsus-800 py-4"
                      >
                        Queue is empty
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </ScrollArea>
            </motion.div>
          ) : (
            <motion.div
              key="library"
              variants={containerVariants}
              initial="visible"
              animate="visible"
              exit="hidden"
              className="h-full"
            >
              <ScrollArea className="h-[calc(100vh-220px)]">
                {isLoading ? (
                  <PlaylistSkeleton />
                ) : (
                  <motion.div className="space-y-2 pr-2">
                    {albums.map((album, index) => (
                      <motion.div
                        key={`${album._id}-${index}`}
                        variants={itemVariants}
                      >
                        <Link
                          to={`/albums/${album._id}`}
                          className="p-2 hover:bg-lapsus-1000 rounded-md flex items-center gap-3 group cursor-pointer"
                        >
                          <img
                            src={album.imageUrl}
                            alt="Playlist img"
                            className="size-12 rounded-md flex-shrink-0 object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{album.title}</p>
                            <p className="text-sm text-zinc-400 truncate">
                              Album • {album.artist}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeftSidebar;