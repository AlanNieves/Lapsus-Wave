import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { uploadProfileImage, uploadCoverImage } from "../controller/user.controller.js";
import fileUpload from "express-fileupload";
import { updateProfile, getAllUsers, getMessages, getCurrentUser } from "../controller/user.controller.js";
const router = Router();

router.get("/", verifyToken, getAllUsers);
router.get("/messages/:userId", verifyToken, getMessages);
router.get("/me", verifyToken, getCurrentUser); 
router.post("/upload-avatar", verifyToken, uploadProfileImage);
router.post("/upload-cover", verifyToken, uploadCoverImage);
router.put("/update", verifyToken, updateProfile);

export default router;