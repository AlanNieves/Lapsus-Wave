import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const { currentSong, isPlaying, playNext, repeatMode, setRepeatMode, setIsPlaying } = usePlayerStore();

  // handle play/pause logic
  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio?.play().catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Error playing audio:", error);
        }
      });
    } else {
      audio?.pause();
    }
  }, [isPlaying]);

  // handle song ends
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      if (!audio) return;

      if (repeatMode === 1) {
        // Repetir una vez
        audio.currentTime = 0; // Reiniciar la canción
        setIsPlaying(true); // Forzar el estado de reproducción
        audio.play() // Reproducir automáticamente
          .catch((error) => {
            if (error.name !== "AbortError") {
              console.error("Error playing audio:", error);
            }
          });
        setRepeatMode(0); // Desactivar el modo de repetición después de una repetición
      } else if (repeatMode === 2) {
        // Repetir infinitamente
        audio.currentTime = 0; // Reiniciar la canción
        setIsPlaying(true); // Forzar el estado de reproducción
        audio.play() // Reproducir automáticamente
          .catch((error) => {
            if (error.name !== "AbortError") {
              console.error("Error playing audio:", error);
            }
          });
      } else {
        // No hay repetición, continuar con la siguiente canción
        playNext();
      }
    };

    audio?.addEventListener("ended", handleEnded);

    return () => audio?.removeEventListener("ended", handleEnded);
  }, [playNext, repeatMode, setRepeatMode, setIsPlaying]);

  // handle song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    // check if this is actually a new song
    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
    if (isSongChange) {
      audio.pause(); // Stop the current audio
      audio.src = currentSong?.audioUrl || "";
      // reset the playback position
      audio.currentTime = 0;

      prevSongRef.current = currentSong?.audioUrl;

      // Desactivar el modo de repetición al cambiar de canción
      setRepeatMode(0);

      if (isPlaying) {
        audio.play().catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Error playing audio:", error);
          }
        });
      }
    }
  }, [currentSong, isPlaying, setRepeatMode]);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;