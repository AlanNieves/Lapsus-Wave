import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react";
import { MouseEvent } from "react";

interface PlayButtonProps {
  song: Song;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const PlayButton = ({ song }: PlayButtonProps) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const isCurrentSong = currentSong?._id === song._id;

  const handlePlay = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isCurrentSong) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };

  return (
    <Button
      size="icon"
      onClick={handlePlay}
      className={`absolute bottom-3 right-2 backdrop-blur-md border border-white/10 shadow-lg
        bg-gradient-to-br from-[#1f102a]/70 to-[#913f8f]/70
        hover:scale-110 transition-all duration-300
        group-hover:opacity-100 opacity-0 translate-y-2 group-hover:translate-y-0
        rounded-full`}
    >
      {isCurrentSong && isPlaying ? (
        <Pause className="size-5 text-white drop-shadow" />
      ) : (
        <Play className="size-5 text-white drop-shadow" />
      )}
    </Button>
  );
};

export default PlayButton;
