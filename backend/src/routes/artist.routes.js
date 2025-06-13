import express from "express";
import { getArtistById, createArtist } from "../controller/artist.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllArtists } from "../controller/artist.controller.js";


const router = express.Router();

router.get("/:id", verifyToken, getArtistById);
router.post("/", verifyToken, createArtist);
router.get("/", getAllArtists);

export default router;