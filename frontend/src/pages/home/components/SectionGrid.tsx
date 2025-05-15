import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { MouseEvent } from "react";

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};

const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
  const { currentSong, setCurrentSong, togglePlay } = usePlayerStore();

  const handleCardClick = (song: Song) => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };

  if (isLoading) return <SectionGridSkeleton />;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <Button variant="link" className="text-sm text-lapsus-800 hover:text-lapsus-500">
          Show all
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {songs.map((song) => (
          <div
            key={song._id}
            className="bg-lapsus-1000/40 p-4 rounded-md hover:bg-lapsus-1100/20 transition-all group cursor-pointer"
            onClick={() => handleCardClick(song)}
            role="button"
            tabIndex={0}
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 
                  group-hover:scale-105"
                />
              </div>
              <PlayButton 
                song={song}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  handleCardClick(song);
                }}
              />
            </div>
            <h3 className="font-medium mb-2 truncate">{song.title}</h3>
            <p className="text-sm text-lapsus-500 truncate">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;