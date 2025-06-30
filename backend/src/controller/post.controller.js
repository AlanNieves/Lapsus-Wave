// controller/post.controller.js
import { Post } from "../models/post.model.js";
import { uploadImage } from "../utils/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    if (!req.files?.image) {
      return res.status(400).json({ message: "No se recibió imagen" });
    }

    const result = await uploadImage(req.files.image.tempFilePath);
    const newPost = await Post.create({
      userId: req.userId,
      image: result.secure_url,
      description: req.body.description || "",
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error al crear post", err);
    res.status(500).json({ message: "Error interno" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "nickname image");

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error al cargar posts" });
  }
};
