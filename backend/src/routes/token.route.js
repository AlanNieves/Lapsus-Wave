import express from "express";
import { sendToken, verifyToken } from "../controller/token.controller.js";
import validateRequest from "../middleware/validateRequest.js";
import { sendTokenSchema, verifyTokenSchema } from "../validators/token.validator.js";

const router = express.Router();

router.post("/send", validateRequest(sendTokenSchema), sendToken);
router.post("/verify", validateRequest(verifyTokenSchema), verifyToken);

export default router;
