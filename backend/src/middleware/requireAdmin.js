import  User  from "../models/user.model.js";

export const requireAdmin = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId);
		if (!user || user.email !== process.env.ADMIN_EMAIL) {
			return res.status(403).json({ message: "No autorizado - admin requerido" });
		}
		next();
	} catch (error) {
		return res.status(500).json({ message: "Error en validación admin" });
	}
};