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

const Post = mongoose.model("Post", postSchema);
export default Post;