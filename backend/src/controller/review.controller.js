import { Review } from "../models/review.model.js";

// Crear review
export const createReview = async (req, res, next) => {
  try {
    const { rating, comment, songId, songTitle, artistName, albumId } =
      req.body;

    if (!rating || !comment || !songId || !songTitle || !artistName) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const newReview = new Review({
      userId: req.user.id,
      userName: req.user.nickname, // Ajusta si tu req.user tiene otro campo
      rating,
      comment,
      songId,
      songTitle,
      artistName,
      albumId,
    });
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: "ID de canción inválido" });
    }

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Obtener todas las reviews
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

// Obtener reviews por canción
export const getReviewsBySong = async (req, res, next) => {
  try {
    const { songId } = req.params;

    // 🔹 AÑADIR VALIDACIÓN
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const reviews = await Review.find({ songId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};
