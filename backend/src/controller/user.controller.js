import User from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { uploadImage } from "../utils/cloudinary.js"; // ✅ import correcto

// 🔄 Obtener todos los usuarios excepto el autenticado
export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.userId;
    const users = await User.find({ _id: { $ne: currentUserId } });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// 🔄 Obtener mensajes entre dos usuarios
export const getMessages = async (req, res, next) => {
  try {
    const myId = req.userId;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

// 🔎 Obtener perfil del usuario autenticado
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

// ✏️ Actualizar perfil
export const updateProfile = async (req, res) => {
  const { nickname, bio, tags } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    user.nickname = nickname || user.nickname;
    user.bio = bio !== undefined ? bio : user.bio;
    user.tags = Array.isArray(tags) ? tags : user.tags;

    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("❌ Error al guardar perfil:", error);
    res.status(500).json({ message: "Error interno" });
  }
};

// 📷 Subir imagen de perfil a Cloudinary
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.files || !req.files.avatar) {
      return res
        .status(400)
        .json({ success: false, message: "No se recibió imagen" });
    }

    const avatar = req.files.avatar;

    // Subida a Cloudinary
    const result = await uploadImage(avatar.tempFilePath);

    const user = await User.findById(req.userId);
    user.image = result.secure_url;
    await user.save();

    res.status(200).json({ success: true, image: user.image });
  } catch (error) {
    console.error("❌ Error al subir imagen:", error);
    res.status(500).json({ success: false, message: "Error al subir imagen" });
  }
};

export const uploadCoverImage = async (req, res) => {
  try {
    if (!req.files || !req.files.cover) {
      return res.status(400).json({ success: false, message: "No se recibió imagen de portada" });
    }

    const cover = req.files.cover;

    const cloudinary = await import("../utils/cloudinary.js");
    const result = await cloudinary.uploadImage(cover.tempFilePath);

    const user = await User.findById(req.userId);
    user.cover = result.secure_url;
    await user.save();

    res.status(200).json({ success: true, cover: user.cover });
  } catch (error) {
    console.error("Error al subir portada:", error);
    res.status(500).json({ success: false, message: "Error al subir portada" });
  }
};

