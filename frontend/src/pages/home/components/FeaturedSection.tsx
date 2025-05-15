// FeaturedSection.tsx
import { useMusicStore } from "@/stores/useMusicStore";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { MouseEvent } from "react";
import { Song } from "@/types"; // Importación correcta desde types/index

const FeaturedSection = () => {
  const { isLoading, featuredSongs, error } = useMusicStore();
  const { currentSong, setCurrentSong, togglePlay } = usePlayerStore();

  const handleCardClick = (song: Song) => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };

  if (isLoading) return <FeaturedGridSkeleton />;
  if (error) return <p className='text-red-500 mb-4 text-lg'>{error}</p>;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
      {featuredSongs.map((song: Song) => (
        <div
          key={song._id}
          className='flex items-center bg-lapsus-1000/40 rounded-md overflow-hidden hover:bg-lapsus-1100/20 transition-colors group cursor-pointer relative'
          onClick={() => handleCardClick(song)}
          role="button"
          tabIndex={0}
        >
          <img
            src={song.imageUrl}
            alt={song.title}
            className='w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0'
          />
          <div className='truncate flex-1 p-4'>
            <p className='font-medium truncate'>{song.title}</p>
            <p className='text-sm text-lapsus-500 truncate'>{song.artist}</p>
          </div>
          <PlayButton 
            song={song}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              handleCardClick(song);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FeaturedSection;