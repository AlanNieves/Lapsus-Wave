import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface AudioWaveformProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioWaveform3D = ({ audioRef }: AudioWaveformProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const linesRef = useRef<THREE.Line[]>([]);

  const setupAudio = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (!audioContextRef.current || audioContextRef.current.state === "closed") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 1024;
      analyserRef.current.smoothingTimeConstant = 0.8;
    }

    if (!sourceNodeRef.current) {
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioElement);
      sourceNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const width = container.clientWidth;
    const height = Math.min(container.clientHeight, window.innerHeight * 0.6);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 5, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const lineCount = 60;
    const pointCount = 256;
    const spacingZ = 0.2;
    const lines: THREE.Line[] = [];

    const baseGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);

    const color1 = new THREE.Color(0x00ff00);
    const color2 = new THREE.Color(0x003300);

    for (let i = 0; i < pointCount; i++) {
      positions[i * 3] = (i - pointCount / 2) * 0.2; // x
      positions[i * 3 + 1] = 0; // y
      positions[i * 3 + 2] = 0; // z

      const color = color1.clone().lerp(color2, i / pointCount);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    baseGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    baseGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    for (let j = 0; j < lineCount; j++) {
      const geometry = baseGeometry.clone();
      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
      });

      const line = new THREE.Line(geometry, material);
      line.position.z = -j * spacingZ;
      scene.add(line);
      lines.push(line);
    }

    linesRef.current = lines;

    setIsReady(true);

    const dataArray = new Uint8Array(analyserRef.current?.frequencyBinCount || 1024);

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      const time = performance.now() * 0.002;

      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
      }

      for (let k = 0; k < lines.length; k++) {
        const line = lines[k];
        const positions = (line.geometry.attributes.position.array as Float32Array);

        for (let i = 0; i < pointCount; i++) {
          const x = (i - pointCount / 2) * 0.2;
          const freqIndex = Math.floor(i * dataArray.length / pointCount);
          const audioY = analyserRef.current ? (dataArray[freqIndex] / 255) * 2.5 : 0;
          const waveY = Math.sin(i * 0.3 + time + k * 0.2) * 0.5;
          positions[i * 3] = x;
          positions[i * 3 + 1] = waveY + audioY;
          positions[i * 3 + 2] = 0;
        }
        line.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (container && renderer) {
        const newWidth = container.clientWidth;
        const newHeight = Math.min(container.clientHeight, window.innerHeight * 0.6);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (renderer && renderer.domElement) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handlePlay = async () => {
      try {
        setupAudio();
        if (audioContextRef.current?.state === "suspended") {
          await audioContextRef.current.resume();
        }
      } catch (err) {
        console.error("Error de audio:", err);
        setError(`Error de audio: ${err instanceof Error ? err.message : "Desconocido"}`);
      }
    };

    audioElement.addEventListener("play", handlePlay);

    if (!audioElement.paused && audioElement.readyState >= 2) {
      handlePlay();
    }

    return () => {
      audioElement.removeEventListener("play", handlePlay);
    };
  }, [audioRef]);

  return (
    <div
      className="relative w-full flex justify-center items-center"
      style={{ height: "60vh" }}
    >
      <div ref={mountRef} className="w-full h-full pointer-events-none" />

      {!isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-green-300 p-4 text-xl animate-pulse">
            <div className="w-12 h-12 border-t-2 border-green-300 border-solid rounded-full animate-spin mx-auto mb-3"></div>
            Cargando visualización 3D...
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-red-400 p-4 bg-gray-900 rounded-lg max-w-md text-center">
            <div className="text-2xl mb-2">🔊 Error de audio</div>
            <div>{error}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioWaveform3D;
