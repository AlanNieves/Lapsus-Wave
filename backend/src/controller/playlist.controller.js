import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.model.js";

export const createPlaylist = async (req, res, next) => {
  try {
    const { name, description, isPublic } = req.body;
    const userId = req.user._id;

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
    const userId = req.user._id;
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
    const playlist = await Playlist.findById(id).populate("songs");

    if (!playlist) {
      return res.status(404).json({ message: "Playlist no encontrada" });
    }

    // Verificar si el usuario es el dueño o la playlist es pública
    if (playlist.createdBy !== req.user._id && !playlist.isPublic) {
      return res.status(403).json({ message: "No tienes acceso a esta playlist" });
    }

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.params;
    const userId = req.user._id;

    // Verificar que la playlist existe y pertenece al usuario
    const playlist = await Playlist.findOne({
      _id: playlistId,
      createdBy: userId,
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist no encontrada o no tienes permisos" });
    }

    // Verificar que la canción existe
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }

    // Evitar duplicados
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ message: "La canción ya está en la playlist" });
    }

    // Añadir la canción
    playlist.songs.push(songId);
    await playlist.save();

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.params;
    const userId = req.user._id;

    const playlist = await Playlist.findOne({
      _id: playlistId,
      createdBy: userId,
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist no encontrada o no tienes permisos" });
    }

    // Verificar que la canción está en la playlist
    const songIndex = playlist.songs.indexOf(songId);
    if (songIndex === -1) {
      return res.status(404).json({ message: "La canción no está en esta playlist" });
    }

    // Remover la canción
    playlist.songs.splice(songIndex, 1);
    await playlist.save();

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

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

export const updatePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { name, description, isPublic, coverImage } = req.body;

    const playlist = await Playlist.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { name, description, isPublic, coverImage },
      { new: true, runValidators: true }
    );

    if (!playlist) {
      return res.status(404).json({ message: "Playlist no encontrada o no tienes permisos" });
    }

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};