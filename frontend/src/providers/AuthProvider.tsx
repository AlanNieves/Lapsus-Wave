import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { user, checkAuth } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();
	const [loading, setLoading] = useState(true);

	// 1️⃣ Solo una vez al montar
	useEffect(() => {
		const initAuth = async () => {
			try {
				await checkAuth();
			} catch (error) {
				console.error("Error en AuthProvider:", error);
			} finally {
				setLoading(false);
			}
		};

		initAuth();
		// ⚠ NO incluir user ni checkAuth en dependencias
		// Solo se llama una vez al montar
	}, []);

	// 2️⃣ Escuchar cuando el usuario ya está cargado
	useEffect(() => {
		if (user?._id) {
			initSocket(user._id);
		}

		return () => {
			disconnectSocket();
		};
	}, [user, initSocket, disconnectSocket]);

	if (loading) {
		return (
			<div className="h-screen w-full flex items-center justify-center">
				<Loader className="size-8 text-lapsus-1100 animate-spin" />
			</div>
		);
	}

	return <>{children}</>;
};

export default AuthProvider;