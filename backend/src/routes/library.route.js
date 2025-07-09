import express from "express";
import {
  getLikedSongs,
  toggleLikedSong,
  getSavedAlbums,
  toggleSavedAlbum,
} from "../controller/library.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Canciones
router.get("/liked-songs", verifyToken, getLikedSongs);
router.post("/liked-songs/:songId", verifyToken, toggleLikedSong);

// Álbumes
router.get("/saved-albums", verifyToken, getSavedAlbums);
router.post("/saved-albums/:albumId", verifyToken, toggleSavedAlbum);

export default router;
