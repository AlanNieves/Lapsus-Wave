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
          to="/login"
          className="text-white border border-white px-4 py-1 rounded hover:bg-pink-700 transition"
        >
          Iniciar sesión
        </Link>
      )}
    </div>
  );
};

export default Topbar;
