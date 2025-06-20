import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import User from "../models/user.model.js";

const router = express.Router();

router.post("/:id", verifyToken, async (req, res) => {
  try {
    const followerId = req.userId;
    const followedId = req.params.id;

    if (followerId === followedId) {
      return res.status(400).json({ message: "No puedes seguirte a ti mismo" });
    }

    const user = await User.findById(followedId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const alreadyFollowing = user.followers?.includes(followerId);
    if (alreadyFollowing) {
      user.followers = user.followers.filter((id) => id !== followerId);
    } else {
      user.followers = [...(user.followers || []), followerId];
    }

    await user.save();
    res.json({ following: !alreadyFollowing });
  } catch (err) {
    console.error("Error al seguir usuario:", err);
    res.status(500).json({ message: "Error al seguir usuario" });
  }
});

export default router;
