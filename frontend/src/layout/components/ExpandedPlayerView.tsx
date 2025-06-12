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
            <p className="animate-pulse">{formattedDate}</p>
            <p className="animate-pulse">{formattedTime}</p>
          </div>
          <div className="absolute top-4 right-4 text-lapsus-500 text-sm font-semibold animate-softGlow">
            LAPSUS INNOVATIONS
          </div>

          {/* Efecto de agua con SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <filter id="waterEffect" x="0" y="0" width="100%" height="100%">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.02 0.03" 
                numOctaves="3" 
                seed="50"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="20s"
                  values="0.02 0.03; 0.03 0.04; 0.02 0.03"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap 
                in="SourceGraphic" 
                scale="15" 
                xChannelSelector="R" 
                yChannelSelector="G"
              />
            </filter>
          </svg>

          {/* Texto "LAPSUS" con efecto agua intenso */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 2 }}
          >
            <motion.h1 
              className="text-[18rem] font-black tracking-tighter bg-clip-text"
              style={{
                backgroundImage: `
                  linear-gradient(
                    45deg,
                    rgba(164, 77, 121, 0.5),
                    rgba(255, 255, 255, 0.7),
                    rgba(164, 77, 121, 0.5)
                  )`,
                WebkitTextFillColor: 'transparent',
                backgroundSize: '300% 300%',
                filter: 'url(#waterEffect) blur(0.8px)'
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
                scale: [1, 1.02]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              LAPSUS
            </motion.h1>
          </motion.div>

          {/* Efecto de luz pulsante */}
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
          
          {/* Contenido principal */}
          <div className="flex flex-col items-center gap-4 z-10 mt-20">
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

            <div className="text-center">
              <h2 className="text-2xl font-bold">{currentSong.title}</h2>
              <p className="text-lapsus-500">{currentSong.artist}</p>
            </div>
          </div>

          {/* Controles de reproducción */}
          <footer className="w-full h-full px-6 py-8 bg-lapsus-900">
            <div className="flex flex-col justify-center items-center gap-8 h-full w-full">
              {/* Controles principales */}
              <div className="flex w-full items-center justify-center gap-6">
                {/* Grupo izquierdo */}
                <div className="flex items-center gap-6">
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

                  <div className="relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-lapsus-500 hover:text-white"
                      onClick={playPrevious}
                      onMouseEnter={() => setHoveredButton('previous')}
                      onMouseLeave={() => setHoveredButton(null)}
                      disabled={!currentSong}
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    {hoveredButton === 'previous' && <Tooltip text="Previous" />}
                  </div>
                </div>

                {/* Botón central Play/Pause */}
                <div className="mx-4">
                  <div className="relative">
                    <Button
                      size="icon"
                      className="bg-lapsus-500 hover:bg-lapsus-400 text-lapsus-900 rounded-full h-12 w-12 shadow-lg transition-transform hover:scale-105"
                      onClick={togglePlay}
                      onMouseEnter={() => setHoveredButton('play')}
                      onMouseLeave={() => setHoveredButton(null)}
                      disabled={!currentSong}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6 fill-current" />
                      ) : (
                        <Play className="h-6 w-6 fill-current ml-0.5" />
                      )}
                    </Button>
                    {hoveredButton === 'play' && <Tooltip text={isPlaying ? "Pause" : "Play"} />}
                  </div>
                </div>

                {/* Grupo derecho */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-lapsus-500 hover:text-white"
                      onClick={playNext}
                      onMouseEnter={() => setHoveredButton('next')}
                      onMouseLeave={() => setHoveredButton(null)}
                      disabled={!currentSong}
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    {hoveredButton === 'next' && <Tooltip text="Next" />}
                  </div>

                  <div className="relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`${repeatMode === 1 ? 'text-red-400' : repeatMode === 2 ? 'text-red-400' : 'text-lapsus-500 hover:text-white'}`}
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

              {/* Controles de volumen */}
              <div className="flex justify-center w-full max-w-md">
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-lapsus-500 hover:text-white"
                      onClick={toggleMute}
                      onMouseEnter={() => setHoveredButton('mute')}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      {getVolumeIcon()}
                    </Button>
                    {hoveredButton === 'mute' && <Tooltip text={volume === 0 ? "Unmute" : "Mute"} />}
                  </div>
                  <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    className="w-full hover:cursor-grab active:cursor-grabbing"
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
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExpandedPlayerView;