import { Song } from "../models/song.model.js";

// Obtener todas las canciones (orden descendente por fecha)
export const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find()
      .sort({ createdAt: -1 })
      .select("title artist artistId imageUrl audioUrl duration createdAt");
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

// Canciones destacadas (6 aleatorias)
export const getFeaturedSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      { $sample: { size: 6 } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          artistId: 1, // ✅ necesario para la vista de artista
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

// Hechas para ti (4 aleatorias)
export const getMadeForYouSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          artistId: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

// Canciones en tendencia (4 aleatorias)
export const getTrendingSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          artistId: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

// Obtener canciones por artista (usado en ArtistPage)
export const getSongsByArtist = async (req, res, next) => {
  try {
    const songs = await Song.find({ artistId: req.params.id }).populate("artistId");
    res.json(songs);
  } catch (error) {
    next(error);
  }
};
