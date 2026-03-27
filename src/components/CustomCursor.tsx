import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
}

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleId, setParticleId] = useState(0);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Create flame particles as mouse moves
      setParticleId((prev) => prev + 1);
      setParticles((prev) => [
        ...prev,
        {
          id: particleId,
          x: e.clientX,
          y: e.clientY,
        },
      ]);

      // Remove old particles (keep only last 8)
      setTimeout(() => {
        setParticles((prev) => prev.slice(-8));
      }, 100);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [particleId]);

  return (
    <>
      {/* Flame Trail Particles */}
      <AnimatePresence>
        {particles.map((particle, index) => (
          <motion.div
            key={particle.id}
            className="fixed pointer-events-none z-[9996]"
            initial={{
              x: particle.x - 8,
              y: particle.y - 8,
              scale: 1,
              opacity: 0.8,
            }}
            animate={{
              x: particle.x - 8 + (Math.random() - 0.5) * 20,
              y: particle.y - 8 + Math.random() * 30,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            style={{
              width: "16px",
              height: "16px",
              background:
                index % 3 === 0
                  ? "radial-gradient(circle, #ff6b00 0%, #ff0000 50%, transparent 70%)"
                  : index % 3 === 1
                  ? "radial-gradient(circle, #ffaa00 0%, #ff6b00 50%, transparent 70%)"
                  : "radial-gradient(circle, #ffdd00 0%, #ffaa00 50%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(2px)",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Rocket Emoji Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] select-none"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.3 : 1,
          rotate: isHovering ? 15 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          mass: 0.5,
        }}
        style={{
          fontSize: "32px",
          filter: isHovering ? "drop-shadow(0 0 8px rgba(255, 107, 0, 0.8))" : "none",
        }}
      >
        🚀
      </motion.div>

      {/* Glow effect on hover */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9997]"
        style={{
          width: "48px",
          height: "48px",
          background: "radial-gradient(circle, rgba(255, 107, 0, 0.4) 0%, transparent 70%)",
        }}
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 1.5 : 0.8,
          opacity: isHovering ? 0.6 : 0.2,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          mass: 0.8,
        }}
      />
    </>
  );
};

export default CustomCursor;