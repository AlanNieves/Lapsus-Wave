import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Volume2, VolumeX } from "lucide-react";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const Tooltip = ({ text }: { text: string }) => {
  return (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs font-medium text-white bg-neutral-800 rounded-md shadow-lg whitespace-nowrap transition-opacity duration-150">
      {text}
      <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-800 transform rotate-45" />
    </div>
  );
};

export const ExpandedPlayerView = () => {
  const {
    currentSong,
    isExpandedViewOpen,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    toggleShuffle,
    isShuffleActive,
    toggleRepeat,
    repeatMode,
    toggleExpandedView,
  } = usePlayerStore();

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);

  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hoveredButton, setHoveredButton] = useState<null | 'shuffle' | 'previous' | 'play' | 'next' | 'repeat' | 'queue' | 'lyrics' | 'mute' | 'connect'>(null);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");

    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    const handleEnded = () => {
      usePlayerStore.setState({ isPlaying: false });
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  const getVolumeIcon = () => {
    if (!audioRef.current || audioRef.current.muted || volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 33) return <Volume2 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  // Actualizar la fecha y la hora cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!currentSong) return null;

  // Formatear la fecha y la hora
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
            initial={{ opacity: 0.5, scale: 1 }}
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
          <div className="flex flex-col items-center gap-4 z-10 mt-20">
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
          <footer className="w-full h-full px-6 py-8 bg-lapsus-900">
              <div className="flex flex-col justify-center items-center gap-8 h-full w-full">
<div className="flex w-full items-center justify-center gap-6">
                {/* Controles de reproducción */}
                <div className="flex items-center gap-6 flex-wrap justify-center">
                  {/* Shuffle Button */}
                  <div className="relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`${isShuffleActive ? 'text-red-400 hover:text-white hover:bg-accent' : 'text-lapsus-500 hover:text-white'}`}
                      onClick={toggleShuffle}
                      onMouseEnter={() => setHoveredButton('shuffle')}
                      onMouseLeave={() => setHoveredButton(null)}
                      disabled={!currentSong}
                    >
                      <Shuffle className="h-5 w-5" />
                    </Button>
                    {hoveredButton === 'shuffle' && <Tooltip text="Enable shuffle" />}
                  </div>

                  {/* Previous Button */}
                  <div className="relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:text-lapsus-500 text-lapsus-500"
                      onClick={playPrevious}
                      onMouseEnter={() => setHoveredButton('previous')}
                      onMouseLeave={() => setHoveredButton(null)}
                      disabled={!currentSong}
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    {hoveredButton === 'previous' && <Tooltip text="Previous" />}
                  </div>

                  {/* Play/Pause Button */}
                  <div className="relative">
                    <Button
                      size="icon"
                      className="bg-lapsus-500 hover:bg-red-200 text-lapsus-900 rounded-full h-10 w-10"
                      onClick={togglePlay}
                      onMouseEnter={() => setHoveredButton('play')}
                      onMouseLeave={() => setHoveredButton(null)}
                      disabled={!currentSong}
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    {hoveredButton === 'play' && <Tooltip text={isPlaying ? "Pause" : "Play"} />}
                  </div>

                  {/* Next Button */}
                  <div className="relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:text-lapsus-500 text-lapsus-500"
                      onClick={playNext}
                      onMouseEnter={() => setHoveredButton('next')}
                      onMouseLeave={() => setHoveredButton(null)}
                      disabled={!currentSong}
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    {hoveredButton === 'next' && <Tooltip text="Next" />}
                  </div>

                  {/* Repeat Button */}
                  <div className="relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`${repeatMode === 1 ? 'text-red-400' : repeatMode === 2 ? 'text-red-400 glow' : 'text-lapsus-500 hover:text-white'}`}
                      onClick={toggleRepeat}
                      onMouseEnter={() => setHoveredButton('repeat')}
                      onMouseLeave={() => setHoveredButton(null)}
                      disabled={!currentSong}
                    >
                      <Repeat className="h-5 w-5" />
                    </Button>
                    {hoveredButton === 'repeat' && (
                      <Tooltip text={
                        repeatMode === 1 ? "Repeat all"
                          : repeatMode === 2 ? "Repeat one"
                            : "Repeat"
                      } />
                    )}
                    {repeatMode === 2 && (
                      <span className="absolute bottom-0 right-0 text-xs text-red-400">✦</span>
                    )}
                    {repeatMode === 1 && (
                      <span className="absolute bottom-0 right-0 text-xs text-red-400">•</span>
                    )}
                  </div>
                  </div>
                  {/* Controles de volumen */}
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleMute}
                      className="hover:text-white text-lapsus-500"
                      onMouseEnter={() => setHoveredButton('mute')}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      {getVolumeIcon()}
                    </Button>
                    {hoveredButton === 'mute' && <Tooltip text="Mute" />}
                    <Slider
                      value={[volume]}
                      max={100}
                      step={1}
                      className="w-32 hover:cursor-grab active:cursor-grabbing"
                      onValueChange={(value) => {
                        setVolume(value[0]);
                        if (audioRef.current) {
                          audioRef.current.volume = value[0] / 100;
                        }
                      }}
                    />
                  </div>
                </div>
                </div>

                {/* Barra de progreso */}
                <div className="flex items-center gap-4 w-full max-w-4xl px-4">
                  <div className="text-xs text-lapsus-500 w-10 text-right">{formatTime(currentTime)}</div>
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    className="flex-grow hover:cursor-grab active:cursor-grabbing"
                    onValueChange={handleSeek}
                  />
                  <div className="text-xs text-lapsus-500 w-10">{formatTime(duration)}</div>
                </div>

                
              </div>
            </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExpandedPlayerView;