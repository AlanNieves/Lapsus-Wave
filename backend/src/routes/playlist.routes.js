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
import { Playlist } from "../models/playlist.model.js"; // ✅ CORRECTO

const router = express.Router();

router.get("/:id", verifyToken, getPlaylistById);
router.patch("/:id", verifyToken, updatePlaylist);
router.patch("/:playlistId/add-song", verifyToken, addSongToPlaylist);
router.patch("/:id/cover", verifyToken, updateCoverImage);
router.delete("/:id", verifyToken, deletePlaylist);
router.get("/", verifyToken, getUserPlaylists);
router.post("/", verifyToken, createPlaylist);

// 🟩 Ruta opcional para test
router.get("/test/:id", (req, res) => {
  console.log("🧪 Ruta de prueba alcanzada con ID:", req.params.id);
  res.json({ msg: "Funciona", id: req.params.id });
});

// 🟦 Ruta para obtener playlists de un usuario específico
router.get("/user/:id", async (req, res) => {
  try {
    const playlists = await Playlist.find({ createdBy: req.params.id });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener playlists del usuario" });
  }
});

export default router;
