import express from "express";
import {
  getUserPlaylists,
  createPlaylist,
  addSongToPlaylist,
  deletePlaylist,
  getPlaylistById,
  updatePlaylist,
  updateCoverImage,
} from "../controller/playlist.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createPlaylistSchema,
  updatePlaylistSchema,
  addSongToPlaylistSchema,
  updateCoverImageSchema,
} from "../validators/playlist.validator.js";
import { Playlist } from "../models/playlist.model.js";

const router = express.Router();

// Rutas protegidas
router.get("/:id", verifyToken, getPlaylistById);
router.patch("/:id", verifyToken, validateRequest(updatePlaylistSchema), updatePlaylist);
router.patch("/:playlistId/add-song", verifyToken, validateRequest(addSongToPlaylistSchema), addSongToPlaylist);
router.patch("/:id/cover", verifyToken, validateRequest(updateCoverImageSchema), updateCoverImage);
router.delete("/:id", verifyToken, deletePlaylist);
router.get("/", verifyToken, getUserPlaylists);
router.post("/", verifyToken, validateRequest(createPlaylistSchema), createPlaylist);

// Ruta pública para obtener playlists de un usuario específico
router.get("/user/:id", async (req, res) => {
  try {
    const playlists = await Playlist.find({ createdBy: req.params.id });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener playlists del usuario" });
  }
});

export default router;
