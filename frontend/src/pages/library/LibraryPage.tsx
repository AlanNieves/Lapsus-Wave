import { useEffect, useState } from "react";
import {axiosInstance} from "@/lib/axios";
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
          axiosInstance.get(`${BASE_URL}/library/liked-songs`, { withCredentials: true }),
          axiosInstance.get(`${BASE_URL}/library/saved-albums`, { withCredentials: true }),
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
    <div className="w-full h-full overflow-y-auto p-10 text-white bg-gradient-to-b from-lapsus-1200/35 to-lapsus-900">
      <h1 className="text-4xl font-bold mb-10 drop-shadow-md">Tu Biblioteca</h1>

      {/* Liked Songs */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-lapsus-400">ME GUSTA</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <div
            onClick={() => navigate("/library/liked-songs")}
            className="cursor-pointer bg-white/10 backdrop-blur-md rounded-xl p-4 flex flex-col items-center justify-center hover:scale-[1.04] transition-transform shadow-lg border border-white/10"
            >
            <img
                src="/heart-8bit.png"
                alt="Liked Songs"
                className="w-16 h-16 object-contain mb-4 drop-shadow-md"
            />
            <p className="text-white font-bold text-center text-lg">Tus me gusta</p>
            <p className="text-sm text-lapsus-400">{likedSongs.length} canciones</p>
            </div>
        </div>
        </section>


      {/* Saved Albums */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-lapsus-400">💿 Álbumes y singles guardados</h2>
        {savedAlbums.length === 0 ? (
          <p className="text-gray-400">Aún no has agregado álbumes a tu biblioteca.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {savedAlbums.map((album) => (
              <div
                key={album._id}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-lg hover:scale-[1.02] transition-transform"
              >
                <img
                  src={album.imageUrl || "/default-album.png"}
                  alt={album.title}
                  className="w-full h-44 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold truncate text-white">{album.title}</h3>
                <p className="text-sm text-lapsus-400 truncate">{album.artist}</p>
                <Button
                  className="mt-3 w-full"
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
