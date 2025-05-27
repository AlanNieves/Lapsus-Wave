import { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Play, Shuffle, Plus, Pencil, MoreVertical } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";

interface Playlist {
  _id: string;
  name: string;
  description: string;
  coverImage?: string;
  songs: any[];
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
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hovering, setHovering] = useState(false);

  const { playAlbum, toggleShuffle } = usePlayerStore();

  useEffect(() => {
    const fetchTokenAndPlaylist = async () => {
      try {
        const fetchedToken = await getToken();
        setToken(fetchedToken);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/playlists/${playlistId}`, {
          headers: { Authorization: `Bearer ${fetchedToken}` },
        });

        if (!res.ok) throw new Error("No se pudo cargar la playlist");
        const data = await res.json();
        setPlaylist(data);
        setNewName(data.name);
        setNewDescription(data.description || "");
      } catch (err) {
        console.error("Error al cargar la playlist:", err);
      }
    };

    fetchTokenAndPlaylist();
  }, [playlistId, getToken]);

  const handleSave = async () => {
    try {
      if (!token) throw new Error("Token no disponible");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/playlists/${playlistId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName, description: newDescription }),
      });

      if (!res.ok) throw new Error("Error al actualizar");
      const updated = await res.json();
      setPlaylist(updated);
      setIsEditing(false);
      setIsEditingDesc(false);
    } catch (err) {
      console.error("🛑 Error guardando cambios:", err);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    const formData = new FormData();
    formData.append("cover", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/playlists/${playlistId}/cover`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir imagen");
      const updated = await res.json();
      setPlaylist(updated);
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

  if (!playlist || !token) return <div className="text-white p-6">Cargando...</div>;

  const fullImageUrl = playlist.coverImage
  ? playlist.coverImage.startsWith("http")
    ? playlist.coverImage
    : `${import.meta.env.VITE_API_URL}/uploads/${playlist.coverImage}`
  : "/default-playlist-cover.png";


  return (
    <div
      className="relative w-full h-[350px] bg-cover bg-center"
      style={{ backgroundImage: `url(${fullImageUrl || "https://via.placeholder.com/600"})` }}
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-black/40" />
      <div className="relative z-10 flex items-center gap-6 h-full px-6">
        <div
          className="relative"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <img
            src={fullImageUrl || "https://via.placeholder.com/200"}
            alt="Playlist cover"
            className="!w-48 !h-48 !aspect-square !object-cover rounded-lg shadow-lg"
          />
          {hovering && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-black/70 text-white p-1 rounded-full"
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
            <button className="text-white hover:text-zinc-300">
              <MoreVertical />
            </button>
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
            <p className="text-sm text-zinc-300 cursor-pointer" onClick={() => setIsEditingDesc(true)}>
              {playlist.description || "Haz clic para añadir una descripción..."}
            </p>
          )}

          <p className="text-sm">
            {playlist.songs?.length || 0} canciones · {(playlist.songs?.length || 0) * 3}:00 min
          </p>

          <div className="flex gap-4 mt-2">
            <button onClick={handlePlay} className="bg-pink-700 text-white p-3 rounded-full">
              <Play size={18} />
            </button>
            <button onClick={handleShuffle} className="bg-pink-700 text-white p-3 rounded-full">
              <Shuffle size={18} />
            </button>
            <button onClick={onOpenAddSongModal} className="bg-pink-700 text-white p-3 rounded-full">
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistHeader;
