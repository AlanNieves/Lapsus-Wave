import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const {
    currentSong,
    isPlaying,
    playNext,
    repeatMode,
    setRepeatMode,
    setIsPlaying,
    setAudioRef,
    setCurrentTime  // Nueva función para actualizar tiempo
  } = usePlayerStore();

  // Registrar referencia de audio en el store
  useEffect(() => {
    setAudioRef(audioRef);

    return () => {
      setAudioRef(null);
    };
  }, []);

  // Sincronizar eventos de audio con el estado global
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Actualizar estado cuando el audio empieza a reproducirse
    const handlePlay = () => {
      setIsPlaying(true);
      console.log("Audio event: play");
    };

    // Actualizar estado cuando el audio se pausa
    const handlePause = () => {
      setIsPlaying(false);
      console.log("Audio event: pause");
    };

    // Actualizar tiempo actual de reproducción
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    // Manejar errores de reproducción
    const handleError = (error: Event) => {
      console.error("Error en elemento de audio:", error);
      setIsPlaying(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleError);
    };
  }, [setIsPlaying, setCurrentTime]);

  // Controlar reproducción/pausa
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log("Cambio en isPlaying:", isPlaying);

    if (isPlaying) {
      // Solo reproducir si no está ya reproduciendo
      if (audio.paused) {
        audio.play().catch((error) => {
          console.error("Error al reproducir:", error);
          setIsPlaying(false);
        });
      }
    } else {
      // Solo pausar si está reproduciendo
      if (!audio.paused) {
        audio.pause();
      }
    }
  }, [isPlaying]);

  // Manejar final de canción
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
  console.log("Canción finalizada");

  if (repeatMode === 2) {
    // Repetir infinitamente la misma canción
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(err => {
      console.error("Error al repetir canción infinitamente:", err);
      setIsPlaying(false);
    });
    return;
  }

  if (repeatMode === 1) {
    // Repetir una vez y luego pasar a la siguiente
    setRepeatMode(0);
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(err => {
      console.error("Error al repetir una vez:", err);
      setIsPlaying(false);
    });
    return;
  }

  // Si no hay repetición, ir a la siguiente canción
  playNext();
};



    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [playNext, repeatMode, setIsPlaying]);

  // Manejar cambios de canción
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    const isSongChange = currentSong && audio.src !== currentSong.audioUrl;
    if (!currentSong.audioUrl) return;

    if (isSongChange) {
      console.log("Cambiando a nueva canción:", currentSong.title);

      // Guardar referencia para evitar cambios innecesarios
      prevSongRef.current = currentSong.audioUrl;

      // Pausar antes de cambiar
      audio.pause();

      // Configurar nueva fuente
      audio.src = currentSong.audioUrl || "";
      audio.load();
      audio.currentTime = 0;
      if (isPlaying) {
        audio
          .play()
          .then(() => console.log("Reproducción reanudada"))
          .catch((err) => {
            console.error("Error al reanudar reproducción:", err);
            setIsPlaying(false);
          });
      }
      audio.crossOrigin = "anonymous";

      // Resetear modo repetición
      setRepeatMode(0);

      // Intentar reproducir si estaba en estado de reproducción
      if (isPlaying) {
        // Pequeño retraso para asegurar la carga
        setTimeout(() => {
          audio.play().catch(error => {
            console.error("Error al reproducir nueva canción:", error);
            setIsPlaying(false);
          });
        }, 100);
      }
    }
  }, [currentSong, isPlaying, setRepeatMode, setIsPlaying]);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;