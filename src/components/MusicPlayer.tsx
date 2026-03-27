import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [open, setOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const musicUrl =
    "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio ref={audioRef} loop>
        <source src={musicUrl} type="audio/mpeg" />
      </audio>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(true)} // mobile support
        className="fixed bottom-6 left-6 z-50"
      >
        <motion.div
          animate={{ width: open ? 200 : 44 }}

          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex items-center justify-center gap-3 h-11 px-3 rounded-full bg-background/90 backdrop-blur border border-border shadow-sm overflow-hidden"

        >
          {/* Music icon (collapsed state) */}
          {!open && (
            <Music className="w-5 h-5 text-primary shrink-0" />
          )}

          {/* Expanded controls */}
          <AnimatePresence>
            {open && (
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Play / Pause */}
                <motion.button
                  onClick={togglePlay}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-primary/10 hover:bg-primary/20"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-primary" />
                  ) : (
                    <Play className="w-5 h-5 text-primary" />
                  )}
                </motion.button>

                {/* Mute */}
                <motion.button
                  onClick={toggleMute}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-primary/10 hover:bg-primary/20"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-primary" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-primary" />
                  )}
                </motion.button>

                {/* Volume */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-24 h-1 appearance-none cursor-pointer accent-primary"
                />

                {/* Label */}
                
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
};

export default MusicPlayer;
