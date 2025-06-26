import User from "../models/user.model.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

// ✅ Obtener canciones marcadas como "me gusta"
export const getLikedSongs = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("likedSongs");
    res.json(user.likedSongs || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener liked songs" });
  }
};

// ✅ Alternar like de canción (agregar o quitar)
export const toggleLikedSong = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const songId = req.params.songId;

    const index = user.likedSongs.indexOf(songId);
    if (index !== -1) {
      user.likedSongs.splice(index, 1); // quitar
    } else {
      user.likedSongs.push(songId); // agregar
    }

    await user.save();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al alternar canción" });
  }
};

// ✅ Obtener álbumes guardados
export const getSavedAlbums = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("savedAlbums");
    res.json(user.savedAlbums || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener álbumes" });
  }
};

// ✅ Alternar álbum (guardar/quitar)
export const toggleSavedAlbum = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const albumId = req.params.albumId;

    const index = user.savedAlbums.indexOf(albumId);
    if (index !== -1) {
      user.savedAlbums.splice(index, 1); // quitar
    } else {
      user.savedAlbums.push(albumId); // agregar
    }

    await user.save();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al alternar álbum" });
  }
};
