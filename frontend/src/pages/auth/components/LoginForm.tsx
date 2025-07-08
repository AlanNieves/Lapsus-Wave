import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { login } from "@/services/auth.service";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { loginWithGoogle, setUser, user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(identifier.trim(), password.trim());
      const data = res.data;

      if (!data.success) {
        toast.error(data.message || "Credenciales inválidas");
        return;
      }

      setUser(data.user);

      toast.success("Sesión iniciada correctamente");

      if (!data.user.isProfileComplete) {
        navigate("/complete-profile");
      } else {
        navigate("/");
      }

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Credenciales inválidas");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="identifier"
          placeholder="Correo, nickname o teléfono"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
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

              const user = await loginWithGoogle(credential);
              setUser(user);

              toast.success("Sesión iniciada con Google");

              if (!user.isProfileComplete) {
                navigate("/complete-profile");
              } else {
                navigate("/");
              }
            } catch (error) {
              toast.error("Error al iniciar sesión con Google");
            }
          }}
          onError={() => toast.error("Falló la autenticación con Google")}
          useOneTap={false}
          theme="filled_black"
          text="continue_with"
          shape="pill"
        />
      </div>
    </>
  );
};

export default LoginForm;
