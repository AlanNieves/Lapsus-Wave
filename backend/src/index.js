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
import playlistRoutes from "./routes/playlist.route.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import artistRoutes from "./routes/artist.routes.js";
import tokenRoutes from "./routes/token.route.js";
import reviewRoutes from "./routes/review.route.js";
dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

// 👇 metemos todo en una función async para poder usar await
const startServer = async () => {
  
  initializeSocket(httpServer); // 🧠 WebSockets

  // 🧁 Servir archivos subidos
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // 🛡️ CORS
  const whitelist = [process.env.CLIENT_URL];
  app.use(
    cors({
      origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if(whitelist.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("No permitido por CORS"));
        }
      },
      credentials: true, // permitir cookies
    })
  );

  // 🍪 Cookies y JSON
  app.use(cookieParser());
  app.use(express.json());

  // 📁 Archivos
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
      createParentPath: true,
      limits: {
        fileSize: 10 * 1024 * 1024,
      },  
    })
  );

  // 🔁 Rutas
  app.use("/api/artists", artistRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api", authRoutes);
  app.use("/api/songs", songRoutes);
  app.use("/api/albums", albumRoutes);
  app.use("/api/stats", statRoutes);
  app.use("/api/playlists", playlistRoutes);
  app.use("/api/token", tokenRoutes);
  app.use("/api/reviews", reviewRoutes);

  // 🧹 Cron para limpiar archivos temporales
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
      res.sendFile(
        path.resolve(__dirname, "../frontend", "dist", "index.html")
      );
    });
  }

  // 🧨 Manejo de errores
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
    connectDB(); // conectar a Mongo
  });
};

startServer(); // 👈 ejecutamos la función
