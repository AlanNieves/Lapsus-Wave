import express from "express";
import { getArtistById, createArtist } from "../controller/artist.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/:id", protectRoute, getArtistById);
router.post("/", protectRoute, createArtist);

export default router;
