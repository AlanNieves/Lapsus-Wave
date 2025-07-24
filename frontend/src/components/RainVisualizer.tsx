import { useEffect, useRef, useState } from 'react';
import { Leva, useControls } from 'leva';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

interface RainVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const RainVisualizer = ({ audioRef }: RainVisualizerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const rainRef = useRef<THREE.Points>();
  const animationIdRef = useRef<number>();

  const { rainCount, rainSpeed, rainSize } = useControls('Lluvia', {
    rainCount: { value: 1000, min: 100, max: 5000, step: 100 },
    rainSpeed: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
    rainSize: { value: 0.15, min: 0.01, max: 1, step: 0.01 },
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.set(0, 10, 20);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x88ccff, 1);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // Lluvia
    const rainGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    const velocities = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
      positions[i * 3] = Math.random() * 50 - 25;
      positions[i * 3 + 1] = Math.random() * 30;
      positions[i * 3 + 2] = Math.random() * 50 - 25;

      velocities[i] = Math.random() * 0.5 + 0.2;
    }

    rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    rainGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));

    const rainMaterial = new THREE.PointsMaterial({
      color: 0x87cefa,
      size: rainSize,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });

    const rain = new THREE.Points(rainGeometry, rainMaterial);
    rainRef.current = rain;
    scene.add(rain);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const positions = rain.geometry.attributes.position.array as Float32Array;
      const velocities = rain.geometry.attributes.velocity.array as Float32Array;

      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= velocities[i] * rainSpeed;
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 30;
        }
      }

      rain.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();
    setIsReady(true);

    const handleResize = () => {
      if (container && renderer && camera) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationIdRef.current!);
      renderer.dispose();
      container.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, [rainCount, rainSpeed, rainSize]);

  return (
    <div className="relative w-full h-full" ref={mountRef}>
      <Leva collapsed />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white">
          Cargando lluvia...
        </div>
      )}
    </div>
  );
};

export default RainVisualizer;
