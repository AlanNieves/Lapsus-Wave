// models/post.model.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
