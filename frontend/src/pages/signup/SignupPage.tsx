import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignupPage = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
        fullName: "",
        imageUrl: "",
        nickname: "",
    });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post("/api/auth/signup", form, { withCredentials: true });
            toast.success("Cuenta creada, revisa tu correo");
            navigate("/login");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Error al registrar");
            } else {
                toast.error("error inesperado");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-950">
            <form
                onSubmit={handleSubmit}
                className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-4 border border-white/20"
            >
                <h2 className="text-3xl text-white font-bold text-center">Crea tu cuenta</h2>

                <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                    required
                    className="p-2 rounded bg-zinc-100"
                />
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Correo electrónico"
                    required
                    className="p-2 rounded bg-zinc-100"
                />
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Contraseña"
                    required
                    className="p-2 rounded bg-zinc-100"
                />
                <input
                    type="text"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="URL de imagen de perfil"
                    required
                    className="p-2 rounded bg-zinc-100"
                />

                <input
                    type="text"
                    name="nickname"
                    value={form.nickname}
                    onChange={handleChange}
                    placeholder="Nickname (único)"
                    required
                    className="p-2 rounded bg-zinc-100"
                />

                <button type="submit" className="bg-violet-600 text-white font-semibold py-2 rounded hover:bg-violet-500">
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default SignupPage;
