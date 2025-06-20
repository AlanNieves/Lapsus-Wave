const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Crear una nueva review
router.post('/', auth, async (req, res) => {
  try {
    const { rating, comment, songId, songTitle, artistName } = req.body;
    
    const newReview = new Review({
      userId: req.user.id,
      userName: req.user.name,
      rating,
      comment,
      songId,
      songTitle,
      artistName
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;