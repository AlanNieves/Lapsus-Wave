import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  checkAuth,
  completeProfile,
} from "@/services/auth.service";

interface UserData {
  authProvider: "google" | "lapsus-wave";
  email?: string;
}

export default function CompleteProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);

  const [form, setForm] = useState<{
    nickname: string;
    age: string;
    phone: string;
    tokenDelivery: "phone" | "email";
  }>({
    nickname: "",
    age: "",
    phone: "",
    tokenDelivery: "email",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await checkAuth();
        setUser(data.user);
      } catch (err) {
        toast.error("Error al cargar el perfil");
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: {
        nickname: string;
        age: number;
        phone?: string;
        tokenDelivery?: "phone" | "email";
      } = {
        nickname: form.nickname.trim(),
        age: Number(form.age),
      };

      if (user?.authProvider === "google") {
        payload.phone = form.phone.trim();
      }

      if (user?.authProvider === "lapsus-wave") {
        payload.tokenDelivery = form.tokenDelivery;
      }

      await completeProfile(payload);

      toast.success("Perfil completado correctamente");
      navigate("/home");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al completar perfil");
    }
  };

  if (!user) return null;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-black animate-pulse-slow"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white space-y-5"
      >
        <h2 className="text-3xl font-bold text-center tracking-wide mb-4">
          Completa tu perfil
        </h2>

        <input
          type="text"
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          placeholder="Nickname único"
          required
          className="w-full p-3 rounded-lg bg-zinc-900/80 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
        />

        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Edad"
          required
          className="w-full p-3 rounded-lg bg-zinc-900/80 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
        />

        {user.authProvider === "google" && (
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Teléfono"
            required
            className="w-full p-3 rounded-lg bg-zinc-900/80 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
          />
        )}

        {user.authProvider === "lapsus-wave" && (
          <div className="text-sm text-zinc-300">
            ¿Cómo deseas recibir tu token de autenticación?
            <select
              name="tokenDelivery"
              value={form.tokenDelivery}
              onChange={handleChange}
              className="mt-2 w-full p-3 rounded-lg bg-zinc-900/80 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
            >
              <option value="email">Por correo</option>
              <option value="phone">Por teléfono</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-gradient-to-r from-violet-600 to-violet-400 text-black font-semibold hover:opacity-90 transition"
        >
          Guardar perfil
        </button>
      </form>
    </div>
  );
}
