import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useState } from "react";
import Wave3D from "@/components/Wave3D"; // Tu animación 3D
import AudioVisualizerPlane from "@/components/AudioVisualizerPlane";
import AudioVisualizer3D from "@/components/ThreeAudioVisualizer";
import AudioRainVisualizer from "@/components/RainVisualizer";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const ExpandedPlayerView = () => {
  const {
    currentSong,
    isExpandedViewOpen,
    toggleExpandedView,
    audioRef,
  } = usePlayerStore();

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Sincronizar tiempo y duración
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const updateDuration = () => {
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("durationchange", updateDuration);

    if (!isNaN(audio.duration)) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("durationchange", updateDuration);
    };
  }, [audioRef]);

  // Actualizar reloj
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!currentSong) return null;

  const formattedDate = currentDateTime.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = currentDateTime.toLocaleTimeString("es-ES", {
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
          onClick={toggleExpandedView}
        >
          {/* Fecha y hora */}
          <div className="absolute top-4 left-4 text-lapsus-400 text-sm font-mono tracking-wider backdrop-blur-md px-2 py-1 rounded-md shadow-md border border-lapsus-800/30">
            <p>{formattedDate}</p>
            <p>{formattedTime}</p>
          </div>

          {/* Efecto visual */}
          <div className="absolute inset-0 z-0 pointer-events-none">
              {/*<Wave3D audioRef={audioRef} />*/}
              {/*<AudioVisualizer3D audioRef={audioRef} />*/}
              {/*<AudioVisualizerPlane audioRef={audioRef} />*/}
              <AudioRainVisualizer audioRef={audioRef} />
          </div>

          {/* Info canción */}
          <div className="absolute bottom-40 z-10 text-center">
            <h2 className="text-2xl font-bold">{currentSong.title}</h2>
            <p className="text-lapsus-500">{currentSong.artist}</p>
          </div>

          {/* Barra de progreso (solo display) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full px-6 py-8 mt-[400px] bg-lapsus-900"
          >
            <div className="flex items-center gap-4 w-full px-6">
              <div className="text-xs text-lapsus-500 w-10 text-right">
                {formatTime(currentTime)}
              </div>
              <div className="flex-grow bg-lapsus-700 h-1 rounded">
                <div
                  className="bg-lapsus-500 h-1 rounded"
                  style={{
                    width: duration
                      ? `${(currentTime / duration) * 100}%`
                      : "0%",
                  }}
                />
              </div>
              <div className="text-xs text-lapsus-500 w-10">
                {formatTime(duration)}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExpandedPlayerView;
