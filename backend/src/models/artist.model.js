import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "", 
  },
  followers: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export const Artist = mongoose.model("Artist", artistSchema);
