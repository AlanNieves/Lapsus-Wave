// src/pages/auth/components/SignupForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

const SignupForm = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
        nickname: "",
        phone: "",
        age: "",
        tokenDelivery: "phone",
    });

    const [isOpen, setIsOpen] = useState(false)

    const [cooldown, setCooldown] = useState(0);
    const navigate = useNavigate();

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

    const handleSendToken = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cooldown > 0) return;

        const isValid = await validateUserData();
        if (!isValid) return;

        try {
            await axiosInstance.post("/token/send", {
                key: form.tokenDelivery === "phone" ? "+521" + form.phone : form.email,
                method: form.tokenDelivery,
            });

            toast.success(`Código enviado por ${form.tokenDelivery === "phone" ? "SMS" : "correo"}`);
            navigate("/signup/verify", { state: form });
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error al enviar código");
        } finally {
            setCooldown(30);
        }
    };

    return (
        <form onSubmit={handleSendToken} className="space-y-4">
            <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-zinc-900/70 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
            />
            <input
                type="text"
                name="phone"
                placeholder="Número telefónico (sin +52)"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-zinc-900/70 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
            />
            <input
                type="text"
                name="nickname"
                placeholder="Nickname (único)"
                value={form.nickname}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-zinc-900/70 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
            />
            <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-zinc-900/70 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
            />
            <input
                type="number"
                name="age"
                placeholder="Edad"
                value={form.age}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-zinc-900/70 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
            />

            <div className="text-sm text-zinc-300 relative group">
                <label className="block mb-1">¿Cómo deseas recibir tu token?</label>
                <div className="relative">
                    <select
                        name="tokenDelivery"
                        value={form.tokenDelivery}
                        onChange={handleChange}
                        onClick={() => setIsOpen((prev) => !prev)}
                        onBlur={() => setTimeout(() => setIsOpen(false), 150)} // delay para permitir selección
                        className="appearance-none w-full p-3 rounded-lg bg-zinc-900/70 border border-zinc-700 text-white pr-10 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                        <option value="phone">Por SMS</option>
                        <option value="email">Por correo</option>
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                            className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-violet-500 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" : ""
                                }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>
            </div>




            <button
                type="submit"
                className={`${cooldown > 0 ? "bg-gray-500 cursor-not-allowed" : "bg-white text-black hover:bg-zinc-200"
                    } transition rounded-full w-full py-2 font-semibold`}
                disabled={cooldown > 0}
            >
                {cooldown > 0 ? `Reintentar en ${cooldown}s` : "Enviar código"}
            </button>
        </form>
    );
};

export default SignupForm;
