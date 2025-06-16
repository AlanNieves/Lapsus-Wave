import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:5173", // ⚠️ usa process.env.CLIENT_URL en producción
			credentials: true,
		},
		allowRequest: (req, callback) => {
			const isAuthorized = Boolean(req.headers.cookie?.includes("token="));
			callback(null, isAuthorized);	
		}
	});

	// Mapa de usuarios conectados: { userId => socketId }
	const userSockets = new Map();

	// Mapa de actividades del usuario: { userId => "Idle" | "Typing" | etc. }
	const userActivities = new Map();

	io.on("connection", (socket) => {

		// Cuando el cliente informa que un usuario se conectó
		socket.on("user_connected", (userId) => {
			// Si ya había conexión previa, desconectarla
			if (userSockets.has(userId)) {
				const oldSocketId = userSockets.get(userId);
				if (oldSocketId !== socket.id) {
					io.to(oldSocketId).disconnectSockets(true);
				}
			}

			// Registrar el nuevo socket
			userSockets.set(userId, socket.id);
			userActivities.set(userId, "Idle");

			// Emitir eventos de estado
			io.emit("user_connected", userId);
			socket.emit("users_online", Array.from(userSockets.keys()));
			io.emit("activities", Array.from(userActivities.entries()));
		});

		// Actualización de actividad (ej. escribiendo)
		socket.on("update_activity", ({ userId, activity }) => {
			userActivities.set(userId, activity);
			io.emit("activity_updated", { userId, activity });
		});

		// Envío de mensaje directo
		socket.on("send_message", async (data) => {
			try {
				const { senderId, receiverId, content } = data;

				const message = await Message.create({ senderId, receiverId, content });

				// Emitir al receptor si está conectado
				const receiverSocketId = userSockets.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receive_message", message);
				}

				// Confirmar envío al emisor
				socket.emit("message_sent", message);
			} catch (error) {
				console.error("Message error:", error);
				socket.emit("message_error", error.message);
			}
		});

		// Manejo de desconexión
		socket.on("disconnect", () => {
			let disconnectedUserId = null;

			for (const [userId, socketId] of userSockets.entries()) {
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					break;
				}
			}

			if (disconnectedUserId) {
				userSockets.delete(disconnectedUserId);
				userActivities.delete(disconnectedUserId);
				io.emit("user_disconnected", disconnectedUserId);
			}
		});
	});
};
