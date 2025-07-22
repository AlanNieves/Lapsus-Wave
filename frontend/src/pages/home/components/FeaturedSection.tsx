import { useMusicStore } from "@/stores/useMusicStore";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { MouseEvent } from "react";
import { Song } from "@/types";
import { useNavigate, Link } from "react-router-dom";

const FeaturedSection = () => {
  const { isLoading, featuredSongs, error } = useMusicStore();
  const { currentSong, setCurrentSong, togglePlay } = usePlayerStore();
  const navigate = useNavigate();

  const handlePlayClick = (song: Song) => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };

  const handleCardClick = (song: Song) => {
    navigate(`/song/${song._id}`);
  };

  if (isLoading) return <FeaturedGridSkeleton />;
  if (error) return <p className="text-red-500 mb-4 text-lg">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {featuredSongs.map((song: Song) => (
        <div
          key={song._id}
          onClick={() => handleCardClick(song)}
          role="button"
          tabIndex={0}
          className="flex items-center bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.015] transition-transform group cursor-pointer relative"
        >
          <img
            src={song.imageUrl}
            alt={song.title}
            className="w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0 rounded-l-2xl"
          />
          <div className="truncate flex-1 p-4">
            <p className="text-white font-semibold truncate text-base sm:text-lg">
              {song.title}
            </p>
            <Link
              to={`/artist/${song.artistId}`}
              className="text-sm text-purple-300 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {song.artist}
            </Link>
          </div>
          <PlayButton
            song={song}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              handlePlayClick(song);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FeaturedSection;