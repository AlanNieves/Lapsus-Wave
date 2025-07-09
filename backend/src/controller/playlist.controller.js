import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.model.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

/**
 * Crear una nueva playlist
 */
export const createPlaylist = async (req, res, next) => {
  try {
    const { name, description, isPublic } = req.body;
    const userId = req.userId;

    const playlist = await Playlist.create({
      name,
      description,
      isPublic,
      createdBy: userId,
      songs: [],
    });

    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener todas las playlists del usuario autenticado
 */
export const getUserPlaylists = async (req, res, next) => {
  try {
    const userId = req.userId;
    const playlists = await Playlist.find({ createdBy: userId }).sort({
      createdAt: -1,
    });
    res.json(playlists);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener una playlist por ID
 */
export const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const playlist = await Playlist.findById(id).populate("songs");

    if (!playlist) {
      return res.status(404).json({ message: "Playlist no encontrada" });
    }

    // Verificar permisos
    if (
      playlist.createdBy.toString() !== req.userId &&
      !playlist.isPublic
    ) {
      return res
        .status(403)
        .json({ message: "No tienes acceso a esta playlist" });
    }

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

/**
 * Agregar una canción a la playlist
 */
export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const { songId } = req.body;
    const userId = req.userId;

    // Validar IDs
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({ message: "ID de playlist inválido" });
    }
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: "ID de canción inválido" });
    }

    const playlist = await Playlist.findOne({
      _id: playlistId,
      createdBy: userId,
    });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist no encontrada" });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }

    if (playlist.songs.includes(songId)) {
      return res
        .status(400)
        .json({ message: "La canción ya está en la playlist" });
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar una playlist
 */
export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const playlist = await Playlist.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });

    if (!playlist) {
      return res
        .status(404)
        .json({ message: "Playlist no encontrada o no tienes permisos" });
    }

    res.json({ message: "Playlist eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar la imagen de portada
 */
export const updateCoverImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    //  Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    //  Validar que se haya subido un archivo
    if (!req.files || !req.files.cover) {
      return res.status(400).json({ message: "No se subió ninguna imagen." });
    }

    const cover = req.files.cover;

    //  Validar tipo MIME
    if (!cover.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Formato de imagen inválido." });
    }

    //  Validar tamaño máximo (2MB)
    if (cover.size > 2 * 1024 * 1024) {
      return res.status(400).json({ message: "La imagen supera el límite de 2MB." });
    }

    // Lista blanca de extensiones permitidas
    const allowedExts = [".jpg", ".jpeg", ".png", ".gif"];

    // Sanitizar nombre
    const safeName = path
      .basename(cover.name)
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    //  Extraer extensión
    const ext = path.extname(safeName).toLowerCase();

    //  Validar extensión
    if (!allowedExts.includes(ext)) {
      return res.status(400).json({ message: "Extensión de imagen no permitida." });
    }

    //  Generar nombre único
    const filename = `cover_${id}_${Date.now()}${ext}`;
    const uploadPath = path.join(process.cwd(), "uploads", filename);

    //  Mover archivo
    await cover.mv(uploadPath);

    //  Actualizar la playlist con la nueva imagen
    const playlist = await Playlist.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { coverImage: filename },
      { new: true }
    );

    if (!playlist) {
      return res
        .status(404)
        .json({ message: "Playlist no encontrada o no tienes permisos" });
    }

    res.json(playlist);
  } catch (error) {
    console.error("❌ Error en updateCoverImage:", error);
    next(error);
  }
};


/**
 * Actualizar datos de la playlist
 */
export const updatePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { name, description, isPublic } = req.body;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist no encontrada" });
    }

    if (playlist.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para editar esta playlist" });
    }

    if (name !== undefined) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (isPublic !== undefined) playlist.isPublic = isPublic;

    await playlist.save();
    res.json(playlist);
  } catch (error) {
    next(error);
  }
};