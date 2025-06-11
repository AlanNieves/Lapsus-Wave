import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la playlist es requerido"],
      trim: true,
      maxlength: [50, "El nombre no puede exceder los 50 caracteres"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "La descripción no puede exceder los 200 caracteres"],
    },
    coverImage: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Ahora referenciamos al modelo User
      required: true,
    },
  },
  { timestamps: true }
);

// Índices para mejorar las consultas
playlistSchema.index({ createdBy: 1 });
playlistSchema.index({ isPublic: 1 });

export const Playlist = mongoose.model("Playlist", playlistSchema);
