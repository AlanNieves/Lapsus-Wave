import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/useAuthStore";

const SignupPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    nickname: "",
    phone: "",
  });

  const [step, setStep] = useState<"form" | "verify">("form");
  const [token, setToken] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInitiateSignup = async () => {
    try {
      await axios.post("/api/token/send", {
        key: "+521" + form.phone,
        method: "phone",
      });
      toast.success("Código enviado por SMS");
      setStep("verify");
      setCooldown(30);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al enviar código");
    }
  };

  const handleCompleteSignup = async () => {
    try {
      await axios.post("/api/auth/signup/complete", {
        phone: "+521" + form.phone,
        email: form.email,
        nickname: form.nickname,
        password: form.password,
        age: 22,
        verifyBy: "phone",
        token,
      });

      // ✅ Login automático usando email y password
      await login(form.email, form.password);

      toast.success("Usuario registrado e iniciado sesión");
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
          step === "form" ? handleInitiateSignup() : handleCompleteSignup();
        }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 max-w-md w-full shadow-2xl text-white space-y-4"
      >
        <h2 className="text-3xl font-bold text-center mb-4">
          {step === "form" ? (
            <>
              Crea tu cuenta en <span className="text-violet-400">Lapsus</span>
            </>
          ) : (
            <>Verifica tu código</>
          )}
        </h2>

        {step === "form" ? (
          <>
            <input
              type="text"
              name="fullName"
              placeholder="Nombre completo"
              value={form.fullName}
              onChange={handleChange}
              required
              className="p-2 w-full rounded bg-zinc-100 text-black"
            />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
              className="p-2 w-full rounded bg-zinc-100 text-black"
            />
            <input
              type="text"
              name="phone"
              placeholder="Número telefónico (sin +52)"
              value={form.phone}
              onChange={handleChange}
              required
              className="p-2 w-full rounded bg-zinc-100 text-black"
            />
            <input
              type="text"
              name="nickname"
              placeholder="Nickname (único)"
              value={form.nickname}
              onChange={handleChange}
              required
              className="p-2 w-full rounded bg-zinc-100 text-black"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              className="p-2 w-full rounded bg-zinc-100 text-black"
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Código de verificación (SMS)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="p-2 w-full rounded bg-zinc-100 text-black"
            />
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
              ? "Reintentar en ${cooldown}s"
              : "Enviar código"
            : "Verificar y crear cuenta"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;