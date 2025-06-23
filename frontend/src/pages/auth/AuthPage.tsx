// src/pages/auth/AuthPage.tsx
import { useEffect, useRef, useState } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";

const AuthPage = () => {
    const [formMode, setFormMode] = useState<"login" | "signup">("login");
    const [lightPosition, setLightPosition] = useState({ x: 0, y: 0 });

    const backgroundControls = useAnimationControls();
    const glowControls = useAnimationControls();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX;
            const y = e.clientY;
            setLightPosition({ x, y });

            glowControls.start({
                x: x - window.innerWidth / 2,
                y: y - window.innerHeight / 2,
                opacity: 0.5,
                scale: 1.2,
                transition: { duration: 0.15, ease: "easeOut" },
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [glowControls]);

    useEffect(() => {
        backgroundControls.start({
            x: lightPosition.x - window.innerWidth / 2,
            y: lightPosition.y - window.innerHeight / 2,
            transition: { duration: 0.25, ease: "easeOut" },
        });
    }, [lightPosition, backgroundControls]);

    return (
        <div
            ref={containerRef}
            className="min-h-screen grid grid-cols-1 md:grid-cols-[1.2fr_1fr] bg-black text-white relative overflow-hidden"
        >
            {/* Fondo animado con luces moradas dinámicas */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    animate={backgroundControls}
                    className="absolute w-[300%] h-[300%] -top-[100%] -left-[100%] rounded-full blur-[180px] opacity-60 bg-gradient-radial from-purple-800 via-violet-600/40 to-transparent"
                />
                <motion.div
                    animate={backgroundControls}
                    className="absolute w-[200%] h-[200%] top-0 left-0 blur-[160px] opacity-50 bg-gradient-to-br from-violet-500/40 via-fuchsia-700/30 to-transparent"
                />
                <motion.div
                    animate={glowControls}
                    className="absolute w-[500px] h-[500px] rounded-full bg-violet-700/70 blur-[160px] z-10"
                />
            </div>

            <div className="relative hidden md:flex items-center justify-center p-8 overflow-hidden z-10">
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-3d">
                    <img
                        src="/images/IMG_0196.webp"
                        alt="Lapsus Visual"
                        className="w-full h-full object-cover"
                    />

                    {/* Texto vertical LAPSUS ajustado */}
                    <div className="  rotate-[-90deg]  text-pink-300 font-extrabold tracking-[0.2em] select-none pointer-events-none">
                        <h1 className="text-[9.9vw] leading-[0.9] drop-shadow-2xl">LAPSUS</h1>
                    </div>

                    {/* WAVE arriba derecha */}
                    <div className="absolute top-6 right-8 text-pink-300 font-extrabold tracking-wide text-[4vw] leading-none drop-shadow-2xl select-none pointer-events-none">
                        WAVE
                    </div>

                    {/* Refrán centrado a la derecha */}
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 w-[40%] text-white font-medium tracking-wide text-[1.15vw] text-right leading-snug drop-shadow-xl">
                        <p>
                            <span className="block mb-2">Redefinimos el error como arte.</span>
                            <span className="block">Somos el eco digital de lo que una vez fue arte.</span>
                        </p>
                    </div>
                </div>
            </div>





            {/* Lado derecho: Formulario */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="flex items-center justify-center p-8 relative z-20"
            >
                <div className="w-full max-w-sm space-y-6 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={formMode === "login" ? "title-login" : "title-signup"}
                            initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                            className="text-center"
                        >
                            <h1 className="text-3xl font-bold">
                                {formMode === "login"
                                    ? "Bienvenido a Lapsus Wave"
                                    : "Crea tu cuenta en Lapsus"}
                            </h1>
                            <p className="text-zinc-400 text-sm mt-2">
                                {formMode === "login" ? (
                                    <>
                                        ¿No tienes cuenta?{' '}
                                        <button
                                            onClick={() => setFormMode("signup")}
                                            className="text-purple-400 hover:underline"
                                        >
                                            Regístrate
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        ¿Ya tienes cuenta?{' '}
                                        <button
                                            onClick={() => setFormMode("login")}
                                            className="text-purple-400 hover:underline"
                                        >
                                            Inicia sesión
                                        </button>
                                    </>
                                )}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {formMode === "login" ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, filter: "blur(4px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, filter: "blur(4px)" }}
                                transition={{ duration: 0.45, ease: "easeOut" }}
                                className="space-y-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl p-6"
                            >
                                <LoginForm />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signup"
                                initial={{ opacity: 0, filter: "blur(4px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, filter: "blur(4px)" }}
                                transition={{ duration: 0.45, ease: "easeOut" }}
                                className="space-y-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl p-6"
                            >
                                <SignupForm />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
