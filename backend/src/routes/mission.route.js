import express from ("express");
const router = express.Router();
const { updateMissionProgress } = require("../controller/mission.controller");

router.post("/progress", updateMissionProgress);

export default router;