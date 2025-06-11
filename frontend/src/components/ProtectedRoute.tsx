import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
};
