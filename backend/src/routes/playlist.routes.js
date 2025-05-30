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

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:id", protectRoute, getPlaylistById);
router.patch("/:id", protectRoute, updatePlaylist);

// ✅ CAMBIADO: antes decía :id/add-song — ahora :playlistId/add-song
router.patch("/:playlistId/add-song", protectRoute, addSongToPlaylist);

router.patch("/:id/cover", protectRoute, updateCoverImage);
router.delete("/:id", protectRoute, deletePlaylist);
router.get("/", protectRoute, getUserPlaylists);
router.post("/", protectRoute, createPlaylist);

// Ruta de prueba opcional
router.get("/test/:id", (req, res) => {
  console.log("🧪 Ruta de prueba alcanzada con ID:", req.params.id);
  res.json({ msg: "Funciona", id: req.params.id });
});

export default router;
