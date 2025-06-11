import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import fs from "fs";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import cron from "node-cron";

import { initializeSocket } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";

import playlistRoutes from "./routes/playlist.routes.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import artistRoutes from "./routes/artist.routes.js";

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
initializeSocket(httpServer);

// 🧁 Servir archivos subidos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🛡️ CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL, // o 5173 si usas Vite
    credentials: true,
  })
);

// 🍪 Parsear cookies
app.use(cookieParser());

// 🧠 Parsear JSON
app.use(express.json());

// 📁 Subidas de archivos
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  })
);

// 🔁 Rutas API
app.use("/api/artists", artistRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes); // ← Aquí ya entra tu sistema MERN
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/playlists", playlistRoutes);

// 🧹 Limpieza de temporales
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) return;
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), () => {});
      }
    });
  }
});

// 🌍 Servir frontend en producción
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

// 🧨 Manejador global de errores
app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

console.log("Entorno:", process.env.NODE_ENV);
console.log("Frontend permitido:", process.env.CLIENT_URL);

// 🚀 Iniciar servidor
httpServer.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto " + PORT);
  connectDB();
});
