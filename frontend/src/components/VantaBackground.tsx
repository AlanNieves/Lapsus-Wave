import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const VantaBackground = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current && (window as any).VANTA?.HALO) {
      const effect = (window as any).VANTA.HALO({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        baseColor: 0xffffff,
        backgroundColor: 0x0d0d0d,
        size: 1.2,
      });
      setVantaEffect(effect);
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={vantaRef} className="absolute inset-0 -z-10" />;
};

export default VantaBackground;
