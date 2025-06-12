import { useEffect, useState, useRef } from "react";
import { Play, Shuffle, Plus, Pencil, MoreVertical, Trash, Check } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useNavigate } from "react-router-dom";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { motion } from "framer-motion";
import type { Song } from "@/types";
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosInstance } from "@/lib/axios";

interface Playlist {
  _id: string;
  name: string;
  description: string;
  coverImage?: string;
  songs: Song[];
}

interface PlaylistHeaderProps {
  playlistId: string;
  onOpenAddSongModal: () => void;
}

const PlaylistHeader = ({ playlistId, onOpenAddSongModal }: PlaylistHeaderProps) => {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hovering, setHovering] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { updatePlaylistCover } = usePlaylistStore();
  const { playAlbum, toggleShuffle } = usePlayerStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axiosInstance.get(`/playlists/${playlistId}`);
        const data = res.data;
        setPlaylist(data);
        setNewName(data.name);
        setNewDescription(data.description || "");
      } catch (err) {
        console.error("Error al cargar la playlist:", err);
      }
    };

    if (user) {
      fetchPlaylist();
    }
  }, [playlistId, user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = async () => {
    try {
      const res = await axiosInstance.patch(`/playlists/${playlistId}`, {
        name: newName,
        description: newDescription,
      });
      const updated = res.data;
      setPlaylist(updated);
      setIsEditing(false);
      setIsEditingDesc(false);
    } catch (err) {
      console.error("🛑 Error guardando cambios:", err);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("cover", file);

    try {
      const res = await axiosInstance.patch(`/playlists/${playlistId}/cover`, formData);
      const updated = res.data;
      setPlaylist(updated);
      updatePlaylistCover(playlistId, updated.coverImage);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
    } catch (err) {
      console.error("❌ Error subiendo imagen:", err);
    }
  };

  const handlePlay = () => {
    if (playlist && playlist.songs.length > 0) playAlbum(playlist.songs);
  };

  const handleShuffle = () => {
    toggleShuffle();
  };

  const handleDeletePlaylist = async () => {
    try {
      await axiosInstance.delete(`/playlists/${playlistId}`);
      navigate("/");
    } catch (error) {
      console.error("Error al eliminar la playlist:", error);
    }
  };

  if (!playlist) return <div className="text-white p-6">Cargando...</div>;

  const fullImageUrl = playlist.coverImage
    ? playlist.coverImage.startsWith("http")
      ? playlist.coverImage
      : `${import.meta.env.VITE_API_URL}/uploads/${playlist.coverImage}`
    : "/default-playlist-cover.png";

  const totalDuration = playlist.songs.reduce((acc, song) => acc + song.duration, 0);
  const minutes = Math.floor(totalDuration / 60);
  const seconds = Math.floor(totalDuration % 60).toString().padStart(2, "0");
  const formattedDuration = `${minutes}:${seconds}`;

  return (
    <div
      className="relative w-full h-[350px] bg-cover bg-center"
      style={{ backgroundImage: `url(${fullImageUrl})` }}
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-black/40" />
      <div className="relative z-10 flex items-center gap-6 h-full px-6">
        <div
          className="relative"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <img
            src={fullImageUrl}
            alt="Playlist cover"
            className="w-48 h-48 object-cover rounded-lg shadow-lg"
          />
          {hovering && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 text-white p-1 rounded-full"
            >
              <Pencil size={16} />
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={uploadSuccess ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            className="absolute bottom-2 left-2 bg-green-600 text-white rounded-full p-1"
          >
            <Check size={14} />
          </motion.div>
        </div>

        <div className="text-white flex flex-col gap-2 flex-1">
          <div className="flex justify-between items-center">
            {isEditing ? (
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className="text-4xl font-bold bg-transparent border-b border-white outline-none text-white"
                autoFocus
              />
            ) : (
              <h1 className="text-4xl font-bold cursor-pointer" onClick={() => setIsEditing(true)}>
                {playlist.name}
              </h1>
            )}

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="text-white hover:text-zinc-300"
              >
                <MoreVertical />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-zinc-800 text-white rounded shadow-md z-50">
                  <button
                    onClick={handleDeletePlaylist}
                    className="w-full px-4 py-2 text-left hover:bg-zinc-700 flex items-center gap-2"
                  >
                    <Trash size={16} />
                    Eliminar Playlist
                  </button>
                </div>
              )}
            </div>
          </div>

          {isEditingDesc ? (
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
              className="text-sm bg-transparent border-b border-white text-white outline-none resize-none w-full"
              rows={2}
              autoFocus
            />
          ) : (
            <p
              className="text-sm text-zinc-300 cursor-pointer"
              onClick={() => setIsEditingDesc(true)}
            >
              {playlist.description || "para añadir una descripción..."}
            </p>
          )}

          <p className="text-sm">
            {playlist.songs?.length || 0} canciones · {formattedDuration} min
          </p>

          <div className="flex gap-4 mt-2">
            <button onClick={handlePlay} className="bg-transparent text-white p-3 rounded-full">
              <Play size={18} />
            </button>
            <button onClick={handleShuffle} className="bg-transparent text-white p-3 rounded-full">
              <Shuffle size={18} />
            </button>
            <button onClick={onOpenAddSongModal} className="bg-transparent text-white p-3 rounded-full">
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistHeader;