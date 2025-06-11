import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Playlist } from "@/types";
import { axiosInstance } from "@/lib/axios";

const AllPlaylistsPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const { data } = await axiosInstance.get("/playlists");
        setPlaylists(Array.isArray(data) ? data : data.playlists || []);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-lapsus-1200/35 to-lapsus-900">
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-6">Tus Playlists</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              onClick={() => navigate(`/playlists/${playlist._id}`)}
              className="cursor-pointer hover:scale-105 transition-transform rounded-lg p-3 shadow-md relative overflow-hidden"
            >
              {/* Fondo animado detrás de la portada */}
              <div className="absolute inset-0 z-0 backdrop-blur-md rounded-lg overflow-hidden">
                <div className="w-full h-full animate-pulse bg-[radial-gradient(circle_at_30%_30%,#6A1E55_0%,transparent_70%)] opacity-70" />
                <div className="absolute inset-0 animate-bounce bg-[radial-gradient(circle_at_70%_70%,#A64D79_0%,transparent_80%)] opacity-20 mix-blend-screen" />
              </div>

              {/* Contenido encima del fondo animado */}
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
