import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { MouseEvent, useState } from "react";
import ReviewForm from "@/pages/home/components/ReviewForm";
import { Star } from "lucide-react";

interface SongCardProps {
  song: Song;
  currentSongId?: string;
  onPlayClick: (song: Song) => void;
  onReviewClick: (song: Song) => void;
}

interface SectionGridProps {
  title: string;
  songs: Song[];
  isLoading: boolean;
  currentSongId?: string;
  onPlayClick: (song: Song) => void;
}

const SongCard = ({ song, currentSongId, onPlayClick, onReviewClick }: SongCardProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handlePlay = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onPlayClick(song);
  };

  const handleReview = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowReviewForm(true);
    onReviewClick(song);
  };

  return (
    <div
      className="bg-lapsus-1000/40 p-4 rounded-md hover:bg-lapsus-1100/20 transition-all group cursor-pointer relative"
      role="button"
      tabIndex={0}
    >
      <div className="relative mb-4">
        <div className="aspect-square rounded-md shadow-lg overflow-hidden">
          <img
            src={song.imageUrl}
            alt={song.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <PlayButton song={song} onClick={handlePlay} />
        <button
          onClick={handleReview}
          className="absolute top-2 right-2 text-lapsus-500 hover:text-lapsus-300 transition-colors"
          aria-label="Leave a review"
        >
          <Star className="w-5 h-5" />
        </button>
        {showReviewForm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <ReviewForm
              song={song}
              onClose={() => setShowReviewForm(false)}
            />
          </div>
        )}
      </div>
      <h3 className="font-medium mb-2 truncate">{song.title}</h3>
      <p className="text-sm text-lapsus-500 truncate">{song.artist}</p>
    </div>
  );
};

const SectionGrid = ({
  songs,
  title,
  isLoading,
  currentSongId,
  onPlayClick,
}: SectionGridProps) => {
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
          <SongCard
            key={song._id}
            song={song}
            currentSongId={currentSongId}
            onPlayClick={onPlayClick}
            onReviewClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;