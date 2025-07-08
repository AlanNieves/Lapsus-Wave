// src/components/ReviewForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, StarOff, X } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import { useAuthStore } from "@/stores/useAuthStore";

interface ReviewFormProps {
  song: any;
  onClose: () => void;
}

const ReviewForm = ({ song, onClose }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const { addReview } = useMusicStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !song) return;
    
    setIsSubmitting(true);
    try {
      await addReview({
        userId: user._id,
        userName: user.nickname,
        rating,
        comment,
        songId: song._id,
        songTitle: song.title,
        artistName: song.artist
      });
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-lapsus-1250 rounded-xl p-6 max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-4">
          Review for: {song.title}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-yellow-400 focus:outline-none mr-1"
                >
                  {star <= (hoverRating || rating) ? (
                    <Star className="w-6 h-6 fill-current" />
                  ) : (
                    <StarOff className="w-6 h-6" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-white mb-2">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this song..."
              className="w-full p-3 rounded-lg bg-lapsus-1200 border border-lapsus-500 text-white"
              rows={4}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="bg-lapsus-500 hover:bg-lapsus-400 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;