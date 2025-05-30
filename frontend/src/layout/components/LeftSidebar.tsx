import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { translations } from "@/locales";
import { SignedIn } from "@clerk/clerk-react";
import {
  HomeIcon,
  Library,
  MessageCircle,
  Plus,
  X,
  Music,
  Globe,
  FolderOpen,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import QueueSkeleton from "@/components/skeletons/QueueListSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useLoadPlaylists } from "@/hooks/useLoadPlaylists";
import { Song } from "@/types";

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

  const { playlists } = usePlaylistStore();
  const { getToken } = useAuth();
  const { language, toggleLanguage } = useLanguageStore();
  const t = translations[language];

  const loadPlaylists = useLoadPlaylists();
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showPlaylists, setShowPlaylists] = useState(true);

  useEffect(() => {
    fetchAlbums();
    loadPlaylists();
  }, []);

  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      setShowQueue(false);
      previousPath.current = location.pathname;
    }
  }, [location.pathname, setShowQueue, showQueue]);

  const handleSongClick = (song: Song) => {
    setCurrentSong(song);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const visibleQueue = isShuffleActive ? queue : originalQueue;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const toggleNewPlaylistInput = () => {
    setShowNewPlaylistInput((prev) => !prev);
    setNewPlaylistName("");
  };

  const handleNewPlaylistKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newPlaylistName.trim() !== "") {
      try {
        const token = await getToken();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/playlists`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newPlaylistName.trim(),
            description: "",
            isPublic: false,
          }),
        });

        if (!response.ok) throw new Error("Failed to create playlist");

        const data = await response.json();
        setShowNewPlaylistInput(false);
        setNewPlaylistName("");
        await loadPlaylists();
        navigate(`/playlists/${data._id}`);
      } catch (err) {
        console.error("Error creating playlist:", err);
      }
    }
  };

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="rounded-lg bg-gradient-to-b from-lapsus-1200/35 to-lapsus-1200/35 p-4">
        <div className="space-y-2">
          <Link to="/" className={cn("w-full justify-start text-lapsus-500 truncate hover:bg-lapsus-1000 p-2 rounded-md transition-colors flex items-center gap-2")}>
            <HomeIcon className="size-5 flex-shrink-0" />
            <span className="truncate">{t.home}</span>
          </Link>
          <SignedIn>
            <Link to="/chat" className={cn("w-full justify-start text-lapsus-500 hover:bg-lapsus-1000 p-2 rounded-md transition-colors flex items-center gap-2")}>
              <MessageCircle className="size-5 flex-shrink-0" />
              <span className="truncate">{t.messages}</span>
            </Link>
          </SignedIn>
        </div>
      </div>

      <div className="flex-1 rounded-lg bg-gradient-to-b from-lapsus-1200/30 to-lapsus-900 p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 p-2 rounded-md text-lapsus-500">
          <div className="flex items-center">
            <Library className="size-5 mr-2 flex-shrink-0" />
            <span className="hidden md:inline truncate">
              {showQueue ? t.nowPlaying : t.library}
            </span>
          </div>
          <div
            onClick={toggleNewPlaylistInput}
            className="cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110"
          >
            {showNewPlaylistInput ? <X className="size-5" /> : <Plus className="size-5" />}
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
              <ScrollArea className="h-full" ref={scrollRef}>
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
                        {t.queueEmpty}
                      </motion.div>
                    )}
                  </motion.div>
                )}
                <motion.div className="h-8" />
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
                    {/* Álbumes */}
                    {albums.map((album, index) => (
                      <motion.div key={`${album._id}-${index}`} variants={itemVariants}>
                        <Link to={`/albums/${album._id}`} className="p-2 hover:bg-lapsus-1000 rounded-md flex items-center gap-3 group cursor-pointer">
                          <img src={album.imageUrl} alt="Album cover" className="size-12 rounded-md flex-shrink-0 object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{album.title}</p>
                            <p className="text-sm text-zinc-400 truncate">{t.album} • {album.artist}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}

                    {/* Toggle de Playlists */}
                    <div
                      onClick={() => setShowPlaylists((prev) => !prev)}
                      className="flex items-center justify-between mb-2 p-2 rounded-md text-lapsus-500 hover:bg-lapsus-1000 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-2">
                        <FolderOpen className="size-5 flex-shrink-0" />
                        <span className="truncate">Playlists</span>
                      </div>
                      <span className="text-sm">{showPlaylists ? "−" : "+"}</span>
                    </div>

                    {/* Playlists */}
                    {showPlaylists && playlists.map((playlist) => {
                      const imageUrl = playlist.coverImage
                        ? playlist.coverImage.startsWith("http")
                          ? playlist.coverImage
                          : `${import.meta.env.VITE_API_URL}/uploads/${playlist.coverImage}`
                        : "/default-playlist-cover.png";

                      return (
                        <Link
                          key={playlist._id}
                          to={`/playlists/${playlist._id}`}
                          className="p-2 hover:bg-lapsus-1000 rounded-md flex items-center gap-3 group cursor-pointer"
                        >
                          <img
                            src={imageUrl}
                            alt="Playlist cover"
                            className="w-12 h-12 aspect-square object-cover rounded-md flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{playlist.name}</p>
                            <p className="text-sm text-zinc-400 truncate">Playlist</p>
                          </div>
                        </Link>
                      );
                    })}

                    {/* Input para nueva playlist */}
                    {showNewPlaylistInput && (
                      <div className="px-2 pb-2">
                        <input
                          type="text"
                          placeholder="New Playlist"
                          className="w-full px-3 py-2 rounded-md bg-lapsus-1000 text-white placeholder:text-zinc-400 outline-none"
                          value={newPlaylistName}
                          onChange={(e) => setNewPlaylistName(e.target.value)}
                          onKeyDown={handleNewPlaylistKeyDown}
                          autoFocus
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Language toggle button */}
      <Tooltip
        text={language === 'en' ? "Cambiar a español" : "Change to English"}
        position="top"
      >
        <Button
          size="icon"
          variant="ghost"
          className="hover:text-white text-lapsus-500 w-full"
          onClick={toggleLanguage}
        >
          <Globe className="h-4 w-4" />
          <span className="ml-2">{language === 'en' ? 'ES' : 'EN'}</span>
        </Button>
      </Tooltip>
    </div>
  );
};

export default LeftSidebar;

