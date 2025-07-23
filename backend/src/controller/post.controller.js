import  Post  from "../models/post.model.js";
import { uploadImage } from "../utils/cloudinary.js";

export const createPost = async (req, res, next) => {
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
  } catch (error) {
    console.error("Error al crear post:", error);
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "nickname avatar");

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error al cargar posts:", error);
    next(error);
  }
};
