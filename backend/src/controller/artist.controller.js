import { Artist } from "../models/artist.model.js";

export const getArtistById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({ message: "Artista no encontrado" });
    }
    res.json(artist);
  } catch (error) {
    next(error);
  }
};

export const createArtist = async (req, res, next) => {
  try {
    const { name, image, followers } = req.body;
    const artist = await Artist.create({ name, image, followers });
    res.status(201).json(artist);
  } catch (error) {
    next(error);
  }
};
