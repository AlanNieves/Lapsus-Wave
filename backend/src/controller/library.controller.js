import mongoose from "mongoose";
import User from "../models/user.model.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

// Obtener canciones marcadas como "me gusta"
export const getLikedSongs = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("likedSongs");
    res.json(user.likedSongs || []);
  } catch (error) {
    console.error("Error al obtener liked songs:", error);
    next(error);
  }
};

// Alternar like de canción (agregar o quitar)
export const toggleLikedSong = async (req, res, next) => {
  try {
    const { songId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: "ID de canción inválido" });
    }

    const user = await User.findById(req.userId);

    let liked;
    const index = user.likedSongs.indexOf(songId);
    if (index !== -1) {
      user.likedSongs.splice(index, 1);
      liked = false;
    } else {
      user.likedSongs.push(songId);
      liked = true;
    }

    await user.save();
    res.json({ success: true, liked });
  } catch (error) {
    console.error("Error al alternar canción:", error);
    next(error);
  }
};

// Obtener álbumes guardados
export const getSavedAlbums = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("savedAlbums");
    res.json(user.savedAlbums || []);
  } catch (error) {
    console.error("Error al obtener álbumes:", error);
    next(error);
  }
};

// Alternar álbum (guardar/quitar)
export const toggleSavedAlbum = async (req, res, next) => {
  try {
    const { albumId } = req.params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      return res.status(400).json({ message: "ID de álbum inválido" });
    }

    const user = await User.findById(req.userId);

    let saved;
    const index = user.savedAlbums.indexOf(albumId);
    if (index !== -1) {
      user.savedAlbums.splice(index, 1);
      saved = false;
    } else {
      user.savedAlbums.push(albumId);
      saved = true;
    }

    await user.save();
    res.json({ success: true, saved });
  } catch (error) {
    console.error("Error al alternar álbum:", error);
    next(error);
  }
};


