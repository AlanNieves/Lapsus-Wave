import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sube una imagen a Cloudinary y devuelve el resultado.
 * @param {string} filePath - Ruta temporal del archivo
 * @returns {Promise<object>} Resultado de Cloudinary
 */
export const uploadImage = (filePath) => {
  return cloudinary.uploader.upload(filePath, {
    folder: "lapsus/profiles", // puedes cambiar el folder
    width: 300,
    crop: "scale",
  });
};
