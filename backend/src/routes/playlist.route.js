/*import express from "express";
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
router.patch("/:id/cover", protectRoute, updateCoverImage);

// ✅ ESTA ES LA RUTA QUE NECESITAS
router.patch("/:playlistId/add-song", protectRoute, addSongToPlaylist);

router.delete("/:id", protectRoute, deletePlaylist);
router.get("/", protectRoute, getUserPlaylists);
router.post("/", protectRoute, createPlaylist);

export default router;
*/