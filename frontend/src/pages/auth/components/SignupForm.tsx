// src/pages/auth/components/SignupForm.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

// Componente para las ondas de sonido
const SoundWaveIndicator = ({ strength }: { strength: number }) => {
  const waveCount = 7; // Más ondas para un efecto más visual
  const heights = [40, 60, 80, 100, 80, 60, 40]; // Alturas variadas
  
  // Animación pulsante para contraseñas fuertes
  const isStrong = strength > 70;
  
  return (
    <div className="flex items-end h-16 space-x-1.5 mt-2">
      {[...Array(waveCount)].map((_, i) => (
        <div
          key={i}
          className={`w-3.5 rounded-t-lg transition-all duration-300 ${
            isStrong ? "bg-green-500 animate-pulse" : "bg-violet-500"
          }`}
          style={{
            height: `${heights[i] * (strength / 100)}px`,
            opacity: 0.4 + (0.6 * strength) / 100,
            animationDelay: isStrong ? `${i * 0.1}s` : "0s",
          }}
        />
      ))}
    </div>
  );
};

// Componente para los requisitos de contraseña con íconos
const PasswordRequirements = ({ password }: { password: string }) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const hasMinLength = password.length >= 8;
  
  return (
    <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-zinc-400">
      <div className={`flex items-center ${hasUpperCase ? 'text-green-400' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Mayúscula
      </div>
      <div className={`flex items-center ${hasNumber ? 'text-green-400' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 8a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
        </svg>
        Número
      </div>
      <div className={`flex items-center ${hasSymbol ? 'text-green-400' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm3-1a1 1 0 11-2 0 1 1 0 012 0zm4 1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        Símbolo
      </div>
      <div className={`flex items-center ${hasMinLength ? 'text-green-400' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        8+ caracteres
      </div>
    </div>
  );
};

// Componente de teclado visual para teléfono
const PhoneKeyboard = ({ phone }: { phone: string }) => {
  return (
    <div className="grid grid-cols-5 gap-2 mt-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div 
          key={i}
          className={`flex items-center justify-center h-10 rounded-lg ${
            phone.includes(i.toString()) 
              ? "bg-violet-600 text-white" 
              : "bg-zinc-800/50"
          } transition-all`}
        >
          {i}
        </div>
      ))}
    </div>
  );
};

const SignupForm = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
        nickname: "",
        phone: "",
        age: "",
        tokenDelivery: "phone",
    });

    const [isOpen, setIsOpen] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [phoneError, setPhoneError] = useState("");
    const [ageError, setAgeError] = useState("");
    const navigate = useNavigate();

    // Función para calcular la fortaleza de la contraseña
    const calculatePasswordStrength = useCallback((password: string) => {
        if (!password) return 0;
        
        let strength = 0;
        // Puntos por longitud (máx 40 puntos)
        strength += Math.min(40, (password.length / 12) * 40);
        
        // Puntos por diversidad de caracteres
        if (/[A-Z]/.test(password)) strength += 15;
        if (/\d/.test(password)) strength += 15;
        if (/[!@#$%^&*]/.test(password)) strength += 20;
        if (password.length >= 12) strength += 10;
        
        return Math.min(100, Math.max(0, strength));
    }, []);

    // Actualizar fuerza de contraseña al cambiar
    useEffect(() => {
        setPasswordStrength(calculatePasswordStrength(form.password));
    }, [form.password, calculatePasswordStrength]);

    // Cooldown para reenviar código
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    // Manejar cambios en los campos
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Validación especial para teléfono
        if (name === "phone") {
            const digitsOnly = value.replace(/\D/g, '');
            const truncated = digitsOnly.slice(0, 10);
            
            setForm({ ...form, [name]: truncated });
            
            // Validar longitud del teléfono
            if (truncated.length !== 10 && truncated.length > 0) {
                setPhoneError("El teléfono debe tener 10 dígitos");
            } else {
                setPhoneError("");
            }
        } 
        // Validación especial para edad
        else if (name === "age") {
            const ageValue = value.replace(/\D/g, ''); // Solo números
            let ageNum = parseInt(ageValue, 10);
            
            // Limitar a máximo 3 dígitos
            let truncated = ageValue;
            if (ageValue.length > 3) {
                truncated = ageValue.slice(0, 3);
                ageNum = parseInt(truncated, 10);
            }
            
            // Validar rango de edad
            if (truncated && (ageNum < 12 || ageNum > 100)) {
                setAgeError("La edad debe ser entre 12 y 100 años");
            } else {
                setAgeError("");
            }
            
            setForm({ ...form, [name]: truncated });
        } else {
            setForm({ ...form, [name]: value });
        }
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

        // Validar teléfono antes de continuar
        if (form.phone.length !== 10) {
            setPhoneError("El teléfono debe tener 10 dígitos");
            toast.error("Por favor ingresa un teléfono válido de 10 dígitos");
            return;
        }

        // Validar edad antes de continuar
        const ageNum = parseInt(form.age, 10);
        if (isNaN(ageNum)) {
            setAgeError("Edad inválida");
            toast.error("Por favor ingresa una edad válida");
            return;
        }
        
        if (ageNum < 12 || ageNum > 100) {
            setAgeError("La edad debe ser entre 12 y 100 años");
            toast.error("La edad debe estar entre 12 y 100 años");
            return;
        }

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
            
            <div>
                <input
                    type="tel"
                    name="phone"
                    placeholder="Número telefónico (10 dígitos)"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-zinc-900/70 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
                />
                {phoneError && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {phoneError}
                    </div>
                )}
                <div className="flex justify-between items-center mt-1">
                    <div className="text-xs text-zinc-500">
                        {form.phone.length}/10 dígitos
                    </div>
                    <div className="text-xs text-violet-400">
                        {form.phone.length === 10 ? "✅ Válido" : ""}
                    </div>
                </div>
            </div>
            
            <input
                type="text"
                name="nickname"
                placeholder="Nickname (único)"
                value={form.nickname}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-zinc-900/70 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
            />
            
            <div>
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-zinc-900/70 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
                />
                
                <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs">Fortaleza de contraseña:</span>
                        <span className={`text-xs font-medium ${
                            passwordStrength < 40 ? 'text-red-500' : 
                            passwordStrength < 70 ? 'text-yellow-500' : 
                            'text-green-500'
                        }`}>
                            {passwordStrength < 40 ? 'Débil' : 
                             passwordStrength < 70 ? 'Moderada' : 
                             'Fuerte'}
                            {passwordStrength >= 70 && " 🔥"}
                        </span>
                    </div>
                    
                    {/* Barra de progreso */}
                    <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
                        <div 
                            className={`h-2 rounded-full ${
                                passwordStrength < 40 ? 'bg-red-500' : 
                                passwordStrength < 70 ? 'bg-yellow-500' : 
                                'bg-green-500'
                            }`}
                            style={{ width: `${passwordStrength}%` }}
                        ></div>
                    </div>
                    
                    <SoundWaveIndicator strength={passwordStrength} />
                    <PasswordRequirements password={form.password} />
                </div>
            </div>
            
            <div>
                <input
                    type="number"
                    name="age"
                    placeholder="Edad (12-100)"
                    value={form.age}
                    onChange={handleChange}
                    required
                    min="12"
                    max="100"
                    className="w-full p-3 rounded-lg bg-zinc-900/70 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
                />
                {ageError && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {ageError}
                    </div>
                )}
                <div className="flex justify-between items-center mt-1">
                    <div className="text-xs text-zinc-500">
                        {form.age ? `${form.age} años` : "Ingresa tu edad"}
                    </div>
                    <div className="text-xs text-violet-400">
                        {form.age && parseInt(form.age) >= 12 && parseInt(form.age) <= 100 ? "✅ Válido" : ""}
                    </div>
                </div>
            </div>

            <div className="text-sm text-zinc-300 relative group">
                <label className="block mb-1">¿Cómo deseas recibir tu token?</label>
                <div className="relative">
                    <select
                        name="tokenDelivery"
                        value={form.tokenDelivery}
                        onChange={handleChange}
                        onClick={() => setIsOpen((prev) => !prev)}
                        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
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
                    } transition rounded-full w-full py-3 font-semibold flex items-center justify-center`}
                disabled={cooldown > 0}
            >
                {cooldown > 0 ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-spin" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Reintentar en {cooldown}s
                    </>
                ) : (
                    "Enviar código"
                )}
            </button>
        </form>
    );
};

export default SignupForm;