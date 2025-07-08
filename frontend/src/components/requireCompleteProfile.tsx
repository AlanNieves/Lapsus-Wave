// RequireCompleteProfile.tsx
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireCompleteProfile() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-lapsus-1100 animate-spin" />
      </div>
    );
  }


  if (!user) return <Navigate to="/auth" replace />;
  if (!user.isProfileComplete) return <Navigate to="/complete-profile" replace />;

  return <Outlet />;
}
