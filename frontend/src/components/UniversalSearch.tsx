import { useEffect, useState } from "react";
import { useSearchStore } from "@/stores/useSearchStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

const UniversalSearch = () => {
  const {
    songs,
    albums,
    artists,
    fetchArtists,
  } = useMusicStore();
  const { searchTerm } = useSearchStore();
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const navigate = useNavigate();
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // ✅ CORRECTO: hook dentro del componente
  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setShowPlaceholder(true);
      const timer = setTimeout(() => {
        navigate("/");
        setShowPlaceholder(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowPlaceholder(false);
    }
  }, [debouncedSearchTerm, navigate]);

  if (!debouncedSearchTerm || showPlaceholder) {
    return (
      <div className="p-6 md:p-10 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-pulse text-lapsus-500 text-xl">
            Volviendo al inicio...
          </div>
        </div>
      </div>
    );
  }

  const lowerSearch = debouncedSearchTerm.toLowerCase();

  const filteredAlbums = albums.filter(
    (album) =>
      album.title.toLowerCase().includes(lowerSearch) ||
      album.artist.toLowerCase().includes(lowerSearch)
  );

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(lowerSearch) ||
      song.artist.toLowerCase().includes(lowerSearch)
  );

  const filteredArtists =
    artists?.filter((artist) =>
      artist.name.toLowerCase().includes(lowerSearch)
    ) || [];

  const handleSongPlay = (song: any) => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      setCurrentSong(song);
      usePlayerStore.setState({ isPlaying: true });
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-16 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-lapsus-500 scrollbar-track-transparent">
      {/* CANCIONES */}
      <section>
        <h2 className="text-white text-2xl font-bold mb-6">Canciones</h2>
        <div className="divide-y divide-white/10 rounded-lg overflow-hidden border border-white/10">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => {
              const isCurrentSong = currentSong?._id === song._id;
              const isPlayingCurrent = isCurrentSong && isPlaying;
              return (
                <div
                  key={song._id}
                  className="flex justify-between items-center p-4 bg-lapsus-1250 hover:bg-lapsus-1200 transition"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                      src={song.imageUrl}
                      alt={song.title}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {song.title}
                      </p>
                      <p className="text-lapsus-400 text-sm truncate">
                        {song.artist}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full text-lapsus-500 hover:text-white"
                      onClick={() => handleSongPlay(song)}
                    >
                      {isPlayingCurrent ? (
                        <Pause className="h-5 w-5 fill-current" />
                      ) : (
                        <Play className="h-5 w-5 fill-current" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-lapsus-500 p-4">No se encontraron canciones.</p>
          )}
        </div>
      </section>

      {/* ARTISTAS */}
      <section>
        <h2 className="text-white text-2xl font-bold mb-6">Artistas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredArtists.length > 0 ? (
            filteredArtists.map((artist) => (
              <div
                key={artist._id}
                className="flex flex-col items-center text-center hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-24 h-24 mb-3 rounded-full overflow-hidden border-2 border-lapsus-500">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-white font-medium">{artist.name}</p>
              </div>
            ))
          ) : (
            <p className="text-lapsus-500 col-span-full">No se encontraron artistas.</p>
          )}
        </div>
      </section>

      {/* ÁLBUMES */}
      <section>
        <h2 className="text-white text-2xl font-bold mb-6">Álbumes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredAlbums.length > 0 ? (
            filteredAlbums.map((album) => (
              <div
                key={album._id}
                onClick={() => navigate(`/albums/${album._id}`)}
                className="bg-gradient-to-b from-lapsus-1300 to-lapsus-1250 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer p-3"
              >
                <img
                  src={album.imageUrl}
                  alt={album.title}
                  className="rounded-md w-full aspect-square object-cover mb-3"
                />
                <h3 className="text-white font-semibold truncate">{album.title}</h3>
                <p className="text-lapsus-400 text-sm truncate">{album.artist}</p>
              </div>
            ))
          ) : (
            <p className="text-lapsus-500 col-span-full">No se encontraron álbumes.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default UniversalSearch;
