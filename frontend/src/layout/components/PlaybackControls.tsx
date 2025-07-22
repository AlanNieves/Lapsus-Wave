import { Button } from "@/components/ui/button";
import { Vinyl } from "@/components/Vinyl";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  ListMusic,
  Mic2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { translations } from "@/locales";
import CastButton from "./CastButton";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const Tooltip = ({ text }: { text: string }) => {
  return (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs font-medium text-white bg-purple-800/80 rounded-md shadow-lg whitespace-nowrap transition-opacity duration-150">
      {text}
      <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-800/80 transform rotate-45" />
    </div>
  );
};

export const PlaybackControls = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    toggleShuffle,
    isShuffleActive,
    toggleRepeat,
    repeatMode,
    toggleQueue,
    toggleExpandedView,
  } = usePlayerStore();
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hoveredButton, setHoveredButton] = useState<
    | null
    | "shuffle"
    | "previous"
    | "play"
    | "next"
    | "repeat"
    | "queue"
    | "lyrics"
    | "mute"
    | "connect"
  >(null);

  const { language } = useLanguageStore();
  const t = translations[language];

  useEffect(() => {
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      usePlayerStore.setState({ isPlaying: false });
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
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

  const [isMuted, setIsMuted] = useState(false);
  const toggleMute = () => setIsMuted((prev) => !prev);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />;
    if (volume < 34) return <Volume />;
    if (volume < 67) return <Volume1 />;
    return <Volume2 />;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "m") toggleMute();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTyping =
        (e.target as HTMLElement)?.tagName === "INPUT" ||
        (e.target as HTMLElement)?.tagName === "TEXTAREA";
      if (isTyping) return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay]);

  return (
    <footer className="h-20 sm:h-24 bg-white/5 backdrop-blur-2xl border-t border-white/10 shadow-xl px-4 overflow-x-hidden transition-colors">
      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
        {/* Left: Song */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
          {currentSong && (
            <>
              <Vinyl
                imageUrl={currentSong.imageUrl}
                isPlaying={isPlaying}
                onClick={toggleExpandedView}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate hover:underline cursor-pointer">
                  {currentSong.title}
                </div>
                <div
                  className="text-sm text-purple-300 truncate hover:underline cursor-pointer"
                  onClick={toggleExpandedView}
                >
                  {currentSong.artist}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Center: Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Shuffle */}
            <div className="relative hidden sm:inline-flex">
              <Button
                size="icon"
                variant="ghost"
                className={`${
                  isShuffleActive
                    ? "text-purple-300"
                    : "text-purple-100 hover:text-white"
                }`}
                onClick={toggleShuffle}
                onMouseEnter={() => setHoveredButton("shuffle")}
                onMouseLeave={() => setHoveredButton(null)}
                disabled={!currentSong}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              {hoveredButton === "shuffle" && (
                <Tooltip text={t.shuffle || "Enable shuffle"} />
              )}
            </div>

            {/* Previous */}
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                className="text-purple-100 hover:text-white"
                onClick={playPrevious}
                onMouseEnter={() => setHoveredButton("previous")}
                onMouseLeave={() => setHoveredButton(null)}
                disabled={!currentSong}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              {hoveredButton === "previous" && (
                <Tooltip text={t.previous || "Previous"} />
              )}
            </div>

            {/* Play/Pause */}
            <div className="relative">
              <Button
                size="icon"
                className="bg-purple-500 hover:bg-purple-400 text-white rounded-full h-8 w-8 shadow-md"
                onClick={togglePlay}
                onMouseEnter={() => setHoveredButton("play")}
                onMouseLeave={() => setHoveredButton(null)}
                disabled={!currentSong}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              {hoveredButton === "play" && (
                <Tooltip
                  text={isPlaying ? t.pause || "Pause" : t.play || "Play"}
                />
              )}
            </div>

            {/* Next */}
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                className="text-purple-100 hover:text-white"
                onClick={playNext}
                onMouseEnter={() => setHoveredButton("next")}
                onMouseLeave={() => setHoveredButton(null)}
                disabled={!currentSong}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              {hoveredButton === "next" && (
                <Tooltip text={t.next || "Next"} />
              )}
            </div>

            {/* Repeat */}
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                className={`hidden sm:inline-flex ${
                  repeatMode === 1 || repeatMode === 2
                    ? "text-purple-300"
                    : "text-purple-100 hover:text-white"
                }`}
                onClick={toggleRepeat}
                onMouseEnter={() => setHoveredButton("repeat")}
                onMouseLeave={() => setHoveredButton(null)}
                disabled={!currentSong}
              >
                <Repeat className="h-4 w-4" />
              </Button>
              {hoveredButton === "repeat" && (
                <Tooltip
                  text={
                    repeatMode === 1
                      ? t.repeatAll || "Repeat all"
                      : repeatMode === 2
                      ? t.repeatOne || "Repeat one"
                      : t.repeat || "Repeat"
                  }
                />
              )}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 w-full">
            <div className="text-xs text-purple-200">{formatTime(currentTime)}</div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className="w-full hover:cursor-grab active:cursor-grabbing"
              onValueChange={handleSeek}
            />
            <div className="text-xs text-purple-200">{formatTime(duration)}</div>
          </div>
        </div>

        {/* Right: Volume and misc */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
          {/* Lyrics */}
          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              className="text-purple-100 hover:text-white"
              onMouseEnter={() => setHoveredButton("lyrics")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Mic2 className="h-4 w-4" />
            </Button>
            {hoveredButton === "lyrics" && (
              <Tooltip text={t.lyrics || "Lyrics"} />
            )}
          </div>

          {/* Queue */}
          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              className="text-purple-100 hover:text-white"
              onClick={toggleQueue}
              onMouseEnter={() => setHoveredButton("queue")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <ListMusic className="h-4 w-4" />
            </Button>
            {hoveredButton === "queue" && (
              <Tooltip text={t.queue || "Queue"} />
            )}
          </div>

          {/* Connect */}
          <div className="relative">
            <CastButton
              mediaUrl={currentSong?.audioUrl || ""}
              title={currentSong?.title}
            />
          </div>

          {/* Volume */}
          <div className="relative flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleMute}
              className="text-purple-100 hover:text-white"
              onMouseEnter={() => setHoveredButton("mute")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {getVolumeIcon()}
            </Button>
            {hoveredButton === "mute" && (
              <Tooltip text={t.mute || "Mute"} />
            )}
            <Slider
              value={[volume]}
              max={100}
              step={1}
              className="w-24 hover:cursor-grab active:cursor-grabbing"
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
  );
};
