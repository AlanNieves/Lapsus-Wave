const express = require("express");
const router = express.Router();
const { updateMissionProgress } = require("../controller/mission.controller");

router.post("/progress", updateMissionProgress);

module.exports = router;