import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Song, Album } from "@/types";
import { Button } from "@/components/ui/button";

const LibraryPage = () => {
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<Album[]>([]);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const [songsRes, albumsRes] = await Promise.all([
          axios.get(`${BASE_URL}/library/liked-songs`, { withCredentials: true }),
          axios.get(`${BASE_URL}/library/saved-albums`, { withCredentials: true }),
        ]);
        setLikedSongs(songsRes.data);
        setSavedAlbums(albumsRes.data);
      } catch (err) {
        console.error("Error cargando biblioteca", err);
        navigate("/login");
      }
    };

    fetchLibrary();
  }, [navigate, BASE_URL]);

  return (
    <div className="rounded-xl border-white/20 w-full h-full overflow-y-auto p-10 text-white bg-gradient-to-b from-[#1f1023] via-[#140d1a] to-[#0a0a0a] border border-white/20">
      <h1 className="text-4xl font-bold mb-10 drop-shadow-md">Tu Biblioteca</h1>

      {/* Liked Songs */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-purple-300">💜 Tus Me Gusta</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div
            onClick={() => navigate("/library/liked-songs")}
            className="cursor-pointer bg-white/5 backdrop-blur-xl rounded-2xl p-5 flex flex-col items-center justify-center hover:scale-[1.05] transition-transform border border-white/10 shadow-2xl"
          >
            {/* Corazón SVG animado */}
            <div className="w-16 h-16 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-10 h-10 text-pink-500 animate-heartbeat"
              >
                <path
                  fillRule="evenodd"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42
                    4.42 3 7.5 3c1.74 0 3.41 0.81
                    4.5 2.09C13.09 3.81 14.76 3
                    16.5 3 19.58 3 22 5.42
                    22 8.5c0 3.78-3.4 6.86-8.55
                    11.54L12 21.35z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-white font-bold text-center text-lg">Tus me gusta</p>
            <p className="text-sm text-purple-200">{likedSongs.length} canciones</p>
          </div>
        </div>
      </section>

      {/* Saved Albums */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-purple-300">💿 Álbumes y singles guardados</h2>
        {savedAlbums.length === 0 ? (
          <p className="text-purple-200">Aún no has agregado álbumes a tu biblioteca.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {savedAlbums.map((album) => (
              <div
                key={album._id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl hover:scale-[1.03] transition-transform"
              >
                <img
                  src={album.imageUrl || "/default-album.png"}
                  alt={album.title}
                  className="w-full h-44 object-cover rounded-xl mb-4"
                />
                <h3 className="text-xl font-semibold truncate text-white">{album.title}</h3>
                <p className="text-sm text-purple-200 truncate">{album.artist}</p>
                <Button
                  className="mt-3 w-full bg-purple-500 hover:bg-purple-400 text-white"
                  size="sm"
                  onClick={() => navigate(`/albums/${album._id}`)}
                >
                  Ir al álbum
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LibraryPage;
