import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react";
import { MouseEvent } from "react";

interface PlayButtonProps {
  song: Song;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const PlayButton = ({ song }: PlayButtonProps) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const isCurrentSong = currentSong?._id === song._id;

  const handlePlay = (e: MouseEvent<HTMLButtonElement>) => { // Tipo específico para el evento
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
      className={`absolute bottom-3 right-2 bg-gradient-to-br from-lapsus-1200 to-lapsus-1250 hover:bg-lapsus-1000 hover:scale-105 transition-all 
        opacity-0 translate-y-2 group-hover:translate-y-0 ${
          isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
    >
      {isCurrentSong && isPlaying ? (
        <Pause className="size-5 text-lapsus-500" />
      ) : (
        <Play className="size-5 text-lapsus-500" />
      )}
    </Button>
  );
};

export default PlayButton;