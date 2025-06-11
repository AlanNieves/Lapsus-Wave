import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ success: false, message: "No autorizado - no token" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) {
			return res.status(401).json({ success: false, message: "Token inválido" });
		}

		req.userId = decoded.userId; // usado en checkAuth
		next();
	} catch (error) {
		console.error("Error en verifyToken", error);
		return res.status(500).json({ success: false, message: "Error en el servidor" });
	}
};
