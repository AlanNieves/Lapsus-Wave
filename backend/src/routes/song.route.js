import { Router } from "express";
import {
  getAllSongs,
  getFeaturedSongs,
  getMadeForYouSongs,
  getTrendingSongs,
  getSongsByArtist,
  getSongById
} from "../controller/song.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
// Se elimina requireAdmin si no lo estás usando aquí
// import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

// Rutas
router.get("/", verifyToken, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/by-artist/:id", verifyToken, getSongsByArtist);
router.get("/:id", verifyToken, getSongById); // Ahora requiere autenticación

export default router;
