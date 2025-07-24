import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import vertexShader from "@/shaders/vertexShader";
import fragmentShader from "@/shaders/fragmentShader";

interface AudioVisualizerPlaneProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioVisualizerPlane = ({ audioRef }: AudioVisualizerPlaneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<any>(null);
  const animationFrameId = useRef<number | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = Math.min(container.clientHeight, window.innerHeight * 0.6);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const t = 0;
    camera.position.x = -50 * Math.sin(t / 10);
    camera.position.z = 25 * Math.sin(t / 15);
    camera.position.y = 5 * (Math.sin(t / 10) + 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const clock = new THREE.Clock();

    // Geometry and Material
    const meshSegments = 128;
    const geometry = new THREE.PlaneGeometry(
      meshSegments / 2,
      meshSegments / 2,
      meshSegments,
      meshSegments
    );

    const uniforms = {
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_time: { value: 0.0 },
      u_amplitude: { value: 5.0 },
      u_data_arr: { value: new Uint8Array(meshSegments * 2) },
      u_mouse: { value: new THREE.Vector2(0, 0) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      wireframe: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const planeMesh = new THREE.Points(geometry, material);
    planeMesh.rotation.x = Math.PI / 2;
    planeMesh.position.y = 8;
    planeMesh.scale.set(2, 2, 2);
    scene.add(planeMesh);

    // Post-processing
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.3, // strength (ajustado)
      0.5, // radius
      0.01 // threshold
    );

    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    setIsReady(true);

    const dataArray = new Uint8Array(meshSegments * 2);
    uniforms.u_data_arr.value = dataArray;
const cameraTarget = new THREE.Vector3();

const animate = () => {
  animationFrameId.current = requestAnimationFrame(animate);

  if (analyserRef.current) {
    analyserRef.current.getByteFrequencyData(dataArray);
  }

  const elapsed = clock.getElapsedTime();

  if (audioRef.current) {
    if (!audioRef.current.paused) {
      const t = audioRef.current.currentTime;

      cameraTarget.set(
        -50 * Math.sin(t / 10),
        5 * (Math.sin(t / 10) + 1),
        25 * Math.sin(t / 15)
      );
    } else {
      const idleRadius = 10; // Reducido
cameraTarget.set(
  idleRadius * Math.sin(elapsed / 16),
  6 + 0.5 * Math.sin(elapsed / 6), // Menos altura
  15 + 2 * Math.cos(elapsed / 12)  // Más cerca del plano frontal
);
    }

    // 🎯 Suaviza el movimiento hacia el objetivo
    camera.position.lerp(cameraTarget, 0.05);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  uniforms.u_time.value = elapsed;
  composer.render();
};

animate();

    const handleResize = () => {
      if (container && renderer) {
        const newWidth = container.clientWidth;
        const newHeight = Math.min(container.clientHeight, window.innerHeight * 0.6);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
        composer.setSize(newWidth, newHeight);
        uniforms.u_resolution.value.set(newWidth, newHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", (e) => {
      uniforms.u_mouse.value.set(e.clientX, e.clientY);
    });

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
        if (!audioContextRef.current || audioContextRef.current.state === "closed") {
          audioContextRef.current = new AudioContext();
        }
        if (!analyserRef.current) {
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
          analyserRef.current.smoothingTimeConstant = 0.85;
        }
        if (!sourceNodeRef.current) {
          sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioElement);
          sourceNodeRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        }

        if (audioContextRef.current.state === "suspended") {
          await audioContextRef.current.resume();
        }
      } catch (err) {
        console.error("Error al configurar audio:", err);
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
    <div className="relative w-full flex justify-center items-center" style={{ height: "60vh" }}>
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

export default AudioVisualizerPlane;
