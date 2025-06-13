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
  const FILE_BASE = API_BASE.replace("/api", ""); // eliminar "/api" solo para imágenes

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
    <main className="relative rounded-md overflow-hidden h-full bg-gradient-to-b from-lapsus-1200/35 to-lapsus-900">
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsCreating((prev) => !prev)}
          className="p-2 rounded-full bg-#6A1E55 text-white hover:bg-#6A1E55 transition"
        >
          {isCreating ? <X size={20} /> : <Plus size={20} />}
        </button>
      </div>

      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-6">Tus Playlists</h1>

        <button
          onClick={() => setCreating(!creating)}
          className="absolute top-6 right-6 bg-lapsus-700 hover:bg-lapsus-600 transition-colors text-white rounded-full p-2"
          title={creating ? "Cancelar" : "Crear nueva playlist"}
        >
          {creating ? <X size={24} /> : <Plus size={24} />}
        </button>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

          {isCreating && (
            <div className="cursor-default rounded-lg p-3 shadow-md relative overflow-hidden group bg-lapsus-1000/80">
              <div className="absolute inset-0 z-0 backdrop-blur-md rounded-lg overflow-hidden">
                <div className="w-full h-full animate-pulse bg-[radial-gradient(circle_at_30%_30%,#6A1E55_0%,transparent_70%)] opacity-70" />
                <div className="absolute inset-0 animate-bounce bg-[radial-gradient(circle_at_70%_70%,#A64D79_0%,transparent_80%)] opacity-20 mix-blend-screen" />
              </div>

              <div className="relative z-10 flex flex-col gap-3">
                <div
                  className="relative w-full h-40 bg-zinc-800 rounded-md flex items-center justify-center cursor-pointer group/cover hover:opacity-90"
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
                    <span className="text-zinc-400">Sin portada</span>
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
                  className="bg-zinc-800 p-2 rounded text-white w-full placeholder:text-zinc-500"
                />

                <div className="flex justify-between mt-2">
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
            </div>
          )}

          {playlists.map((playlist) => {
            const correctedCoverImage = playlist.coverImage?.replace("/api/uploads", "/uploads");
            const imageUrl = correctedCoverImage
              ? correctedCoverImage.startsWith("http") || correctedCoverImage.startsWith("/uploads")
                ? correctedCoverImage
                : `${FILE_BASE}/uploads/${correctedCoverImage}`
              : "/placeholder.png";

            return (
              <div
                key={playlist._id}
                onClick={() => navigate(`/playlists/${playlist._id}`)}
                className="cursor-pointer hover:scale-105 transition-transform rounded-lg p-3 shadow-md relative overflow-hidden"
              >
                <div className="absolute inset-0 z-0 backdrop-blur-md rounded-lg overflow-hidden">
                  <div className="w-full h-full animate-pulse bg-[radial-gradient(circle_at_30%_30%,#6A1E55_0%,transparent_70%)] opacity-70" />
                  <div className="absolute inset-0 animate-bounce bg-[radial-gradient(circle_at_70%_70%,#A64D79_0%,transparent_80%)] opacity-20 mix-blend-screen" />
                </div>
                <div className="relative z-10">
                  <img
                    src={imageUrl}
                    alt={playlist.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.png";
                    }}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <div className="mt-2 font-semibold text-white">{playlist.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default AllPlaylistsPage;
