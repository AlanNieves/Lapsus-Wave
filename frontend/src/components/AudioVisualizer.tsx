import { useEffect, useRef, useState } from "react";

interface AudioVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

// Cache global para evitar conexiones duplicadas
const audioSourceCache = new WeakMap<HTMLAudioElement, {
  context: AudioContext;
  source: MediaElementAudioSourceNode;
  analyser: AnalyserNode;
}>();

// Función helper para cancelar animation frames de forma segura
const safeCancelAnimationFrame = (frameRef: React.MutableRefObject<number | undefined>) => {
  if (frameRef.current !== undefined) {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = undefined;
  }
};

export const AudioVisualizer = ({ audioRef }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    
    if (!audio || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuración del canvas
    canvas.width = 300;
    canvas.height = 300;

    try {
      let audioContext: AudioContext;
      let source: MediaElementAudioSourceNode;
      let analyser: AnalyserNode;

      // Verificar si ya tenemos una conexión cacheada para este audio
      const cached = audioSourceCache.get(audio);
      if (cached) {
        ({ context: audioContext, source, analyser } = cached);
      } else {
        // Configuración CORS para el elemento de audio
        audio.crossOrigin = "anonymous";
        
        // Crear nueva conexión
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        try {
          source = audioContext.createMediaElementSource(audio);
          source.connect(analyser);
          analyser.connect(audioContext.destination);
          
          // Cachear la conexión
          audioSourceCache.set(audio, { 
            context: audioContext, 
            source, 
            analyser 
          });
        } catch (e) {
          console.error("Error creating audio source:", e);
          setError("Error al configurar el audio");
          return;
        }
      }

      const render = () => {
        if (!analyser) return;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Visualización circular del audio
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.3;

        for (let i = 0; i < bufferLength; i++) {
          const angle = (i / bufferLength) * Math.PI * 2;
          const barLength = (dataArray[i] / 255) * radius * 0.5;
          
          ctx.beginPath();
          ctx.moveTo(
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius
          );
          ctx.lineTo(
            centerX + Math.cos(angle) * (radius + barLength),
            centerY + Math.sin(angle) * (radius + barLength)
          );
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + (dataArray[i] / 255) * 0.8})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        animationFrameRef.current = requestAnimationFrame(render);
      };

      const handlePlay = () => {
        if (audioContext.state === "suspended") {
          audioContext.resume();
        }
      };

      audio.addEventListener('play', handlePlay);
      render();

      return () => {
        audio.removeEventListener('play', handlePlay);
        safeCancelAnimationFrame(animationFrameRef);
        
        // No desconectamos los nodos para permitir reuso
      };
    } catch (err) {
      console.error("AudioVisualizer error:", err);
      setError("Error al inicializar el visualizador de audio");
    }
  }, [audioRef]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-40 blur-sm">
      <canvas ref={canvasRef} width={300} height={300} />
    </div>
  );
};