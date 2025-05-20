import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
	if (!req.auth?.userId) {
		return res.status(401).json({ message: "Unauthorized - you must be logged in" });
	}

	try {
		const currentUser = await clerkClient.users.getUser(req.auth.userId);

		req.user = {
			_id: req.auth.userId, // usamos userId como _id en lugar de un ObjectId
			email: currentUser.primaryEmailAddress?.emailAddress,
		};

		next();
	} catch (error) {
		console.error("Error en protectRoute:", error);
		return res.status(500).json({ message: "Error al autenticar usuario" });
	}
};

export const requireAdmin = async (req, res, next) => {
	try {
		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

		if (!isAdmin) {
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		next();
	} catch (error) {
		next(error);
	}
};
