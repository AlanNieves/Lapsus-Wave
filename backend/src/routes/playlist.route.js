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
  updateCoverImageSchema
} from "../validators/playlist.validator.js";

const router = express.Router();

router.get("/:id", verifyToken, getPlaylistById);
router.patch("/:id", verifyToken, validateRequest(updatePlaylistSchema), updatePlaylist);
router.patch("/:playlistId/add-song", verifyToken, validateRequest(addSongToPlaylistSchema), addSongToPlaylist);
router.patch("/:id/cover", verifyToken, validateRequest(updateCoverImageSchema), updateCoverImage);
router.delete("/:id", verifyToken, deletePlaylist);
router.get("/", verifyToken, getUserPlaylists);
router.post("/", verifyToken, validateRequest(createPlaylistSchema), createPlaylist);

export default router;
