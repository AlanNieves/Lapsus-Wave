import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSignupStore } from "@/stores/useSignupStore";

const VerifyTokenPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { signupData, clearSignupData } = useSignupStore();

  const [token, setToken] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!signupData?.email && !signupData?.phone) {
      toast.error("Información incompleta. Intenta registrarte de nuevo.");
      navigate("/auth");
    }
  }, [signupData, navigate]);

  const handleCompleteSignup = async () => {
    if (!signupData) return;

    try {
      await axiosInstance.post("/auth/signup/complete", {
        phone: signupData.phone ? "+521" + signupData.phone : undefined,
        email: signupData.email,
        nickname: signupData.nickname,
        password: signupData.password,
        age: parseInt(signupData.age),
        verifyBy: signupData.tokenDelivery,
        token,
      });

      const waitForUserToExist = async (email: string, maxRetries = 5) => {
        let retries = 0;
        while (retries < maxRetries) {
          try {
            const res = await axiosInstance.post("/auth/validate-user", {
              email,
              mode: "check",
            });
            if (res.data.exists) return true;
          } catch {}
          await new Promise((r) => setTimeout(r, 500 + 300 * retries));
          retries++;
        }
        return false;
      };

      const exists = await waitForUserToExist(signupData.email || "");
      if (!exists) {
        toast.error("Tu cuenta aún no está disponible. Intenta más tarde.");
        return;
      }

      const authRes = await axiosInstance.get("/auth/check-auth");
      setUser(authRes.data.user);

      toast.success("Cuenta creada e iniciada sesión correctamente");
      clearSignupData();
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Token inválido o expirado");
    }
  };

  const handleResendToken = async () => {
    if (!signupData) return;

    try {
      await axiosInstance.post(
        "/token/send",
        signupData.tokenDelivery === "phone"
          ? { phone: "+521" + signupData.phone }
          : { email: signupData.email }
      );

      toast.success("Código reenviado");
      setCooldown(30);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al reenviar código");
    }
  };

  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldown]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-950 px-4 text-white">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCompleteSignup();
        }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 max-w-md w-full shadow-2xl text-white space-y-4"
      >
        <h2 className="text-3xl font-bold text-center mb-4">
          Verifica tu código
        </h2>

        <input
          type="text"
          placeholder={`Código recibido por ${
            signupData?.tokenDelivery === "phone" ? "SMS" : "correo"
          }`}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          className="p-2 w-full rounded bg-zinc-100 text-black"
        />

        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-500 transition rounded w-full py-2 font-semibold"
        >
          Verificar y crear cuenta
        </button>

        <button
          type="button"
          onClick={handleResendToken}
          disabled={cooldown > 0}
          className={`w-full text-sm mt-2 ${
            cooldown > 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-violet-300 hover:underline"
          }`}
        >
          {cooldown > 0
            ? `Reenviar en ${cooldown}s`
            : "¿No recibiste el código? Reenviar"}
        </button>
      </form>
    </div>
  );
};

export default VerifyTokenPage;
