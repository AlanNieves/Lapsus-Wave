import { Router } from "express";
import {verifyToken} from "../middleware/verifyToken.js";
import { getStats } from "../controller/stat.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";


const router = Router();

router.get("/", verifyToken, requireAdmin, getStats);

export default router;