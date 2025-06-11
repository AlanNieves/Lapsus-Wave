
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { user, checkAuth } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			try {
				await checkAuth();

				// Iniciar socket si hay usuario
				if (user?._id) initSocket(user._id);
			} catch (error) {
				console.error("Error en AuthProvider:", error);
			} finally {
				setLoading(false);
			}
		};

		initAuth();

		return () => disconnectSocket();
	}, [checkAuth, user, initSocket, disconnectSocket]);

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
