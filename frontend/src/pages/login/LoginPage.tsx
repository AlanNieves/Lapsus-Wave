import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

const LoginPage = () => {
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const credential = credentialResponse?.credential;
    if (!credential) return toast.error("Token de Google inválido");

    setLoading(true);
    try {
      await loginWithGoogle(credential);
      toast.success("Sesión iniciada");
      navigate("/");
    } catch (err) {
      toast.error("Error al iniciar sesión con Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/40">
      <div className="bg-white/10 border border-white/20 backdrop-blur-2xl shadow-xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-white mb-6">Iniciar sesión</h1>

        <div className="mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Error al iniciar con Google")}
          />
        </div>

        <p className="text-white text-sm mb-2">¿No tienes cuenta?</p>
        <button
          onClick={() => navigate("/register")}
          className="mt-2 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition duration-200 backdrop-blur-sm"
        >
          Registrarse en Lapsus Wave
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
