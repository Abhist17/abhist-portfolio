import { useCallback, useEffect, useRef, useState } from "react";
import {
  GOAL_RANK, LADDER, SIZE, keepPlaying, move, newGame, valueOf,
  type Dir, type Game,
} from "./merge";

const BEST_KEY = "abhistos.merge.best";

/* Rank colours climb from paper to Solana purple, so the board tells you how
   deep you are at a glance. */
const SKIN: Record<number, { bg: string; ink: string }> = {
  1:  { bg: "#eee9df", ink: "#6b6355" },
  2:  { bg: "#e4dcc9", ink: "#6b6355" },
  3:  { bg: "#f0b98a", ink: "#fff" },
  4:  { bg: "#ec9463", ink: "#fff" },
  5:  { bg: "#e5744f", ink: "#fff" },
  6:  { bg: "#d8553c", ink: "#fff" },
  7:  { bg: "#5b6ee0", ink: "#fff" },
  8:  { bg: "#7d4fd8", ink: "#fff" },
  9:  { bg: "#f0a020", ink: "#fff" },
  10: { bg: "#1f9e78", ink: "#fff" },
  11: { bg: "#111116", ink: "#41e0b3" },
  12: { bg: "#000", ink: "#41e0b3" },
};

const KEYS: Record<string, Dir> = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  w: "up", s: "down", a: "left", d: "right",
  W: "up", S: "down", A: "left", D: "right",
};

export default function MergeApp() {
  const [game, setGame] = useState<Game>(() => newGame());
  const boardRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  /* best score outlives the tab */
  useEffect(() => {
    const saved = Number(localStorage.getItem(BEST_KEY) ?? 0);
    if (saved > 0) setGame(g => ({ ...g, best: saved }));
  }, []);

  useEffect(() => {
    if (game.best > 0) {
      try { localStorage.setItem(BEST_KEY, String(game.best)); } catch { /* private mode */ }
    }
  }, [game.best]);

  const push = useCallback((dir: Dir) => setGame(g => move(g, dir)), []);

  /* Arrows would scroll the window, so the board eats them while it has focus
     — and it takes focus the moment you open the app. */
  useEffect(() => {
    const el = boardRef.current;
    el?.focus();
    const onKey = (e: KeyboardEvent) => {
      const dir = KEYS[e.key];
      if (!dir) return;
      e.preventDefault();
      push(dir);
    };
    el?.addEventListener("keydown", onKey);
    return () => el?.removeEventListener("keydown", onKey);
  }, [push]);

  /* swipe, for the phone */
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    if (!start) return;
    touch.current = null;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    push(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
  };

  const restart = () => setGame(g => newGame(g.best));
  const top = game.tiles.reduce((m, t) => Math.max(m, t.rank), 1);

  return (
    <div className="merge">
      <div className="merge-bar">
        <div className="merge-title">
          <strong>Merge</strong>
          <span>get to {LADDER[GOAL_RANK]} · {valueOf(GOAL_RANK)}</span>
        </div>
        <div className="merge-scores">
          <div className="merge-score">
            <span>score</span>
            <strong>{game.score.toLocaleString()}</strong>
          </div>
          <div className="merge-score">
            <span>best</span>
            <strong>{game.best.toLocaleString()}</strong>
          </div>
        </div>
        <button className="btn btn-ghost merge-new" onClick={restart}>New game</button>
      </div>

      <div className="merge-wrap">
        <div
          className="merge-board"
          ref={boardRef}
          tabIndex={0}
          role="application"
          aria-label="Merge board — arrow keys to play"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}>

          {/* the empty wells sit under everything and never move */}
          <div className="merge-cells">
            {Array.from({ length: SIZE * SIZE }, (_, i) => <span key={i} />)}
          </div>

          {game.tiles.map(t => {
            const skin = SKIN[Math.min(t.rank, 12)];
            const label = LADDER[Math.min(t.rank, LADDER.length - 1)];
            return (
              <div
                key={t.id}
                className={`merge-tile ${t.born ? "is-new" : ""} ${t.merged ? "is-merged" : ""} len-${label.length}`}
                style={{
                  background: skin.bg,
                  color: skin.ink,
                  /* one step = the tile's own width plus the 8px gap */
                  transform: `translate(calc(${t.c} * (100% + 8px)), calc(${t.r} * (100% + 8px)))`,
                }}>
                <span className="merge-name">{label}</span>
                <span className="merge-val">{valueOf(t.rank).toLocaleString()}</span>
              </div>
            );
          })}

          {game.status !== "playing" && (
            <div className="merge-over">
              <p className="merge-over-title">
                {game.status === "won" ? `${LADDER[GOAL_RANK]} reached` : "No moves left"}
              </p>
              <p className="merge-over-sub">
                {game.status === "won"
                  ? `${game.score.toLocaleString()} points in ${game.moves} moves.`
                  : `Finished on ${game.score.toLocaleString()}${game.score >= game.best ? " — a new best." : "."}`}
              </p>
              <div className="merge-over-acts">
                {game.status === "won" && (
                  <button className="btn" onClick={() => setGame(keepPlaying)}>Keep going</button>
                )}
                <button className={game.status === "won" ? "btn btn-ghost" : "btn"} onClick={restart}>
                  New game
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="merge-foot">
        <span>Arrow keys or WASD · swipe on touch</span>
        <span className="merge-deep">deepest: {LADDER[Math.min(top, LADDER.length - 1)]}</span>
      </p>
    </div>
  );
}
