import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    songs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song"
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);