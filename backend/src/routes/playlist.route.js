import { Router } from "express";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist,
    updatePlaylist,
} from "../controller/playlist.controller.js";
import  { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

//all the routes are protected
router.use(protectRoute);

router.post("/", createPlaylist);
router.get("/", getUserPlaylists);
router.get("/:id", getPlaylistById);
router.put("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);

//routes to manage the songs in the playlist
router.post("/:playlistId/songs/:songId", addSongToPlaylist);
router.delete("/:playlistId/songs/:songId", removeSongFromPlaylist);

export default router;