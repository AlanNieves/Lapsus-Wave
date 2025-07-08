import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createReview,
  getAllReviews,
  getReviewsBySong,
} from "../controller/review.controller.js";
import validateRequest from "../middleware/validateRequest.js";
import { createReviewSchema } from "../validators/review.validator.js";

const router = Router();

router.post("/", verifyToken, validateRequest(createReviewSchema), createReview);
router.get("/", getAllReviews);
router.get("/song/:songId", getReviewsBySong);

export default router;
