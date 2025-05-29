import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { SignedIn } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useLoadPlaylists } from "@/hooks/useLoadPlaylists";
import { FolderOpen } from "lucide-react"; // o usa Folder si prefieres cerrado


const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  const { playlists } = usePlaylistStore();
  const { showQueue, setShowQueue } = usePlayerStore();

  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const loadPlaylists = useLoadPlaylists();

  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showPlaylists, setShowPlaylists] = useState(true); // nuevo estado

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
            <span className="truncate">Home</span>
          </Link>
          <SignedIn>
            <Link to="/chat" className={cn("w-full justify-start text-lapsus-500 hover:bg-lapsus-1000 p-2 rounded-md transition-colors flex items-center gap-2")}>
              <MessageCircle className="size-5 flex-shrink-0" />
              <span className="truncate">Messages</span>
            </Link>
          </SignedIn>
        </div>
      </div>

      <div className="flex-1 rounded-lg bg-gradient-to-b from-lapsus-1200/30 to-lapsus-900 p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 p-2 rounded-md text-lapsus-500">
          <div className="flex items-center">
            <Library className="size-5 mr-2 flex-shrink-0" />
            <span className="hidden md:inline truncate">{showQueue ? "Now Playing" : "Your Library"}</span>
          </div>
          <div
            onClick={toggleNewPlaylistInput}
            className="cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110"
          >
            {showNewPlaylistInput ? <X className="size-5" /> : <Plus className="size-5" />}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showQueue && (
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
                            <p className="text-sm text-zinc-400 truncate">Album • {album.artist}</p>
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
    </div>
  );
};

export default LeftSidebar;
