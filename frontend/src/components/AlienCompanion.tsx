// AlienCompanion.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AlienCompanion = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 6000); // visible 6s
    }, Math.floor(Math.random() * 20000) + 10000); // aparece cada 10-30s aleatorio
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 1.0, type: "spring" }}
          className="fixed bottom-0 right-0 z-50 cursor-pointer"
          onMouseEnter={() => setVisible(false)}
        >
          <img
            src="/alien.png"
            alt="Alien Companion"
            className="w-28 h-28 select-none pointer-events-auto"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlienCompanion;
