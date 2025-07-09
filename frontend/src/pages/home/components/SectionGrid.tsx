// src/components/SectionGrid.tsx
import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { MouseEvent, useState } from "react";
import ReviewForm from "./ReviewForm";
import { Star } from "lucide-react";

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
  enableReviews?: boolean;
};

const SectionGrid = ({ songs, title, isLoading, enableReviews = false }: SectionGridProps) => {
  const { currentSong, setCurrentSong, togglePlay } = usePlayerStore();
  const [reviewingSongId, setReviewingSongId] = useState<string | null>(null);

  const handlePlayClick = (song: Song) => {
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
        <Button
          variant="link"
          className="text-sm text-lapsus-800 hover:text-lapsus-500"
        >
          Show all
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {songs.map((song) => (
          <div
            key={song._id}
            className="bg-lapsus-1000/40 p-4 rounded-md hover:bg-lapsus-1100/20 transition-all group cursor-pointer relative"
            role="button"
            tabIndex={0}
            // Si quieres navegación, descomenta:
            // onClick={() => navigate(`/song/${song._id}`)}
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <PlayButton
                song={song}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  handlePlayClick(song);
                }}
              />
              {enableReviews && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setReviewingSongId(song._id);
                  }}
                  className="absolute top-2 right-2 text-lapsus-500 hover:text-lapsus-300 transition-colors"
                  aria-label="Leave a review"
                >
                  <Star className="w-5 h-5" />
                </button>
              )}
              {reviewingSongId === song._id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative"
                  >
                    <ReviewForm
                      song={song}
                      onClose={() => setReviewingSongId(null)}
                    />
                  </div>
                </div>
              )}
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
