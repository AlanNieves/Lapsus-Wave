import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.model.js";

export const createPlaylist = async (req, res, next) => {
  try {
    const { name, description, songs, isPublic } = req.body;
    const validSongs = await Song.find({ _id: {$in: songs } });
    if(validSongs.length !== songs.length) {
        return res.status(409).json({ message: "Una o mas canciones no existen"});
    }
    
    const newPlaylist = await Playlist.create({
      name,
      description,
      songs,
      isPublic,
      createdBy: req.user.id
    });

    res.status(201).json(newPlaylist);
  } catch (error) {
    next(error);
  }
};

export const getUserPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ createdBy: req.user.id })
      .populate("songs")
      .sort({ createdAt: -1 });

    res.status(200).json(playlists);
  } catch (error) {
    next(error);
  }
};

export const getPlaylistDetails = async (req, res, next) => {
  try {
    const stats = await Playlist.aggregate([
        { $match: { _id: playlist._id} },
        {
            $project: {
                totalSongs:{ $size: "$songs"},
                totalDuration: { $sum: "$songs.duration"}
            }
        }
    ]); 

    const playlist = await Playlist.findById(req.params.id)
      .populate("songs")
      .populate("createdBy", "username profileImage");

    if (!playlist) return res.status(404).json({ message: "Playlist not found" });
    
    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const updatePlaylistSongs = async (req, res, next) => {
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      req.params.id,
      { $set: { songs: req.body.songs } },
      { new: true }
    ).populate("songs");

    res.status(200).json(updatedPlaylist);
  } catch (error) {
    next(error);
  }
};