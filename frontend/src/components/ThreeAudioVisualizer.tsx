
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

let globalAudioContext: AudioContext | null = null;
let globalAnalyser: AnalyserNode | null = null;
let globalSource: MediaElementAudioSourceNode | null = null;

interface AudioVisualizer3DProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioVisualizer3D = ({ audioRef }: AudioVisualizer3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const linesGroupRef = useRef<THREE.Group | null>(null);
  const basePositionsRef = useRef<Float32Array | null>(null);
  const connectionsRef = useRef<[number, number, THREE.Line][] | null>(null);
  const visualizerGroupRef = useRef<THREE.Group | null>(null);  // NUEVO
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = Math.min(container.clientHeight, window.innerHeight * 0.7);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 35;

// 🔁 Eje de rotación personalizado
//const orbitAxis = new THREE.Vector3(0.4, 1, 0).normalize(); // Eje inclinado (ajustable)
const rotationSpeed = 0.002; // Velocidad del giro orbital


    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x88ccff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const particleCount = 1024;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const skyBlue = new THREE.Color(0x87CEEB);

    for (let i = 0; i < particleCount; i++) {
      const radius = 15;
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      // Vector radial esférico
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      );

      // Agregar perturbación leve para romper simetría exacta (especialmente en polos)
      dir.x += (Math.random() - 0.5) * 0.05;
      dir.y += (Math.random() - 0.5) * 0.05;
      dir.z += (Math.random() - 0.5) * 0.05;
      dir.normalize(); // Asegura que siga siendo un punto en la esfera

      positions[i * 3] = dir.x * radius;
      positions[i * 3 + 1] = dir.y * radius;
      positions[i * 3 + 2] = dir.z * radius;

      colors[i * 3] = skyBlue.r;
      colors[i * 3 + 1] = skyBlue.g;
      colors[i * 3 + 2] = skyBlue.b;
    }

    basePositionsRef.current = new Float32Array(positions);

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const createPointTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.beginPath();
        ctx.arc(16, 16, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#87CEEB';
        ctx.fill();
      }

      return new THREE.CanvasTexture(canvas);
    };

    const pointTexture = createPointTexture();

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.4,
      map: pointTexture,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      alphaTest: 0.1
    });

    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    particlesRef.current = particles;

    const lineGroup = new THREE.Group();
    linesGroupRef.current = lineGroup;

    const visualizerGroup = new THREE.Group();
    visualizerGroup.add(particles);
    visualizerGroup.add(lineGroup);
    scene.add(visualizerGroup);
    visualizerGroupRef.current = visualizerGroup;

    

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.5,
      linewidth: 1.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const connectionThreshold = 5.0;
    const curveSegments = 5;
    const connections: [number, number, THREE.Line][] = [];
    const connectionKeys = new Set();

    for (let i = 0; i < particleCount; i++) {
      const maxConnections = 1 + Math.floor(Math.random() * 2);
      let connectionCount = 0;

      for (let j = 0; j < particleCount; j++) {
        if (i === j) continue;
        const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
        if (connectionKeys.has(key)) continue;

        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < connectionThreshold && connectionCount < maxConnections) {
          connectionKeys.add(key);
          connectionCount++;

          const start = new THREE.Vector3(
            positions[i * 3],
            positions[i * 3 + 1],
            positions[i * 3 + 2]
          );
          const end = new THREE.Vector3(
            positions[j * 3],
            positions[j * 3 + 1],
            positions[j * 3 + 2]
          );
          const control = new THREE.Vector3(
            (start.x + end.x) / 2 + (Math.random() - 0.5) * 2,
            (start.y + end.y) / 2 + (Math.random() - 0.5) * 2,
            (start.z + end.z) / 2 + (Math.random() - 0.5) * 2
          );

          const curve = new THREE.QuadraticBezierCurve3(start, control, end);
          const curvePoints = curve.getPoints(curveSegments);
          const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
          const curveLine = new THREE.Line(curveGeometry, lineMaterial);

          lineGroup.add(curveLine);
          connections.push([i, j, curveLine]);
        }
      }
    }

    connectionsRef.current = connections;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.enableRotate = false;  // NUEVO — Desactiva rotación manual para evitar mostrar el polo trasero
    controls.autoRotateSpeed = 0.5;
    // Restringir rotación vertical para no ver el polo (por ejemplo, la "espalda")
    controls.minPolarAngle = Math.PI / 3;  // Límite inferior (≈60° desde arriba)
    controls.maxPolarAngle = Math.PI / 1.5; // Límite superior (≈120° desde arriba)

    // Opcional: restringir azimut para que no gire completamente alrededor
    // Por defecto, OrbitControls permite giro completo. Si quieres limitarlo, puedes usar:
    controls.minAzimuthAngle = -Math.PI / 2;  // -90°
    controls.maxAzimuthAngle = Math.PI / 2;   // 90°

    setIsReady(true);

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

  if (visualizerGroupRef.current) {
    // Rotación suave alrededor de un eje inclinado
    const axis = new THREE.Vector3(0.4, 0.7, 0.3).normalize(); // Cambia estos valores para ajustar la dirección
    const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, rotationSpeed);
    visualizerGroupRef.current.quaternion.premultiply(quaternion);
  }

  renderer.render(scene, camera);

};
    animate();

    const handleResize = () => {
      if (container && renderer) {
        const newWidth = container.clientWidth;
        const newHeight = Math.min(container.clientHeight, window.innerHeight * 0.7);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const startVisualization = () => {
    if (!globalAnalyser || !particlesRef.current || !basePositionsRef.current || !linesGroupRef.current || !connectionsRef.current) return;

    const particles = particlesRef.current;
    const dataArray = new Uint8Array(globalAnalyser.frequencyBinCount);
    const positionAttribute = particles.geometry.attributes.position;
    const positions = positionAttribute.array as Float32Array;
    const basePositions = basePositionsRef.current;

    const animateVisualization = () => {
      if (!globalAnalyser) return;

      globalAnalyser.getByteFrequencyData(dataArray);
      const smoothingFactor = 0.15;

      for (let i = 0; i < positions.length / 3; i++) {
        const idx = Math.floor(i * dataArray.length / (positions.length / 3)); // distribución uniforme

        const value = dataArray[i] / 255;
        // Movimiento pulsante base (idle) — onda suave
        const idlePulse = 0.03 * Math.sin(Date.now() * 0.002 + i); // i introduce un desfase único para cada punto

        // Movimiento por audio + idle
        const displacement = 1 + value * 0.5 + idlePulse;


        const baseX = basePositions[idx * 3];
        const baseY = basePositions[idx * 3 + 1];
        const baseZ = basePositions[idx * 3 + 2];

        positions[idx * 3] = positions[idx * 3] * (1 - smoothingFactor) + baseX * displacement * smoothingFactor;
        positions[idx * 3 + 1] = positions[idx * 3 + 1] * (1 - smoothingFactor) + baseY * displacement * smoothingFactor;
        positions[idx * 3 + 2] = positions[idx * 3 + 2] * (1 - smoothingFactor) + baseZ * displacement * smoothingFactor;
      }

      positionAttribute.needsUpdate = true;

      for (const [i, j, line] of connectionsRef.current) {
        const start = new THREE.Vector3(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        );
        const end = new THREE.Vector3(
          positions[j * 3],
          positions[j * 3 + 1],
          positions[j * 3 + 2]
        );
        const control = new THREE.Vector3(
          (start.x + end.x) / 2,
          (start.y + end.y) / 2,
          (start.z + end.z) / 2
        );

        const curve = new THREE.QuadraticBezierCurve3(start, control, end);
        const curvePoints = curve.getPoints(5);
        line.geometry.setFromPoints(curvePoints);
        line.geometry.attributes.position.needsUpdate = true;
      }

      animationFrameId.current = requestAnimationFrame(animateVisualization);
    };

    animateVisualization();
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !audioElement.src) return;

    const setupAudio = () => {
      try {
        if (!globalAudioContext) {
          globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (!globalAnalyser) {
          globalAnalyser = globalAudioContext.createAnalyser();
          globalAnalyser.fftSize = 2048;
          globalAnalyser.smoothingTimeConstant = 0.8;
        }
        if (!globalSource || globalSource.mediaElement !== audioElement) {
          if (globalSource) {
            globalSource.disconnect();
          }
          globalSource = globalAudioContext.createMediaElementSource(audioElement);
          globalSource.connect(globalAnalyser);
          globalAnalyser.connect(globalAudioContext.destination);
        }
      } catch (err) {
        console.error('Error al crear contexto de audio:', err);
        setError('Error de audio: ' + (err instanceof Error ? err.message : 'Desconocido'));
        return;
      }
    };

    const handlePlay = () => {
      if (globalAudioContext?.state === 'suspended') {
        globalAudioContext.resume().then(() => {
          setupAudio();
          startVisualization();
        }).catch(err => {
          setError('Error al reanudar audio: ' + err.message);
        });
      } else {
        setupAudio();
        startVisualization();
      }
    };

    audioElement.addEventListener('play', handlePlay);

    if (!audioElement.paused && audioElement.readyState >= 2) {
      setupAudio();
      startVisualization();
    }

    return () => {
      audioElement.removeEventListener('play', handlePlay);
    };
  }, [audioRef]);

  return (
    <div className="relative w-full flex justify-center items-center" style={{ height: '70vh' }}>
      <div ref={mountRef} className="w-full h-full" />

      {!isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-blue-300 p-4 text-xl animate-pulse">
            <div className="w-12 h-12 border-t-2 border-blue-300 border-solid rounded-full animate-spin mx-auto mb-3"></div>
            Cargando visualizador 3D...
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-red-400 p-4 bg-gray-900 rounded-lg max-w-md text-center">
            <div className="text-2xl mb-2">🔊 Error de audio</div>
            <div>{error}</div>
            <button className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700" onClick={() => setError(null)}>
              Reintentar
            </button>
          </div>
        </div>
      )}

    
    </div>
  );
};

export default AudioVisualizer3D;
