// src/routes/token.route.js
import express from "express";
import { sendToken, verifyToken } from "../controller/token.controller.js";

const router = express.Router();

router.post("/send", sendToken);
router.post("/verify", verifyToken);

export default router;