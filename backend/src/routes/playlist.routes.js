import express from "express";
import {
  getUserPlaylists,
  createPlaylist,
  addSongToPlaylist,
  deletePlaylist,
} from "../controller/playlist.controller.js";

const router = express.Router();

router.get("/", getUserPlaylists);
router.post("/", createPlaylist);
router.patch("/:id/add-song", addSongToPlaylist);
router.delete("/:id", deletePlaylist);
router.get("/", authenticateUser, getUserPlaylists);


export default router;
