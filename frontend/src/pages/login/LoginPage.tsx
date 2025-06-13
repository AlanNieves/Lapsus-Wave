import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { loginWithGoogle } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-950">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-2">Bienvenido a <span className="text-violet-400">Lapsus</span></h1>
        <p className="text-zinc-300 mb-6">Inicia sesión para continuar</p>

        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const credential = credentialResponse.credential;
              if (!credential) throw new Error("Token inválido");

              const res = await loginWithGoogle(credential);
              toast.success("Sesion iniciada");

              if(!res.user.isProfileComplete) {
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

        <div className="text-zinc-400 my-6">— o —</div>

        <button
          className="w-full bg-white text-black py-2 rounded-full hover:bg-zinc-200 transition font-semibold"
          onClick={() => navigate("/signup")}
        >
          Crear cuenta con Lapsus
        </button>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default LoginPage;
=======
export default LoginPage;
>>>>>>> d6279b3ef99e7144468ee8d6cf463f0d40a445dd
