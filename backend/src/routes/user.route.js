import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getAllUsers, getMessages } from "../controller/user.controller.js";
const router = Router();

router.get("/", verifyToken, getAllUsers);
router.get("/messages/:userId", verifyToken, getMessages);

export default router;