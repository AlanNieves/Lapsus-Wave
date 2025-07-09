// route/post.route.js
import { Router } from "express";
import { createPost, getPosts } from "../controller/post.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";


const router = Router();

router.post("/", verifyToken, createPost);

router.get("/", verifyToken, getPosts);

export default router;
