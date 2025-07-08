import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // ⚠️ en producción usa process.env.CLIENT_URL
      credentials: true,
    },
  });

  // Mapa de usuarios conectados: { userId => socketId }
  const userSockets = new Map();

  // Mapa de actividades del usuario: { userId => "Idle" | "Typing" | etc. }
  const userActivities = new Map();

  io.on("connection", (socket) => {
    try {
      // 1️⃣ Leer cookies de la request inicial
      const cookies = cookie.parse(socket.request.headers.cookie || "");

      // 2️⃣ Obtener el accessToken
      const token = cookies.accessToken;

      if (!token) {
        console.log("❌ Socket sin token. Desconectando...");
        socket.disconnect();
        return;
      }

      // 3️⃣ Verificar token con JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4️⃣ Extraer userId
      const userId = decoded.userId;
      console.log(`✅ Socket conectado con usuario: ${userId}`);

      // 5️⃣ Registrar la conexión automáticamente
      if (userSockets.has(userId)) {
        const oldSocketId = userSockets.get(userId);
        if (oldSocketId !== socket.id) {
          io.to(oldSocketId).disconnectSockets(true);
        }
      }

      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle");

      io.emit("user_connected", userId);
      socket.emit("users_online", Array.from(userSockets.keys()));
      io.emit("activities", Array.from(userActivities.entries()));

      // 6️⃣ Actualización de actividad
      socket.on("update_activity", (activity) => {
        userActivities.set(userId, activity);
        io.emit("activity_updated", { userId, activity });
      });

      // 7️⃣ Envío de mensajes
      socket.on("send_message", async (data) => {
        try {
          const { receiverId, content } = data;

          const message = await Message.create({
            senderId: userId,
            receiverId,
            content,
          });

          const receiverSocketId = userSockets.get(receiverId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("receive_message", message);
          }

          socket.emit("message_sent", message);
        } catch (err) {
          console.error("Message error:", err);
          socket.emit("message_error", err.message);
        }
      });

      // 8️⃣ Manejo de desconexión
      socket.on("disconnect", () => {
        if (userSockets.get(userId) === socket.id) {
          userSockets.delete(userId);
          userActivities.delete(userId);
          io.emit("user_disconnected", userId);
        }
      });
    } catch (err) {
      console.error("❌ Error autenticando socket:", err.message);
      socket.disconnect();
    }
  });
};
