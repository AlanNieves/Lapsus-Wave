import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Playlist } from "@/types";
import { axiosInstance } from "@/lib/axios";
import { Plus, X, Pencil } from "lucide-react";

const AllPlaylistsPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const FILE_BASE = API_BASE.replace("/api", "");

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
      if (e.key === "Escape") setIsCreating(false);
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
   <main className="rounded-xl relative h-full bg-gradient-to-b from-[#1a1a1f] via-[#18161d] to-[#0f0e13] px-8 py-10 overflow-y-auto border border-white/20">

      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setIsCreating((prev) => !prev)}
          className="p-3 rounded-full backdrop-blur-md bg-gradient-to-b from-purple-500/30 to-purple-800/20 border border-purple-500/30 text-white hover:bg-purple-500/20 hover:shadow-lg transition shadow"
        >
          {isCreating ? <X size={20} /> : <Plus size={20} />}
        </button>
      </div>

      <h1 className="text-4xl font-bold text-white mb-10 drop-shadow-md">
        PLAYLIST
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {isCreating && (
          <div className="relative rounded-xl p-4 bg-black/30 backdrop-blur-md border border-white/10 shadow">
            <div
              className="relative w-full h-40 bg-zinc-900 rounded-md flex items-center justify-center cursor-pointer group/cover overflow-hidden"
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
              className="mt-4 w-full p-2 rounded-md bg-zinc-800 text-white placeholder:text-zinc-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="text-purple-300 hover:text-purple-200 text-sm"
              >
                Crear
              </button>
            </div>
          </div>
        )}

        {playlists.map((playlist) => {
          const correctedCoverImage = playlist.coverImage?.replace(
            "/api/uploads",
            "/uploads"
          );
          const imageUrl =
            correctedCoverImage?.startsWith("http") ||
            correctedCoverImage?.startsWith("/uploads")
              ? correctedCoverImage
              : `${FILE_BASE}/uploads/${correctedCoverImage}`;

          return (
            <div
              key={playlist._id}
              onClick={() => navigate(`/playlists/${playlist._id}`)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-b from-lapsus-1000/40 via-lapsus-900/30 to-black/30 border border-white/10 shadow-md hover:shadow-xl transition-transform hover:scale-[1.03]"
            >
              <img
                src={imageUrl || "/placeholder.png"}
                alt={playlist.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
                className="w-full h-40 object-cover"
              />

              {/* Efecto de iluminación morada al hover */}
              <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Animación pulse */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500/50 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>

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
