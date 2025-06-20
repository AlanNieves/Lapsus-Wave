import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, StarOff, X } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import { useUserStore } from "@/stores/useUserStore";
import { toast } from 'sonner'; // Importa directamente de sonner

interface ReviewFormProps {
  song: any;
  onClose: () => void;
}

const ReviewForm = ({ song, onClose }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const { addReview } = useMusicStore();
  const { user } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Por favor inicia sesión para dejar una review");
      return;
    }

    if (rating === 0) {
      toast.warning("Por favor selecciona una calificación");
      return;
    }

    setIsSubmitting(true);

    try {
      await addReview({
        userId: user._id,
        userName: user.name,
        rating,
        comment,
        songId: song._id,
        songTitle: song.title,
        artistName: song.artist
      });

      toast.success("¡Review enviada con éxito!");
      
      onClose();
    } catch (error) {
      toast.error("Error al enviar la review. Por favor, intenta de nuevo.");
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-lapsus-1250 rounded-xl p-6 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-4">
          Review for: <span className="text-lapsus-500">{song.title}</span>
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
                  disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
          
          <Button 
            type="submit" 
            className="bg-lapsus-500 hover:bg-lapsus-400 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : "Submit Review"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;