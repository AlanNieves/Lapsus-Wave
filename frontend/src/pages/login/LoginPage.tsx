import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const { loginWithGoogle } = useAuthStore();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const handleLapsusLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/auth/login",
        { nickname, password },
        { withCredentials: true }
      );
      toast.success("Sesión iniciada con Lapsus");
      navigate("/");
    } catch (error) {
      toast.error("Credenciales incorrectas o error de conexión"+error);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 animate-pulse-slow relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-black"></div>

      <div className="relative z-10 w-full max-w-md p-8 text-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Bienvenido a Lapsus Wave </h1>
          <p className="text-zinc-400 text-sm mt-2">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => navigate("/signup")}
              className="text-purple-400 hover:underline"
            >
              Regístrate
            </button>
          </p>
        </div>

        <form onSubmit={handleLapsusLogin} className="space-y-4">
          <input
            type="text"
            name="nickname"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-zinc-900/70 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-zinc-900/70 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
          />
          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded-full hover:bg-zinc-200 transition font-semibold"
          >
            Iniciar sesión con Lapsus
          </button>
        </form>

        <div className="my-6 flex items-center justify-between">
          <div className="border-b border-zinc-700 w-full" />
          <span className="mx-2 text-zinc-400 text-sm">ó</span>
          <div className="border-b border-zinc-700 w-full" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const credential = credentialResponse.credential;
                if (!credential) throw new Error("Token inválido");

                const res = await loginWithGoogle(credential);
                toast.success("Sesión iniciada con Google");

                if (!res.user.isProfileComplete) {
                  navigate("/complete-profile");
                } else {
                  navigate("/");
                }
              } catch (error) {
                toast.error("Error al iniciar sesión con Google"+error);
              }
            }}
            onError={() => toast.error("Falló la autenticación con Google")}
            useOneTap={false}
            theme="filled_black"
            text="continue_with"
            shape="pill"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;