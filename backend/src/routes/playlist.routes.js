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

import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getPlaylistById);
router.patch("/:id", verifyToken, updatePlaylist);

// ✅ CAMBIADO: antes decía :id/add-song — ahora :playlistId/add-song
router.patch("/:playlistId/add-song", verifyToken, addSongToPlaylist);

router.patch("/:id/cover", verifyToken, updateCoverImage);
router.delete("/:id", verifyToken, deletePlaylist);
router.get("/", verifyToken, getUserPlaylists);
router.post("/", verifyToken, createPlaylist);

// Ruta de prueba opcional
router.get("/test/:id", (req, res) => {
  console.log("🧪 Ruta de prueba alcanzada con ID:", req.params.id);
  res.json({ msg: "Funciona", id: req.params.id });
});

export default router;