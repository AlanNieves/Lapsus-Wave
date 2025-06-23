import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
const Topbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex justify-end p-4">
      {user ? (
        <button
          onClick={logout}
          className="text-white border border-white px-4 py-1 rounded hover:bg-pink-700 transition"
        >
          Cerrar sesión
        </button>
      ) : (
        <Link
          to="/auth"
          className="relative overflow-hidden  px-4 py-1 rounded group transition-colors  animate-pulse"
        >
          <span className="relative z-10">Iniciar sesión</span>
          <span
            className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/20 to-white/5 
    opacity-0 group-hover:opacity-100 group-hover:animate-smoke 
    rounded transition-opacity duration-700 ease-in-out"
          />
        </Link>

      )}
    </div>
  );
};

export default Topbar;
