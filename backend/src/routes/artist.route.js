import express from "express";
import { getArtistById, createArtist } from "../controller/artist.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import validateRequest from "../middleware/validateRequest.js";
import { createArtistSchema } from "../validators/artist.validator.js";

const router = express.Router();

router.get("/:id", verifyToken, getArtistById);
router.post("/", verifyToken, validateRequest(createArtistSchema), createArtist);

export default router;
