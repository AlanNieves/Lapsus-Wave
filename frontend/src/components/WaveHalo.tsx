import { useEffect, useRef } from "react";
import * as THREE from "three";

interface WaveHaloProps {
  size?: number;
}

const WaveHalo: React.FC<WaveHaloProps> = ({ size = 120 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(size, size);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.RingGeometry(0.9, 1, 128);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        u_time: { value: 0 },
        u_color: { value: new THREE.Color(0xe85d9e) },
      },
      vertexShader: `
        uniform float u_time;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          float theta = position.x * 10.0 + u_time * 2.0;
          float wave = sin(theta) * 0.02;
          vec3 newPosition = position + normal * wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 u_color;
        varying vec2 vUv;
        void main() {
          float alpha = 1.0 - length(vUv - 0.5) * 2.0;
          gl_FragColor = vec4(u_color, alpha);
        }
      `,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      material.uniforms.u_time.value += 0.02;
      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(requestRef.current!);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      style={{
        width: size,
        height: size,
        pointerEvents: "none",
      }}
    />
  );
};

export default WaveHalo;
