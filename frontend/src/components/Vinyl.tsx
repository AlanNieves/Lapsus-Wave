import { useEffect, useRef, useState } from "react";

interface VinylProps {
  imageUrl: string;
  isPlaying: boolean;
  onClick?: () => void;
}

export const Vinyl = ({ imageUrl, isPlaying, onClick }: VinylProps) => {
  const vinylRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time: number) => {
      if (isPlaying) {
        const delta = time - lastTime;
        lastTime = time;
        const degreesPerSecond = 30; // Ajusta la velocidad
        setAngle((prev) => prev + (degreesPerSecond * delta) / 1000);
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying && requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, [isPlaying]);

  return (
    <div
      ref={vinylRef}
      onClick={onClick}
      style={{
        transform: `rotate(${angle}deg)`,
        transition: isPlaying ? "none" : "transform 0.4s linear",
        willChange: "transform", // Optimiza layout
      }}
      className="
        relative
        w-14
        h-14
        min-h-14
        max-h-14
        rounded-full
        bg-black
        shadow-lg
        cursor-pointer
        overflow-hidden
      "
    >
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-lapsus-900 rounded-full z-20 -translate-x-1/2 -translate-y-1/2" />
      <img
        src={imageUrl}
        alt="Vinyl"
        className="w-full h-full rounded-full object-cover"
      />
    </div>
  );
};
