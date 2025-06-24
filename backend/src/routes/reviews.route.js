const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Crear review
router.post('/', auth, async (req, res) => {
  try {
    const { rating, comment, songId, songTitle, artistName, albumId } = req.body;
    
    // Validación básica
    if (!rating || !comment || !songId || !songTitle || !artistName) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const newReview = new Review({
      userId: req.user.id,
      userName: req.user.name,
      rating,
      comment,
      songId,
      songTitle,
      artistName,
      albumId
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener todas las reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener reviews por canción
router.get('/song/:songId', async (req, res) => {
  try {
    const { songId } = req.params;
    const reviews = await Review.find({ songId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;