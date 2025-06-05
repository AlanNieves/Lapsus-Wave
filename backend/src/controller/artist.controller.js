import { Artist } from "../models/artist.model.js";

export const getArtistById = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);
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
