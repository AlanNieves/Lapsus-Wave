import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosInstance } from "@/lib/axios";

const SignupPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
    phone: "",
    age: "",
    tokenDelivery: "phone", // "phone" o "email"
  });

  const [step, setStep] = useState<"form" | "verify">("form");
  const [token, setToken] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateUserData = async () => {
    try {
      const res = await axiosInstance.post("/auth/validate-user", {
        email: form.email,
        phone: "+521" + form.phone,
        nickname: form.nickname,
      });
      return res.data.success;
    } catch (err: any) {
      const errors = err.response?.data?.errors || {};
      Object.values(errors).forEach((msg) => toast.error(msg as string));
      return false;
    }
  };

  const handleInitiateSignup = async () => {
    const isValid = await validateUserData();
    if (!isValid) return;

    try {
      await axiosInstance.post("/token/send", {
        key: form.tokenDelivery === "phone" ? "+521" + form.phone : form.email,
        method: form.tokenDelivery,
      });

      toast.success(`Código enviado por ${form.tokenDelivery === "phone" ? "SMS" : "correo"}`);
      setStep("verify");
      setCooldown(30);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al enviar código");
    }
  };

  const handleCompleteSignup = async () => {
    try {
      await axiosInstance.post("/auth/signup/complete", {
        phone: "+521" + form.phone,
        email: form.email,
        nickname: form.nickname,
        password: form.password,
        age: parseInt(form.age),
        verifyBy: form.tokenDelivery,
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
          } catch (err) {
  console.error("Error al validar usuario:", err);
}
          await new Promise((r) => setTimeout(r, 500 + 300 * retries));
          retries++;
        }
        return false;
      };

      const exists = await waitForUserToExist(form.email);
      if (!exists) {
        toast.error("Tu cuenta aún no está disponible. Intenta más tarde.");
        return;
      }

      const authRes = await axiosInstance.get("/auth/check-auth");
      setUser(authRes.data.user);
      toast.success("Cuenta creada e iniciada sesión correctamente");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Token inválido o expirado");
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
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 flex items-center justify-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step === "form") {
            handleInitiateSignup();
          } else {
            handleCompleteSignup();
          }

        }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 max-w-md w-full shadow-2xl text-white space-y-4"
      >
        <h2 className="text-3xl font-bold text-center mb-4">
          {step === "form" ? (
            <>Crea tu cuenta en <span className="text-violet-400">Lapsus</span></>
          ) : (
            <>Verifica tu código</>
          )}
        </h2>

        {step === "form" ? (
          <>
            <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required className="p-2 w-full rounded bg-zinc-100 text-black" />
            <input type="text" name="phone" placeholder="Número telefónico (sin +52)" value={form.phone} onChange={handleChange} required className="p-2 w-full rounded bg-zinc-100 text-black" />
            <input type="text" name="nickname" placeholder="Nickname (único)" value={form.nickname} onChange={handleChange} required className="p-2 w-full rounded bg-zinc-100 text-black" />
            <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required className="p-2 w-full rounded bg-zinc-100 text-black" />
            <input type="number" name="age" placeholder="Edad" value={form.age} onChange={handleChange} required className="p-2 w-full rounded bg-zinc-100 text-black" />

            <div className="text-sm text-zinc-300">
              <label className="block mb-1">¿Cómo deseas recibir tu token?</label>
              <select name="tokenDelivery" value={form.tokenDelivery} onChange={handleChange} className="p-2 w-full rounded bg-zinc-900 text-white">
                <option value="phone">Por SMS</option>
                <option value="email">Por correo</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <input type="text" placeholder={`Código recibido por ${form.tokenDelivery === "phone" ? "SMS" : "correo"}`} value={token} onChange={(e) => setToken(e.target.value)} required className="p-2 w-full rounded bg-zinc-100 text-black" />
          </>
        )}

        <button
          type="submit"
          className={`${
            cooldown > 0 && step === "form"
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-500"
          } transition rounded w-full py-2 font-semibold`}
          disabled={cooldown > 0 && step === "form"}
        >
          {step === "form"
            ? cooldown > 0
              ? `Reintentar en ${cooldown}s`
              : "Enviar código"
            : "Verificar y crear cuenta"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;