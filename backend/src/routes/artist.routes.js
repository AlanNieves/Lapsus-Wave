import express from "express";
import { getArtistById, createArtist } from "../controller/artist.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";



const router = express.Router();

router.get("/:id", verifyToken, getArtistById);
router.post("/", verifyToken, createArtist);

export default router;
