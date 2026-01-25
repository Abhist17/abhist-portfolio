import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Lo-fi music URL (you can change this to any URL you want)
  const musicUrl = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"; // Free lo-fi track

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
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
        className="fixed bottom-6 left-6 z-50 flex items-center gap-3 p-3 rounded-full bg-card/80 backdrop-blur-md border border-border/50 shadow-lg"
      >
        {/* Play/Pause Button */}
        <motion.button
          onClick={togglePlay}
          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Pause className="w-5 h-5 text-primary" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Play className="w-5 h-5 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Mute Button */}
        <motion.button
          onClick={toggleMute}
          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-primary" />
          ) : (
            <Volume2 className="w-5 h-5 text-primary" />
          )}
        </motion.button>

        {/* Volume Slider */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-20 h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
        />

        {/* Label */}
        <span className="text-sm text-muted-foreground font-medium hidden sm:block">
          Lo-fi Beats
        </span>
      </motion.div>
    </>
  );
};

export default MusicPlayer;