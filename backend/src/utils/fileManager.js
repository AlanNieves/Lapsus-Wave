// src/utils/fileManager.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración para almacenamiento de archivos
const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

// Crear directorio si no existe
const ensureUploadsDir = async () => {
  try {
    await fs.access(UPLOADS_DIR);
  } catch (error) {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
};

// Guardar archivo subido
export const saveFile = async (file) => {
  await ensureUploadsDir();
  
  const uniqueName = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(UPLOADS_DIR, uniqueName);
  
  await fs.writeFile(filePath, file.buffer);
  return uniqueName;
};

// Eliminar archivo
export const deleteFile = async (fileName) => {
  const filePath = path.join(UPLOADS_DIR, fileName);
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Obtener ruta del archivo
export const getFilePath = (fileName) => {
  return path.join(UPLOADS_DIR, fileName);
};

export const uploadFile = async (file) => {
  
}

// Ejemplo de uso en tu controlador:
// import { saveFile, deleteFile } from '../utils/fileManager.js';