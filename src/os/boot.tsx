import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS, SKILLS, ME } from "./data";
import { useSystem } from "./system";

/* ═════════════════════════════════════════════
   BOOT
   A kernel log that types itself out, then hands
   over to the lock screen. Click anywhere to skip.
═════════════════════════════════════════════ */

type Line = { text: string; ok?: boolean; delay: number };

const LINES: Line[] = [
  { text: "AbhistOS 1.0.0 (web3-sh) — booting", delay: 90 },
  { text: `cpu: ${ME.location.toLowerCase()} · 1 core · caffeinated`, delay: 70 },
  { text: "mounting /dev/abhist", ok: true, delay: 130 },
  { text: "loading solidity.ko", ok: true, delay: 110 },
  { text: "loading rust.ko", ok: true, delay: 100 },
  { text: `indexing ${PROJECTS.length} repositories`, ok: true, delay: 150 },
  { text: `registering ${Object.values(SKILLS).flat().length} tools`, ok: true, delay: 110 },
  { text: "starting evm daemon", ok: true, delay: 120 },
  { text: "connecting to solana rpc", ok: true, delay: 130 },
  { text: "checking for blunders in chess.ko … module removed", delay: 140 },
  { text: "arming 10 mines", ok: true, delay: 110 },
  { text: "AbhistOS ready", ok: true, delay: 220 },
];

export function BootScreen() {
  const { setPhase } = useSystem();
  const [shown, setShown] = useState(0);
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    setPhase("lock");
  };

  useEffect(() => {
    if (shown >= LINES.length) {
      const t = setTimeout(finish, 420);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown(n => n + 1), LINES[shown].delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  /* any key or click skips straight to the lock screen */
  useEffect(() => {
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="boot"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}>
      <div className="boot-log">
        {LINES.slice(0, shown).map((l, i) => (
          <p className="boot-line" key={i}>
            {l.ok
              ? <span className="boot-ok">[&nbsp;ok&nbsp;]</span>
              : <span className="boot-dot">[&nbsp;··&nbsp;]</span>}
            {l.text}
          </p>
        ))}
        {shown < LINES.length && <span className="boot-caret" />}
      </div>
      <p className="boot-skip">Press any key to skip</p>
    </motion.div>
  );
}
