import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface UserData {
  authProvider: "google" | "local";
  email?: string;
}

export default function CompleteProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [form, setForm] = useState({
    nickname: "",
    edad: "",
    phone: "",
    email: "",
    tokenDelivery: "email", // "email" o "phone"
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/auth/check-auth", { withCredentials: true });
        setUser(data.user);
        setForm((prev) => ({
          ...prev,
          email: data.user.email || "",
        }));
      } catch (err) {
        toast.error("Error al cargar el perfil");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        nickname: form.nickname,
        edad: form.edad,
        ...(user?.authProvider === "google" && { phone: form.phone }),
        ...(user?.authProvider === "local" && {
          email: form.email,
          tokenDelivery: form.tokenDelivery,
        }),
      };

      await axios.post("/api/auth/complete-profile", payload, {
        withCredentials: true,
      });

      toast.success("Perfil completado correctamente");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al completar perfil");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 max-w-md w-full shadow-lg text-white space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Completa tu perfil</h2>

        {user.authProvider === "local" && (
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            required
            className="p-2 rounded w-full text-black"
          />
        )}

        <input
          type="text"
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          placeholder="Nickname único"
          required
          className="p-2 rounded w-full text-black"
        />

        <input
          type="number"
          name="edad"
          value={form.edad}
          onChange={handleChange}
          placeholder="Edad"
          required
          className="p-2 rounded w-full text-black"
        />

        {user.authProvider === "google" && (
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Teléfono"
            required
            className="p-2 rounded w-full text-black"
          />
        )}

        {user.authProvider === "local" && (
          <div className="text-sm text-zinc-200">
            ¿Cómo deseas recibir tu token de autenticación?
            <select
              name="tokenDelivery"
              value={form.tokenDelivery}
              onChange={handleChange}
              className="mt-2 p-2 rounded w-full text-black"
            >
              <option value="email">Por correo</option>
              <option value="phone">Por teléfono</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-500 transition rounded py-2 font-semibold"
        >
          Guardar perfil
        </button>
      </form>
    </div>
  );
}
