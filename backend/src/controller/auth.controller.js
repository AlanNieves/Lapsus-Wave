import bcryptjs from "bcryptjs";
import crypto from "crypto";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { verifyGoogleToken } from "../utils/googleAuth.js";

// ✅ SIGNUP LOCAL
export const signup = async (req, res) => {
	const { email, password, fullName, imageUrl } = req.body;

	try {
		if (!email || !password || !fullName || !imageUrl) {
			throw new Error("Todos los campos son obligatorios");
		}

		const userAlreadyExists = await User.findOne({ email });
		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "El usuario ya existe" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			fullName,
			imageUrl,
			authProvider: "local",
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
		});

		await user.save();
		generateTokenAndSetCookie(res, user._id);
		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "Usuario creado. Verifica tu correo.",
			user: { ...user._doc, password: undefined },
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// ✅ LOGIN LOCAL
export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user || user.authProvider !== "local") {
			return res.status(400).json({ success: false, message: "Credenciales inválidas" });
		}

		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Credenciales inválidas" });
		}

		generateTokenAndSetCookie(res, user._id);
		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Sesión iniciada",
			user: { ...user._doc, password: undefined },
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// ✅ LOGIN CON GOOGLE
export const loginWithGoogle = async (req, res) => {
	const { credential } = req.body;

	try {
		if (!credential) {
			return res.status(400).json({ success: false, message: "Token de Google requerido" });
		}

		const payload = await verifyGoogleToken(credential);
		const { sub: googleId, email, name, picture } = payload;

		let user = await User.findOne({ googleId });

		// Si no existe por googleId, lo buscamos por email (posible registro previo)
		if (!user && email) {
			user = await User.findOne({ email });
		}

		// Si no existe todavía, lo creamos
		if (!user) {
			user = await User.create({
				googleId,
				email,
				nickname: name,
				imageUrl: picture,
				authProvider: "google",
				isVerified: true,
			});
		}

		generateTokenAndSetCookie(res, user._id);
		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Sesión iniciada con Google",
			user: { ...user._doc, password: undefined },
		});
	} catch (error) {
		console.error("Error en loginWithGoogle:", error);
		res.status(401).json({ success: false, message: "Token inválido o expirado" });
	}
};

// ✅ VERIFY EMAIL
export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Código inválido o expirado" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.fullName);

		res.status(200).json({
			success: true,
			message: "Correo verificado correctamente",
			user: { ...user._doc, password: undefined },
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Error interno del servidor" });
	}
};

// ✅ LOGOUT
export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Sesión cerrada" });
};

// ✅ FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Usuario no encontrado" });
		}

		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000;

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;
		await user.save();

		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Enlace enviado al correo electrónico" });
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// ✅ RESET PASSWORD
export const resetPassword = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;

	try {
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Token inválido o expirado" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;

		await user.save();
		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Contraseña actualizada" });
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// ✅ CHECK AUTH
export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "Usuario no encontrado" });
		}
		res.status(200).json({ success: true, user });
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};