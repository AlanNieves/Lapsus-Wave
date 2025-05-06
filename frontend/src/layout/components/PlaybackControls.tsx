import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Laptop2, ListMusic, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";



const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
    isMuted, 
    toggleMute,
  } = usePlayerStore();

  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);


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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    // Si el volumen es 0 y no está muteado, activamos el mute
    if (volume === 0 && !isMuted) {
      toggleMute();
    }
  
    // Si el volumen sube de 0 y está muteado, lo desmuteamos
    if (volume > 0 && isMuted) {
      toggleMute();
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100; // El volumen en HTML va de 0.0 a 1.0
    }
  }, [volume]);
  

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  return (
    <footer className='h-20 sm:h-24 bg-gradient-to-tl from-lapsus-1200/30 to-lapsus-900  border-x-lapsus-900 px-4'>
      <div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
        {/* currently playing song */}
        <div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]'>
          {currentSong && (
            <>
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className='w-14 h-14 object-cover rounded-md'
                onClick={toggleExpandedView}
              />
              <div className='flex-1 min-w-0'>
                <div className='font-medium truncate hover:underline cursor-pointer'>
                  {currentSong.title}
                </div>
                <div className='text-sm text-lapsus-800 truncate hover:underline cursor-pointer'
                onClick={toggleExpandedView}
                >
                  {currentSong.artist}
                </div>
              </div>
            </>
          )}
        </div>

        {/* player controls*/}
        <div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
          <div className='flex items-center gap-4 sm:gap-6'>
            <Button
              size='icon'
              variant='ghost'
              className={`hidden sm:inline-flex ${isShuffleActive ? 'text-red-400 hover:text-white hover:bg-accent' : 'text-lapsus-500 hover:text-white'}`}
              onClick={toggleShuffle}
              disabled={!currentSong}
            >
              <Shuffle className='h-4 w-4' />
            </Button>

            <Button
              size='icon'
              variant='ghost'
              className='hover:text-lapsus-500 text-lapsus-500'
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className='h-4 w-4' />
            </Button>

            <Button
              size='icon'
              className='bg-lapsus-500 hover:bg-red-200 text-lapsus-900 rounded-full h-8 w-8'
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='hover:text-lapsus-500 text-lapsus-500'
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className='h-4 w-4' />
            </Button>
            <div className="relative">
              <Button
                size='icon'
                variant='ghost'
                className={`hidden sm:inline-flex ${repeatMode === 1 ? 'text-red-400' : repeatMode === 2 ? 'text-red-400 glow' : 'text-lapsus-500 hover:text-white'}`}
                onClick={toggleRepeat}
                disabled={!currentSong}
              >
                <Repeat className='h-4 w-4' />
              </Button>
              {repeatMode === 2 && (
                <span className="absolute bottom-0 right-0 text-xs text-red-400">✦</span>
              )}
              {repeatMode === 1 && (
                <span className="absolute bottom-0 right-0 text-xs text-red-400">•</span>
              )}
            </div>
          </div>

          <div className='hidden sm:flex items-center gap-2 w-full'>
            <div className='text-xs text-lapsus-500'>{formatTime(currentTime)}</div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className='w-full hover:cursor-grab active:cursor-grabbing'
              onValueChange={handleSeek}
            />
            <div className='text-xs text-lapsus-500'>{formatTime(duration)}</div>
          </div>
        </div>
        {/* volume controls */}
        <div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end'>
          <Button size='icon' variant='ghost' className='hover:text-white text-lapsus-500'>
            <Mic2 className='h-4 w-4' />
          </Button>

          <Button
            size='icon'
            variant='ghost'
            className='hover:text-white text-lapsus-500'
            onClick={() => toggleQueue()}
          >
            <ListMusic className='h-4 w-4' />
          </Button>

          <div className="absolute right-0 z-50 mt-2">


          </div>


          <Button size='icon' variant='ghost' className='hover:text-white text-lapsus-500'>
            <Laptop2 className='h-4 w-4' />
          </Button>

          <div className='flex items-center gap-2'>

           
          <Button onClick={toggleMute} variant="ghost" size="icon">
            {isMuted || volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : volume <= 33 ? (
              <Volume className="h-5 w-5" />
            ) : volume <= 66 ? (
              <Volume1 className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>



            <Slider
              value={[volume]}
              max={100}
              step={1}
              className='w-24 hover:cursor-grab active:cursor-grabbing'
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