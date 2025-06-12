import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { loginWithGoogle } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold text-white">Inicia sesión</h1>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const credential = credentialResponse.credential;
              if (!credential) throw new Error("Token inválido");

              await loginWithGoogle(credential);
              toast.success("Sesión iniciada");
              navigate("/");
            } catch (error) {
              toast.error("Error al iniciar sesión con Google");
            }
          }}
          onError={() => toast.error("Falló la autenticación con Google")}
          useOneTap={false}
          theme="outline"
          text="signin_with"
          shape="pill"
        />
      </div>
    </div>
  );
};

export default LoginPage;
