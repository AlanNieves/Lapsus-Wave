import mongoose from "mongoose";
import dotenv from "dotenv";
import { Song } from "../src/models/song.model.js";
import { Artist } from "../src/models/artist.model.js";


dotenv.config();

const assignArtistId = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const artistName = "Vegyn"; // 🔁 cámbialo por el nombre que necesites

    const artist = await Artist.findOne({ name: artistName });
    if (!artist) {
      console.log(`❌ No se encontró el artista "${artistName}"`);
      return;
    }

    const result = await Song.updateMany(
      { artist: artistName },
      { $set: { artistId: artist._id } }
    );

    console.log(`✅ Canciones actualizadas: ${result.modifiedCount}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    mongoose.disconnect();
  }
};

assignArtistId();
