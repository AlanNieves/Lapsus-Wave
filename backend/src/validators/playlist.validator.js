import Joi from "joi";

// Crear Playlist
export const createPlaylistSchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().allow("").optional()
});

// Actualizar Playlist
export const updatePlaylistSchema = Joi.object({
  name: Joi.string().min(1),
  description: Joi.string().allow("")
});

// Añadir Canción a Playlist
export const addSongToPlaylistSchema = Joi.object({
  songId: Joi.string().required()
});

// Actualizar Cover Image
export const updateCoverImageSchema = Joi.object({
  coverUrl: Joi.string().uri().required()
});
