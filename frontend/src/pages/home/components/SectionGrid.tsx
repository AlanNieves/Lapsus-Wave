import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const SongCard = ({ song, onPlayClick, onReviewClick }: SongCardProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/song/${song._id}`);
  };

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
      onClick={handleCardClick}
      className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl hover:scale-[1.03] transition-transform group cursor-pointer relative"
      role="button"
      tabIndex={0}
    >
      <div className="relative mb-4">
        <div className="aspect-square rounded-xl overflow-hidden">
          <img
            src={song.imageUrl}
            alt={song.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <PlayButton song={song} onClick={handlePlay} />
        <button
          onClick={handleReview}
          className="absolute top-2 right-2 text-purple-400 hover:text-purple-300 transition-colors"
          aria-label="Leave a review"
        >
          <Star className="w-5 h-5" />
        </button>
        {showReviewForm && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-xl"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <ReviewForm
                song={song}
                onClose={() => setShowReviewForm(false)}
              />
            </div>
          </div>
        )}
      </div>
      <h3 className="text-white font-semibold text-lg mb-1 truncate">
        {song.title}
      </h3>
      <p className="text-sm text-purple-300 truncate">{song.artist}</p>
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
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white drop-shadow-md">{title}</h2>
        <Button
          variant="link"
          className="text-sm text-purple-400 hover:text-purple-300"
        >
          Show all
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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