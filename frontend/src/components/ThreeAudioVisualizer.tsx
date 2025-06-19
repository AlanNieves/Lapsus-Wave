import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
//import { OrbitControls } from 'three-stdlib';

interface AudioVisualizer3DProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioVisualizer3D = ({ audioRef }: AudioVisualizer3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Referencias para three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Configuración inicial de Three.js
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Crear sistema de partículas
    const particles = createParticles();
    scene.add(particles);
    setIsReady(true);

    // 3. Configurar animación
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 4. Efecto SEPARADO para el audio
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !audioElement.src) return;

    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let source: MediaElementAudioSourceNode | null = null;

    try {
      // Crear contexto de audio
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      
      source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      // Iniciar visualización cuando se reproduce
      const handlePlay = () => {
        if (audioContext?.state === 'suspended') {
          audioContext.resume();
        }
        startVisualization(analyser!);
      };

      audioElement.addEventListener('play', handlePlay);

      return () => {
        audioElement.removeEventListener('play', handlePlay);
        source?.disconnect();
        audioContext?.close();
      };
    } catch (err) {
      console.error('Error de audio:', err);
      setError("Error de audio: " + (err instanceof Error ? err.message : 'Desconocido'));
    }
  }, [audioRef]);

  // 5. Función para crear partículas
  const createParticles = () => {
    const particleCount = 512;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    return new THREE.Points(particles, material);
  };

  // 6. Función para iniciar visualización
  const startVisualization = (analyser: AnalyserNode) => {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const particles = sceneRef.current?.children[0] as THREE.Points;
    
    if (!particles) return;

    const animateVisualization = () => {
      analyser.getByteFrequencyData(dataArray);
      const positions = particles.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < dataArray.length; i++) {
        const value = dataArray[i] / 255;
        positions[i * 3] *= 1 + value * 0.1;
        positions[i * 3 + 1] *= 1 + value * 0.1;
        positions[i * 3 + 2] *= 1 + value * 0.1;
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
      requestAnimationFrame(animateVisualization);
    };
    
    animateVisualization();
  };

  // Renderizado condicional
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!isReady) {
    return <div className="text-blue-500 p-4">Cargando visualizador...</div>;
  }

  return <div ref={mountRef} className="w-full h-full" />;
};

export default AudioVisualizer3D;