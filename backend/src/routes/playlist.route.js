import { Router } from "express";
import { 
  createPlaylist,
  getUserPlaylists,
  getPlaylistDetails,
  updatePlaylistSongs
} from "../controller/playlist.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

router.post("/", createPlaylist);
router.get("/", getUserPlaylists);
router.get("/:id", getPlaylistDetails);
router.patch("/:id/songs", updatePlaylistSongs);

export default router;