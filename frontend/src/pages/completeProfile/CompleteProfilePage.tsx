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

// Ladas comunes para México con sus ubicaciones
const LADAS_MEXICO = [
  { lada: "55", location: "CDMX y Edo. México" },
  { lada: "56", location: "CDMX y Edo. México" },
  { lada: "33", location: "Guadalajara, Jalisco" },
  { lada: "81", location: "Monterrey, Nuevo León" },
  { lada: "22", location: "Puebla, Puebla" },
  { lada: "44", location: "Morelia, Michoacán" },
  { lada: "66", location: "Tijuana, Baja California" },
  { lada: "77", location: "Mérida, Yucatán" },
  { lada: "88", location: "Tampico, Tamaulipas" },
  { lada: "99", location: "Veracruz, Veracruz" },
  { lada: "744", location: "Acapulco, Guerrero" },
  { lada: "833", location: "Reynosa, Tamaulipas" },
  { lada: "834", location: "Matamoros, Tamaulipas" },
  { lada: "844", location: "Monclova, Coahuila" },
  { lada: "612", location: "La Paz, Baja California Sur" },
  { lada: "614", location: "Chihuahua, Chihuahua" },
  { lada: "618", location: "Durango, Durango" },
  { lada: "312", location: "Colima, Colima" },
  { lada: "315", location: "Ciudad Obregón, Sonora" },
];

export default function CompleteProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [form, setForm] = useState<{
    nickname: string;
    age: string;
    phone: string;
    tokenDelivery: "phone" | "email";
    lada: string;
  }>({
    nickname: "",
    age: "",
    phone: "",
    tokenDelivery: "email",
    lada: "55" // Lada por defecto (CDMX)
  });

  const [phoneError, setPhoneError] = useState("");
  const [ageError, setAgeError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await checkAuth();
        setUser(data.user);
      } catch (err) {
        toast.error("Error al cargar el perfil"+err);
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, '');
      // Longitud máxima depende de la lada seleccionada
      const maxLength = form.lada.length === 2 ? 8 : 7;
      const truncated = digitsOnly.slice(0, maxLength);
      
      setForm({ ...form, [name]: truncated });
      
      if (truncated.length !== maxLength && truncated.length > 0) {
        setPhoneError(`Debe tener ${maxLength} dígitos`);
      } else {
        setPhoneError("");
      }
    } 
    else if (name === "age") {
      const ageValue = value.replace(/\D/g, '');
      let ageNum = parseInt(ageValue, 10);
      
      let truncated = ageValue;
      if (ageValue.length > 3) {
        truncated = ageValue.slice(0, 3);
        ageNum = parseInt(truncated, 10);
      }
      
      if (truncated && (ageNum < 12 || ageNum > 100)) {
        setAgeError("La edad debe ser entre 12 y 100 años");
      } else {
        setAgeError("");
      }
      
      setForm({ ...form, [name]: truncated });
    }
    else if (name === "lada") {
      setForm({ 
        ...form, 
        [name]: value,
        phone: "" // Resetear el teléfono al cambiar lada
      });
    }
    else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar edad
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

    // Validar teléfono si es necesario
    if (user?.authProvider === "google") {
      const expectedLength = form.lada.length === 2 ? 8 : 7;
      if (form.phone.length !== expectedLength) {
        setPhoneError(`El teléfono debe tener ${expectedLength} dígitos`);
        toast.error(`Por favor ingresa un teléfono válido de ${expectedLength} dígitos`);
        return;
      }
    }

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
        // Combinamos lada + número
        payload.phone = `+52${form.lada}${form.phone}`;
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
  <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-950 overflow-hidden">
    {/* Fondo animado suave */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[120%] h-[120%] -top-1/4 -left-1/4 rounded-full bg-violet-600/20 blur-[100px] animate-[pulse_12s_ease-in-out_infinite]" />
        <div className="absolute w-[150%] h-[150%] bottom-[-30%] right-[-30%] bg-fuchsia-800/10 blur-[80px] rounded-full animate-[pulse_18s_ease-in-out_infinite]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md p-10 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/10 text-white space-y-6 translate-y-[-40px]"
      >
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-wide">Completa tu perfil</h2>
        </div>

        <div>
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            placeholder="Nickname único"
            required
            className="w-full p-3 rounded-lg bg-zinc-900/80 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
          />
        </div>

        <div>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Edad (12-100)"
            required
            min="12"
            max="100"
            className="w-full p-3 rounded-lg bg-zinc-900/80 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
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

        {user.authProvider === "google" && (
          <div>
            <div className="flex items-start gap-2">
              {/* Selector simple de lada */}
              <div className="w-1/3">
                <label className="block mb-1 text-sm">Lada</label>
                <select
                  name="lada"
                  value={form.lada}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-zinc-900/80 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
                >
                  {LADAS_MEXICO.map(({ lada }) => (
                    <option key={lada} value={lada}>{lada}</option>
                  ))}
                </select>
              </div>
              
              {/* Campo de teléfono */}
              <div className="flex-1">
                <label className="block mb-1 text-sm">Número</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={form.lada.length === 2 ? "XXXXXXX (8 dígitos)" : "XXXXXX (7 dígitos)"}
                  required
                  className="w-full p-3 rounded-lg bg-zinc-900/80 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-400"
                />
              </div>
            </div>
            
            {/* Mostrar ubicación de la lada */}
            <div className="text-xs text-violet-300 mt-1">
              {LADAS_MEXICO.find(l => l.lada === form.lada)?.location}
            </div>
            
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
                {form.phone.length}/{form.lada.length === 2 ? "8" : "7"} dígitos
              </div>
              <div className="flex items-center">
                <div className="text-xs text-violet-400">
                  {form.phone.length === (form.lada.length === 2 ? 8 : 7) ? "✅ Válido" : ""}
                </div>
              </div>
            </div>
            
            <div className="mt-3 text-xs text-zinc-400 bg-zinc-800/50 p-3 rounded-lg">
              <div className="font-medium">Formato completo:</div>
              <div className="mt-1 text-violet-300">
                +52 {form.lada} {form.phone || (form.lada.length === 2 ? 'XXXXXXXX' : 'XXXXXXX')}
              </div>
            </div>
          </div>
        )}

        {user.authProvider === "lapsus-wave" && (
          <div className="text-sm text-zinc-300">
            <label className="block mb-1">¿Cómo deseas recibir tu token de autenticación?</label>
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
          className="w-full py-3 rounded-full bg-gradient-to-r from-violet-600 to-violet-400 text-black font-semibold hover:opacity-90 transition flex items-center justify-center"
        >
          Guardar perfil
        </button>
      </form>
    </div>
  );
}