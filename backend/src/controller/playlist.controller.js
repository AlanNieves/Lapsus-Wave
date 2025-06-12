import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.model.js";
import mongoose from "mongoose"; 
import path from "path";
import fs from "fs";

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

export const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const playlist = await Playlist.findById(id).populate("songs");

    if (!playlist) {
      return res.status(404).json({ message: "Playlist no encontrada" });
    }

    // Verificar si el usuario es el dueño o la playlist es pública
    if (String(playlist.createdBy) !== String(userId) && !playlist.isPublic) {
      return res.status(403).json({ message: "No tienes acceso a esta playlist" });
    }

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const { songId } = req.body;
    const userId = req.userId;

    const playlist = await Playlist.findOne({ _id: playlistId, createdBy: userId });
    if (!playlist) return res.status(404).json({ message: "Playlist no encontrada" });

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: "Canción no encontrada" });

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ message: "La canción ya está en la playlist" });
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const playlist = await Playlist.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist no encontrada o no tienes permisos" });
    }

    res.json({ message: "Playlist eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};

export const updateCoverImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!req.files || !req.files.cover) {
      return res.status(400).json({ message: "No se subió ninguna imagen." });
    }

    const cover = req.files.cover;
    const ext = path.extname(cover.name);
    const filename = `cover_${id}_${Date.now()}${ext}`;
    const uploadPath = path.join(process.cwd(), "uploads", filename);

    await cover.mv(uploadPath);

    const playlist = await Playlist.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { coverImage: filename },
      { new: true }
    );

    if (!playlist) {
      return res.status(404).json({ message: "Playlist no encontrada o no tienes permisos" });
    }

    res.json(playlist);
  } catch (error) {
    console.error("❌ Error en updateCoverImage:", error);
    next(error);
  }
};

export const updatePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { name, description, isPublic } = req.body;

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist no encontrada" });
    }

    if (String(playlist.createdBy) !== String(userId)) {
      return res.status(403).json({ message: "No tienes permisos para editar esta playlist" });
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
