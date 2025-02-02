import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useState } from "react";

const ExpandedPlayerView = () => {
  const {
    currentSong,
    isExpandedViewOpen,
    toggleExpandedView,
  } = usePlayerStore();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar la fecha y la hora cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!currentSong) return null;

  // Formatear la fecha y la hora
  const formattedDate = currentTime.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = currentTime.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <AnimatePresence>
      {isExpandedViewOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-lapsus-900"
          onClick={toggleExpandedView} // Cerrar al hacer clic fuera
        >
          {/* Fecha y hora (arriba a la izquierda) */}
          <div className="absolute top-4 left-4 text-lapsus-500 text-sm">
            <p>{formattedDate}</p>
            <p>{formattedTime}</p>
          </div>

          {/* LAPSUS INNOVATIONS (arriba a la derecha) */}
          <div className="absolute top-4 right-4 text-lapsus-500 text-sm font-semibold">
            LAPSUS INNOVATIONS
          </div>

          {/* Efecto de luz pulsante alrededor de la carátula */}
          <motion.div
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, rgba(164, 77, 121, 0.3) 0%, rgba(164, 77, 121, 0) 70%)`,
            }}
          />

          {/* Contenido centrado */}
          <div className="flex flex-col items-center gap-4 z-10">
            {/* Carátula del álbum */}
            <motion.img
              src={currentSong.imageUrl}
              alt={currentSong.title}
              className="w-48 h-48 object-cover rounded-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />

            {/* Nombre de la canción y artista */}
            <div className="text-center">
              <h2 className="text-2xl font-bold">{currentSong.title}</h2>
              <p className="text-lapsus-500">{currentSong.artist}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExpandedPlayerView;