import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LinkPreviewProps {
  href: string;
  children: React.ReactNode;
  previewImage: string;
  isSmall?: boolean;  // ADD THIS
}

const LinkPreview = ({ href, children, previewImage, isSmall = false }: LinkPreviewProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[100] pointer-events-none ${isSmall ? 'w-[150px]' : 'w-[320px]'}`}
          >
            <div className="bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
              <img 
                src={previewImage} 
                alt="Profile preview" 
                className={`w-full object-cover ${isSmall ? 'h-[90px]' : 'h-auto max-h-[350px]'}`}
              />
            </div>

           
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LinkPreview;