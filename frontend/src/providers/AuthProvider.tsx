import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, checkAuth } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();
  const navigate = useNavigate();

  // ✅ Llamar checkAuth una sola vez
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ Inicializar socket cuando el usuario existe y el perfil está completo
  useEffect(() => {
    if (user?._id && user.isProfileComplete) {
      console.log("✅ Inicializando socket para el usuario:", user._id);
      initSocket(user._id);
    }
  }, [user, initSocket]);

  // ✅ Desconectar socket al desmontar
  useEffect(() => {
    return () => {
      console.log("⛔ Desconectando socket...");
      disconnectSocket();
    };
  }, [disconnectSocket]);

  // ✅ Si terminó de cargar y no hay usuario, redirigir
  useEffect(() => {
    if (!isLoading && !user) {
      console.log("Usuario no autenticado.");
      navigate("/auth");
    }
  }, [isLoading, user, navigate]);

  // ✅ Loader mientras valida la sesión
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-lapsus-1100 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
