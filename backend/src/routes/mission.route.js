import express from "express";
import { updateMissionProgress } from "../controller/mission.controller.js";
import validateRequest from "../middleware/validateRequest.js";
import { updateMissionProgressSchema } from "../validators/mission.validator.js";

const router = express.Router();

router.post("/progress", validateRequest(updateMissionProgressSchema), updateMissionProgress);

export default router;
