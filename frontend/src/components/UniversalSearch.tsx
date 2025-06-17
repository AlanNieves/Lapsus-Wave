// UniversalSearch.tsx
import { useEffect, useState } from "react";
import { useSearchStore } from "@/stores/useSearchStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

// Función para normalizar strings (quitar acentos y convertir a minúsculas)
const normalizeString = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

interface Artist {
  _id: string;
  name: string;
  image?: string;
}

const UniversalSearch = () => {
  const {
    songs,
    albums,
    artists = [],
    fetchArtists,
    fetchSongs,
    fetchAlbums,
  } = useMusicStore();

  const { searchTerm } = useSearchStore();
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchArtists(), fetchSongs(), fetchAlbums()]);
      setIsInitialLoad(false);
    };
    
    loadData();
  }, [fetchArtists, fetchSongs, fetchAlbums]);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      navigate("/");
    }
  }, [debouncedSearchTerm, navigate]);

  if (!debouncedSearchTerm || isInitialLoad) {
    return (
      <div className="p-6 md:p-10 flex items-center justify-center h-full bg-gradient-to-b from-lapsus-1200/35 to-lapsus-900">
        <div className="text-center">
          <div className="animate-pulse text-lapsus-500 text-xl">
            {isInitialLoad ? "Cargando..." : "Volviendo al inicio..."}
          </div>
        </div>
      </div>
    );
  }

  const lowerSearch = normalizeString(debouncedSearchTerm);

  const filteredSongs = songs.filter(
    (song) =>
      normalizeString(song.title).includes(lowerSearch) ||
      normalizeString(song.artist).includes(lowerSearch)
  );

  const filteredArtists = artists.filter((artist) =>
    normalizeString(artist.name).includes(lowerSearch)
  );

  const filteredAlbums = albums.filter(
    (album) =>
      normalizeString(album.title).includes(lowerSearch) ||
      normalizeString(album.artist).includes(lowerSearch)
  );

  // Depuración
  console.log("Filtered Songs:", filteredSongs);
  console.log("Filtered Artists:", filteredArtists);
  console.log("Filtered Albums:", filteredAlbums);

  const handleSongPlay = (song: any) => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      setCurrentSong(song);
      usePlayerStore.setState({ isPlaying: true });
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-16 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-lapsus-500 scrollbar-track-transparent bg-gradient-to-b from-lapsus-1200/35 to-lapsus-900">
      
      {/* SECCIÓN DE CANCIONES */}
      <section>
        <h2 className="text-white text-2xl font-bold mb-6">Canciones</h2>
        {filteredSongs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {filteredSongs.map((song: any) => {
              const isCurrentSong = currentSong?._id === song._id;
              const isPlayingCurrent = isCurrentSong && isPlaying;
              return (
                <div
                  key={song._id}
                  className="flex flex-col items-center bg-lapsus-1250 hover:bg-lapsus-1200 transition rounded-xl p-3 cursor-pointer"
                >
                  <div className="relative w-full flex justify-center mb-3">
                    <div className="w-28 h-28 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="min-w-full min-h-full object-cover"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-2 right-2 h-9 w-9 rounded-full text-lapsus-500 hover:text-white bg-black/60"
                      onClick={() => handleSongPlay(song)}
                    >
                      {isPlayingCurrent ? (
                        <Pause className="h-5 w-5 fill-current" />
                      ) : (
                        <Play className="h-5 w-5 fill-current" />
                      )}
                    </Button>
                  </div>
                  <div className="w-full">
                    <p className="text-white font-medium truncate">{song.title}</p>
                    <p className="text-lapsus-400 text-sm truncate">{song.artist}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No se encontraron canciones para "{debouncedSearchTerm}"
          </p>
        )}
      </section>

      {/* SECCIÓN DE ARTISTAS */}
      <section>
        <h2 className="text-white text-2xl font-bold mb-6">Artistas</h2>
        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredArtists.map((artist: Artist) => (
              <div
                key={artist._id}
                className="flex flex-col items-center text-center hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-24 h-24 mb-3 rounded-full overflow-hidden border-2 border-lapsus-500 flex items-center justify-center">
                  <img
                    src={artist.image || "/fallback-artist.jpg"}
                    alt={artist.name}
                    className="min-w-full min-h-full object-cover"
                  />
                </div>
                <p className="text-white font-medium">{artist.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No se encontraron artistas para "{debouncedSearchTerm}"
          </p>
        )}
      </section>

      {/* SECCIÓN DE ÁLBUMES */}
      <section>
        <h2 className="text-white text-2xl font-bold mb-6">Álbumes</h2>
        {filteredAlbums.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredAlbums.map((album) => (
              <div
                key={album._id}
                onClick={() => navigate(`/albums/${album._id}`)}
                className="bg-gradient-to-b from-lapsus-1300 to-lapsus-1250 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer p-3"
              >
                <div className="w-full aspect-square mb-3 flex items-center justify-center overflow-hidden rounded-md">
                  <img
                    src={album.imageUrl}
                    alt={album.title}
                    className="min-w-full min-h-full object-cover"
                  />
                </div>
                <h3 className="text-white font-semibold truncate">{album.title}</h3>
                <p className="text-lapsus-400 text-sm truncate">{album.artist}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No se encontraron álbumes para "{debouncedSearchTerm}"
          </p>
        )}
      </section>
    </div>
  );
};

export default UniversalSearch;