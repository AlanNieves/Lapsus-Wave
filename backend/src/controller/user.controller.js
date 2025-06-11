import  User  from "../models/user.model.js";
import { Message } from "../models/message.model.js";

// 🔄 Obtener todos los usuarios excepto el que está autenticado
export const getAllUsers = async (req, res, next) => {
	try {
		const currentUserId = req.userId; // JWT ya te da esto desde verifyToken.js
		const users = await User.find({ _id: { $ne: currentUserId } });
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

// 🔄 Obtener mensajes entre el usuario autenticado y otro
export const getMessages = async (req, res, next) => {
	try {
		const myId = req.userId;
		const { userId } = req.params;

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};