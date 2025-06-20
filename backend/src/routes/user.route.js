import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  uploadProfileImage,
  uploadCoverImage,
  updateProfile,
  getAllUsers,
  getMessages,
  getCurrentUser,
} from "../controller/user.controller.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const router = Router();

router.get("/", verifyToken, getAllUsers);
router.get("/messages/:userId", verifyToken, getMessages);
router.get("/me", verifyToken, getCurrentUser);
router.post("/upload-avatar", verifyToken, uploadProfileImage);
router.post("/upload-cover", verifyToken, uploadCoverImage);
router.put("/update", verifyToken, updateProfile);

// ✅ RUTA QUE FALTABA — obtiene perfil público de cualquier usuario con validación de ObjectId
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
});

router.get("/test", (req, res) => {
  res.send("Ruta test OK");
});

export default router;
