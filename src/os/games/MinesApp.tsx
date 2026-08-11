import { useCallback, useEffect, useRef, useState } from "react";
import {
  LEVELS, chord, minesLeft, newGame, reveal, toggleFlag,
  type Game, type LevelId,
} from "./minesweeper";

const NUM_COLOR = [
  "", "#2f6fd0", "#2f8f4f", "#c4462f", "#5b3fa8",
  "#a8621f", "#2b8f96", "#3a3a3c", "#8a8a93",
];

const BEST_KEY = "abhistos.mines.best";

export default function MinesApp() {
  const [level, setLevel] = useState<LevelId>("beginner");
  const [game, setGame] = useState<Game>(() => newGame("beginner"));
  const [secs, setSecs] = useState(0);
  const [flagMode, setFlagMode] = useState(false);
  const [best, setBest] = useState<Record<string, number>>({});
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);

  useEffect(() => {
    try { setBest(JSON.parse(localStorage.getItem(BEST_KEY) ?? "{}")); } catch { /* fresh start */ }
  }, []);

  /* clock runs only while a game is actually in progress */
  useEffect(() => {
    if (game.status !== "playing") return;
    const id = setInterval(() => setSecs(s => Math.min(s + 1, 999)), 1000);
    return () => clearInterval(id);
  }, [game.status]);

  useEffect(() => {
    if (game.status !== "won") return;
    setBest(b => {
      const prev = b[level];
      if (prev !== undefined && prev <= secs) return b;
      const next = { ...b, [level]: secs };
      try { localStorage.setItem(BEST_KEY, JSON.stringify(next)); } catch { /* private mode */ }
      return next;
    });
  }, [game.status, level, secs]);

  const start = useCallback((l: LevelId) => {
    setLevel(l);
    setGame(newGame(l));
    setSecs(0);
  }, []);

  const onCell = (i: number) => {
    if (longPressed.current) { longPressed.current = false; return; }
    const c = game.cells[i];
    if (flagMode && !c.revealed) { setGame(g => toggleFlag(g, i)); return; }
    if (c.revealed) { setGame(g => chord(g, i)); return; }
    setGame(g => reveal(g, i));
  };

  const onContext = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    setGame(g => toggleFlag(g, i));
  };

  /* long-press flags on touch, where there is no right button */
  const onDown = (i: number) => {
    pressTimer.current = setTimeout(() => {
      longPressed.current = true;
      setGame(g => toggleFlag(g, i));
    }, 380);
  };
  const clearPress = () => {
    if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; }
  };

  const face = game.status === "lost" ? "✕" : game.status === "won" ? "★" : "◆";
  const bestSecs = best[level];

  return (
    <div className="mines">
      <div className="mines-bar">
        <div className="seg">
          {LEVELS.map(l => (
            <button key={l.id} className={level === l.id ? "on" : ""} onClick={() => start(l.id)}>
              {l.name}
            </button>
          ))}
        </div>
        <button
          className={`mines-flag ${flagMode ? "on" : ""}`}
          onClick={() => setFlagMode(f => !f)}
          aria-pressed={flagMode}
          title="Flag mode — or right-click / long-press a cell">
          <Flag /> Flag
        </button>
      </div>

      <div className="mines-hud">
        <span className="hud-num" aria-label="Mines remaining">
          <Mine /> {String(Math.max(0, minesLeft(game))).padStart(2, "0")}
        </span>
        <button className={`mines-face ${game.status}`} onClick={() => start(level)} aria-label="New game">
          {face}
        </button>
        <span className="hud-num" aria-label="Time">{String(secs).padStart(3, "0")}s</span>
      </div>

      <div className="mines-wrap">
        <div
          className={`grid ${game.status}`}
          style={{ gridTemplateColumns: `repeat(${game.w}, 1fr)`, ["--ar" as string]: `${game.w} / ${game.h}` }}
          onContextMenu={e => e.preventDefault()}>
          {game.cells.map((c, i) => {
            const shown = c.revealed;
            const cls =
              "ms" +
              (shown ? " open" : " closed") +
              (c.flagged ? " flag" : "") +
              (i === game.boom ? " boom" : "") +
              (shown && c.mine ? " bomb" : "");
            return (
              <button
                key={i}
                className={cls}
                onClick={() => onCell(i)}
                onContextMenu={e => onContext(e, i)}
                onPointerDown={() => onDown(i)}
                onPointerUp={clearPress}
                onPointerLeave={clearPress}
                style={shown && !c.mine && c.adj ? { color: NUM_COLOR[c.adj] } : undefined}
                aria-label={shown ? (c.mine ? "mine" : String(c.adj)) : c.flagged ? "flagged" : "hidden"}>
                {c.flagged && !shown ? <Flag /> : null}
                {shown && c.mine ? <Mine /> : null}
                {shown && !c.mine && c.adj > 0 ? c.adj : null}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mines-foot">
        {game.status === "won"  && <strong className="win">Cleared in {secs}s</strong>}
        {game.status === "lost" && <strong className="lose">Boom.</strong>}
        {game.status !== "won" && game.status !== "lost" && (
          <span>Left-click opens · right-click flags · click a number to chord</span>
        )}
        {bestSecs !== undefined && <span className="mines-best">Best {bestSecs}s</span>}
      </p>
    </div>
  );
}

function Mine() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M7.3 1h1.4v2.1H7.3zM2.4 3.4l1-1 1.5 1.5-1 1zm8.7.5L12.6 2.4l1 1-1.5 1.5z" />
      <circle cx="8" cy="9.5" r="4.6" />
      <path d="M1 8.8h2v1.4H1zm12 0h2v1.4h-2z" />
      <circle cx="6.4" cy="7.9" r="1.1" fill="#fff" opacity=".85" />
    </svg>
  );
}

function Flag() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 2v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4.9 2.6l7 2.4-7 2.4z" fill="#c4462f" />
    </svg>
  );
}
