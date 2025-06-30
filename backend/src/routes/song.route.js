import { Router } from "express";
import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs, getSongsByArtist  } from "../controller/song.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { getSongById } from "../controller/song.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", verifyToken, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/by-artist/:id", verifyToken, getSongsByArtist);
router.get("/:id", getSongById);


export default router;