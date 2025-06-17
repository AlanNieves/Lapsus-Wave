// src/pages/reviews/ReviewsPage.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, StarOff } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { Textarea } from "@/components/ui/textarea";

const ReviewsPage = () => {
  const { user } = useUserStore();
  const { reviews, fetchReviews, addReview } = useMusicStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      await fetchReviews();
      setIsLoading(false);
    };
    loadReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await addReview({
        userId: user._id,
        userName: user.name,
        rating,
        comment
      });
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const renderStars = (ratingValue: number) => {
    return [1, 2, 3, 4, 5].map((star) => {
      const fillPercentage = Math.max(0, Math.min(100, (ratingValue - star + 1) * 100));
      
      return (
        <div key={star} className="relative inline-block">
          <StarOff className="text-gray-500 absolute" size={24} />
          <div 
            className="absolute overflow-hidden" 
            style={{ width: `${fillPercentage}%` }}
          >
            <Star className="text-yellow-400" size={24} fill="currentColor" />
          </div>
          <Star className="text-transparent" size={24} />
        </div>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 flex items-center justify-center h-full bg-gradient-to-b from-lapsus-1200/35 to-lapsus-900">
        <div className="animate-pulse text-lapsus-500 text-xl">
          Loading reviews...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gradient-to-b from-lapsus-1200/35 to-lapsus-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Customer Reviews</h1>
        
        {/* Formulario para nuevas reseñas */}
        {user && (
          <form onSubmit={handleSubmit} className="mb-12 bg-lapsus-1250 rounded-xl p-6">
            <div className="mb-4">
              <label className="block text-white mb-2">Your Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-yellow-400 focus:outline-none"
                  >
                    {star <= (hoverRating || rating) ? (
                      <Star className="w-8 h-8 fill-current" />
                    ) : (
                      <Star className="w-8 h-8" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Your Review</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full p-4 rounded-lg bg-lapsus-1200 border border-lapsus-500 text-white"
                rows={4}
                required
              />
            </div>
            <Button type="submit" className="bg-lapsus-500 hover:bg-lapsus-400">
              Submit Review
            </Button>
          </form>
        )}

        {/* Lista de reseñas */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">All Reviews</h2>
          {reviews.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <StarOff className="mx-auto mb-4 text-lapsus-500" size={48} />
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-lapsus-1250 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                      <span className="text-white font-bold">
                        {review.userName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{review.userName}</h3>
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                  <p className="text-gray-500 text-sm mt-4">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;