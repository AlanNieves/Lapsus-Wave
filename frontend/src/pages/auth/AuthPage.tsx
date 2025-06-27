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
                opacity: 0.35,
                scale: 1.1,
                transition: { duration: 0.4, ease: "easeOut" },
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [glowControls]);

    useEffect(() => {
        const sequence = async () => {
            await backgroundControls.start({
                x: lightPosition.x - window.innerWidth / 2,
                y: lightPosition.y - window.innerHeight / 2,
                transition: { duration: 0.6, ease: "easeOut" },
            });
        };
        sequence();
    }, [lightPosition, backgroundControls]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
        >
            <div
                ref={containerRef}
                className="min-h-screen grid grid-cols-1 md:grid-cols-[1.2fr_1fr] bg-black text-white relative overflow-hidden"
            >
                {/* Fondo animado con luces moradas dinámicas optimizado */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
                    className="absolute inset-0 z-0 overflow-hidden"
                >
                    <motion.div
                        style={{ willChange: 'transform, opacity' }}
                        animate={backgroundControls}
                        className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] rounded-full blur-[60px] opacity-50 bg-gradient-radial from-purple-800 via-violet-600/30 to-transparent"
                    />
                    <motion.div
                        style={{ willChange: 'transform, opacity' }}
                        animate={backgroundControls}
                        className="absolute w-[180%] h-[180%] top-0 left-0 blur-[48px] opacity-40 bg-gradient-to-br from-violet-500/30 via-fuchsia-700/20 to-transparent"
                    />
                    <motion.div
                        style={{ willChange: 'transform, opacity' }}
                        animate={glowControls}
                        className="absolute w-[300px] h-[300px] rounded-full bg-violet-700/60 blur-[50px] z-10"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
                    className="relative hidden md:flex items-center justify-center p-8 overflow-hidden z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
                        className="relative w-full h-full rounded-lg overflow-hidden shadow-3d"
                    >
                        <motion.img
                            src="/images/IMG_0196.webp"
                            alt="Lapsus Visual"
                            loading="eager"

                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.8, ease: "easeOut", delay: 0.4 }}
                            className="w-full h-full object-cover brightness-[.3]"
                        />

                        {/* Estilo de póster final aprobado */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 2.1, ease: "easeOut", delay: 0.5 }}
                            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
                        >
                            
                            <h1 className="flex gap-[0.2em] text-[5vw] font-cormorant font-bold tracking-tight leading-none">
                                {"LAPSUS".split("").map((char, i) => (
                                    <span
                                        key={i}
                                        className="text-lapsus-lavender relative drop-shadow-[0_0_12px_rgba(166,77,121,0.85)]"
                                    >
                                        {char}
                                    </span>
                                ))}
                            </h1>



                            <h2 className="text-[3vw] md:text-[3.5vw] text-lapsus-lavender font-bold tracking-tight drop-shadow-xl font-cormorant">
                                WAVE
                            </h2>
                            <p className="mt-8 text-[1.3vw] text-zinc-300 max-w-md">
                                <span className="block text-lapsus-lavender font-semibold mb-1 font-cormorant">Embrace the glitch.</span>
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Lado derecho: Formulario */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.6, ease: "easeOut", delay: 0.5 }}
                    className="flex items-center justify-center p-8 relative z-20"
                >
                    <div className="w-full max-w-sm relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={formMode}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
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

                                <motion.div
                                    key={`form-${formMode}`}
                                    initial={{ opacity: 0, filter: "blur(6px)" }}
                                    animate={{ opacity: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, filter: "blur(6px)" }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="space-y-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl p-6"
                                >
                                    {formMode === "login" ? <LoginForm /> : <SignupForm />}
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AuthPage;
