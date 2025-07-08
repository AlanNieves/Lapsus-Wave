import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";
import path from "path";

// ✅ Listas blancas de MIME types permitidos
const allowedImageMimes = ["image/jpeg", "image/png", "image/gif"];
const allowedAudioMimes = ["audio/mpeg", "audio/mp3", "audio/wav"];

// ✅ Listas blancas de extensiones permitidas
const allowedImageExts = [".jpg", ".jpeg", ".png", ".gif"];
const allowedAudioExts = [".mp3", ".wav"];

// ✅ Límites de tamaño
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB

// 🔹 Subida a Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error("Error uploading to Cloudinary");
  }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Por favor sube el audio y la imagen." });
    }

    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    // ✅ Validar tamaño imagen
    if (imageFile.size > MAX_IMAGE_SIZE) {
      return res.status(400).json({ message: "La imagen supera el límite de 2MB." });
    }

    // ✅ Validar tamaño audio
    if (audioFile.size > MAX_AUDIO_SIZE) {
      return res.status(400).json({ message: "El audio supera el límite de 10MB." });
    }

    // ✅ Validar MIME imagen
    if (!allowedImageMimes.includes(imageFile.mimetype)) {
      return res.status(400).json({ message: "Formato de imagen no permitido." });
    }

    // ✅ Validar MIME audio
    if (!allowedAudioMimes.includes(audioFile.mimetype)) {
      return res.status(400).json({ message: "Formato de audio no permitido." });
    }

    // ✅ Validar extensión imagen
    const imageExt = path.extname(imageFile.name).toLowerCase();
    if (!allowedImageExts.includes(imageExt)) {
      return res.status(400).json({ message: "Extensión de imagen no permitida." });
    }

    // ✅ Validar extensión audio
    const audioExt = path.extname(audioFile.name).toLowerCase();
    if (!allowedAudioExts.includes(audioExt)) {
      return res.status(400).json({ message: "Extensión de audio no permitida." });
    }

    // 🔹 Subir archivos a Cloudinary
    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    // 🔹 Crear canción
    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null,
    });

    await song.save();

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    res.status(201).json(song);
  } catch (error) {
    console.log("Error in createSong", error);
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    if (song && song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);

    res.status(200).json({ message: "Canción eliminada correctamente" });
  } catch (error) {
    console.log("Error in deleteSong", error);
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({ message: "Por favor sube la imagen de portada." });
    }

    const { title, artist, releaseYear } = req.body;
    const imageFile = req.files.imageFile;

    // ✅ Validar tamaño
    if (imageFile.size > MAX_IMAGE_SIZE) {
      return res.status(400).json({ message: "La imagen supera el límite de 2MB." });
    }

    // ✅ Validar MIME
    if (!allowedImageMimes.includes(imageFile.mimetype)) {
      return res.status(400).json({ message: "Formato de imagen no permitido." });
    }

    // ✅ Validar extensión
    const imageExt = path.extname(imageFile.name).toLowerCase();
    if (!allowedImageExts.includes(imageExt)) {
      return res.status(400).json({ message: "Extensión de imagen no permitida." });
    }

    // 🔹 Subir imagen a Cloudinary
    const imageUrl = await uploadToCloudinary(imageFile);

    // 🔹 Crear álbum
    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });

    await album.save();

    res.status(201).json(album);
  } catch (error) {
    console.log("Error in createAlbum", error);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);
    res.status(200).json({ message: "Álbum eliminado correctamente" });
  } catch (error) {
    console.log("Error in deleteAlbum", error);
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ admin: true });
};
