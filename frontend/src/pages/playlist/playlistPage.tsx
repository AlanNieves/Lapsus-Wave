import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Playlist } from "@/types";
import { axiosInstance } from "@/lib/axios";
import { Plus, X } from "lucide-react";

const AllPlaylistsPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [creating, setCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
        setCreating(false);
        setNewPlaylistName("");
      }
    };
    if (creating) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [creating]);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      const { data } = await axiosInstance.post("/playlists", { name: newPlaylistName });
      setPlaylists((prev) => [data, ...prev]);
      setNewPlaylistName("");
      setCreating(false);
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-lapsus-1200/35 to-lapsus-900">
      <div className="p-6 text-white relative">
        <h1 className="text-3xl font-bold mb-6">Tus Playlists</h1>

        <button
          onClick={() => setCreating(!creating)}
          className="absolute top-6 right-6 bg-lapsus-700 hover:bg-lapsus-600 transition-colors text-white rounded-full p-2"
          title={creating ? "Cancelar" : "Crear nueva playlist"}
        >
          {creating ? <X size={24} /> : <Plus size={24} />}
        </button>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {creating && (
            <div className="bg-lapsus-1100 rounded-lg p-3 shadow-md relative overflow-hidden">
              <div className="w-full h-40 bg-[radial-gradient(circle_at_center,#6A1E55_0%,#2c132b_100%)] rounded-md flex items-center justify-center text-lapsus-300 text-sm font-medium">
                Imagen por defecto
              </div>
              <div className="relative z-10 mt-2">
                <input
                  type="text"
                  className="w-full bg-[#4C1C3D] text-white placeholder:text-lapsus-400 border border-lapsus-600 focus:outline-none focus:ring-2 focus:ring-lapsus-700 rounded-md px-3 py-2 transition"
                  placeholder="Nombre de la playlist"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreatePlaylist();
                    }
                  }}
                  autoFocus
                />
                <p className="text-xs text-lapsus-400 mt-1">Presiona Enter para crear</p>
              </div>
            </div>
          )}

          {playlists.map((playlist) => (
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
                  src={
                    playlist.coverImage
                      ? playlist.coverImage.startsWith("http")
                        ? playlist.coverImage
                        : `${BASE_URL}/uploads/${playlist.coverImage}`
                      : "/placeholder.png"
                  }
                  alt={playlist.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.png";
                  }}
                  className="w-full h-40 object-cover rounded-md"
                />
                <div className="mt-2 font-semibold text-white">{playlist.name}</div>
                <p className="text-sm text-lapsus-300 line-clamp-2">{playlist.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AllPlaylistsPage;
