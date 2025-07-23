import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Playlist } from "@/types";
import { axiosInstance } from "@/lib/axios";
import { Plus, X, Pencil } from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";

const AllPlaylistsPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const fetchPlaylists = async () => {
    try {
      const { data } = await axiosInstance.get("/playlists");
      setPlaylists(Array.isArray(data) ? data : data.playlists || []);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCreating(false);
        setNewName("");
        setCoverFile(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const formData = new FormData();
      formData.append("name", newName);
      if (coverFile) formData.append("cover", coverFile);

      const { data } = await axiosInstance.post("/playlists", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPlaylists([data, ...playlists]);
      setNewName("");
      setCoverFile(null);
      setIsCreating(false);
      navigate(`/playlists/${data._id}`);
    } catch (err) {
      console.error("Error creando playlist:", err);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleCreate();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsCreating(false);
      setNewName("");
      setCoverFile(null);
    }
  };

  return (
    <main className="relative h-full bg-gradient-to-b from-lapsus-1200/35 to-lapsus-900 px-8 py-10 overflow-y-auto">
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setIsCreating((prev) => !prev)}
          className="p-3 rounded-full backdrop-blur-md bg-white/10 text-white hover:bg-white/20 transition shadow-lg"
        >
          {isCreating ? <X size={20} /> : <Plus size={20} />}
        </button>
      </div>

      <h1 className="text-4xl font-bold text-white mb-10 drop-shadow-md">
        PLAYLIST
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {isCreating && (
          <div className="relative rounded-xl p-4 bg-white/10 backdrop-blur-md shadow-xl border border-white/10">
            <div
              className="relative w-full h-40 bg-zinc-900 rounded-md flex items-center justify-center cursor-pointer group/cover"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              />
              {coverFile ? (
                <img
                  src={URL.createObjectURL(coverFile)}
                  alt="Portada"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <span className="text-zinc-500">Sin portada</span>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover/cover:opacity-100 transition">
                <Pencil size={18} className="text-white" />
              </div>
            </div>

            <input
              type="text"
              placeholder="Nombre de la playlist"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mt-4 w-full p-2 rounded-md bg-zinc-900 text-white placeholder:text-zinc-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewName("");
                  setCoverFile(null);
                }}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="text-green-400 hover:text-green-300 text-sm"
              >
                Crear
              </button>
            </div>
          </div>
        )}

        {playlists.map((playlist) => {
          const imageUrl = getImageUrl(playlist.coverImage);

          return (
            <div
              key={playlist._id}
              onClick={() => navigate(`/playlists/${playlist._id}`)}
              className="cursor-pointer hover:scale-[1.04] transition-transform rounded-xl overflow-hidden bg-white/10 backdrop-blur-md shadow-xl border border-white/10"
            >
              <img
                src={imageUrl}
                alt={playlist.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
                className="w-full h-40 object-cover rounded-t-xl"
              />
              <div className="p-3 text-white font-medium text-center truncate">
                {playlist.name}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default AllPlaylistsPage;
