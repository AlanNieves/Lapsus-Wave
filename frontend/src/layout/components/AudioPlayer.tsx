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
    let repeatCount = 0;

    const handleEnded = () => {
      if (!audio) return;

      if (repeatMode === 1) {
        audio.currentTime = 0;
        audio.play();
        setRepeatMode(0); // Disable repeat after one repeat
        setIsPlaying(true); // Set play button to pause state
      } else if (repeatMode === 2) {
        if (repeatCount < 1) {
          repeatCount++;
          audio.currentTime = 0;
          audio.play();
          setIsPlaying(true); // Set play button to pause state
        } else {
          repeatCount = 0;
          setRepeatMode(0); // Disable repeat after two repeats
          audio.currentTime = 0;
          audio.play();
          setIsPlaying(true); // Set play button to pause state
        }
      } else {
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

      if (isPlaying) {
        audio.play().catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Error playing audio:", error);
          }
        });
      }
    }
  }, [currentSong, isPlaying]);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;