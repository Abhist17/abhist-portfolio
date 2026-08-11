import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BISHOP, KNIGHT, QUEEN, ROOK, SQUARE_NAME, UNICODE,
  bestMove, initialState, inCheck, kingSquare, legalMoves, makeMove, moveText, outcome,
  type Color, type Level, type Move, type State,
} from "./chess";

const FILES = "abcdefgh".split("");
const LEVELS: Level[] = ["easy", "medium", "hard"];

type Snap = { state: State; text: string };

export default function ChessApp() {
  const [history, setHistory] = useState<Snap[]>([{ state: initialState(), text: "" }]);
  const [sel, setSel] = useState<number | null>(null);
  const [level, setLevel] = useState<Level>("medium");
  const [side, setSide] = useState<Color>(1);
  const [thinking, setThinking] = useState(false);
  const [promo, setPromo] = useState<{ from: number; to: number } | null>(null);

  const cur = history[history.length - 1].state;
  const result = useMemo(() => outcome(cur), [cur]);
  const moves = useMemo(() => (result === "playing" ? legalMoves(cur) : []), [cur, result]);
  const myTurn = cur.turn === side;

  const targets = useMemo(() => {
    if (sel === null) return new Map<number, Move[]>();
    const m = new Map<number, Move[]>();
    for (const mv of moves) {
      if (mv.from !== sel) continue;
      const list = m.get(mv.to) ?? [];
      list.push(mv);
      m.set(mv.to, list);
    }
    return m;
  }, [sel, moves]);

  const apply = useCallback((m: Move) => {
    setHistory(h => {
      const s = h[h.length - 1].state;
      return [...h, { state: makeMove(s, m), text: moveText(s, m) }];
    });
    setSel(null);
  }, []);

  /* the engine replies once it is its turn */
  useEffect(() => {
    if (result !== "playing" || myTurn) return;
    setThinking(true);
    const id = setTimeout(() => {
      const m = bestMove(cur, level);
      if (m) apply(m);
      setThinking(false);
    }, 240);
    return () => { clearTimeout(id); setThinking(false); };
  }, [cur, myTurn, result, level, apply]);

  const onSquare = (i: number) => {
    if (!myTurn || result !== "playing" || thinking) return;

    const hits = targets.get(i);
    if (hits && hits.length) {
      if (hits.length > 1 && hits[0].promo) setPromo({ from: hits[0].from, to: i });
      else apply(hits[0]);
      return;
    }
    const p = cur.board[i];
    if (p !== 0 && (p > 0 ? 1 : -1) === cur.turn) setSel(i);
    else setSel(null);
  };

  const newGame = (as: Color = side) => {
    setHistory([{ state: initialState(), text: "" }]);
    setSel(null); setPromo(null); setSide(as);
  };

  const undo = () => {
    /* step back over the engine's reply as well, so it stays your move */
    setHistory(h => (h.length <= 1 ? h : h.slice(0, Math.max(1, h.length - (h.length > 2 ? 2 : 1)))));
    setSel(null);
  };

  const checkedKing = result !== "checkmate" && inCheck(cur) ? kingSquare(cur.board, cur.turn) : -1;
  const mateKing = result === "checkmate" ? kingSquare(cur.board, cur.turn) : -1;
  const lastMove = history.length > 1 ? history[history.length - 1] : null;

  const status = (() => {
    if (result === "checkmate") return cur.turn === side ? "Checkmate — engine wins" : "Checkmate — you win";
    if (result === "stalemate") return "Stalemate — draw";
    if (result === "draw")      return "Draw";
    if (thinking)               return "Engine thinking…";
    if (inCheck(cur))           return myTurn ? "You are in check" : "Engine is in check";
    return myTurn ? "Your move" : "Engine to move";
  })();

  /* white at the bottom when you play white, flipped when you play black */
  const order = useMemo(() => {
    const a = Array.from({ length: 64 }, (_, i) => i);
    return side === 1 ? a : a.slice().reverse();
  }, [side]);

  const pairs = useMemo(() => {
    const out: { no: number; w?: string; b?: string }[] = [];
    history.slice(1).forEach((h, i) => {
      const no = Math.floor(i / 2) + 1;
      if (i % 2 === 0) out.push({ no, w: h.text });
      else out[out.length - 1].b = h.text;
    });
    return out;
  }, [history]);

  return (
    <div className="chess">
      <div className="chess-main">
        <div className="board" role="grid" aria-label="Chess board">
          {order.map(i => {
            const p = cur.board[i];
            const dark = ((i >> 3) + (i & 7)) % 2 === 1;
            const isTarget = targets.has(i);
            return (
              <button
                key={i}
                className={
                  "sq" +
                  (dark ? " dark" : " light") +
                  (sel === i ? " sel" : "") +
                  (isTarget ? (p ? " capture" : " move") : "") +
                  (i === checkedKing ? " check" : "") +
                  (i === mateKing ? " mate" : "")
                }
                onClick={() => onSquare(i)}
                aria-label={SQUARE_NAME(i)}>
                {p !== 0 && (
                  <span className={"pc " + (p > 0 ? "w" : "b")}>{UNICODE[Math.abs(p)]}</span>
                )}
                {(i & 7) === (side === 1 ? 0 : 7) && <span className="coord rk">{8 - (i >> 3)}</span>}
                {(i >> 3) === (side === 1 ? 7 : 0) && <span className="coord fl">{FILES[i & 7]}</span>}
              </button>
            );
          })}

          {promo && (
            <div className="promo">
              <p>Promote to</p>
              <div className="promo-row">
                {[QUEEN, ROOK, BISHOP, KNIGHT].map(q => (
                  <button key={q} onClick={() => {
                    const m = moves.find(x => x.from === promo.from && x.to === promo.to && x.promo === q);
                    if (m) apply(m);
                    setPromo(null);
                  }}>
                    <span className={"pc " + (cur.turn === 1 ? "w" : "b")}>{UNICODE[q]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <aside className="chess-side">
        <p className={`chess-status ${result !== "playing" ? "over" : ""}`}>{status}</p>

        <div className="chess-field">
          <span className="kicker">Difficulty</span>
          <div className="seg">
            {LEVELS.map(l => (
              <button key={l} className={level === l ? "on" : ""} onClick={() => setLevel(l)}>{l}</button>
            ))}
          </div>
        </div>

        <div className="chess-field">
          <span className="kicker">Play as</span>
          <div className="seg">
            <button className={side === 1 ? "on" : ""} onClick={() => newGame(1)}>White</button>
            <button className={side === -1 ? "on" : ""} onClick={() => newGame(-1)}>Black</button>
          </div>
        </div>

        <div className="chess-moves">
          <span className="kicker">Moves</span>
          <ol>
            {pairs.map(p => (
              <li key={p.no}><span className="mv-no">{p.no}.</span><span>{p.w}</span><span>{p.b ?? ""}</span></li>
            ))}
            {!pairs.length && <li className="mv-empty">No moves yet</li>}
          </ol>
        </div>

        <div className="chess-actions">
          <button className="btn" onClick={() => newGame()}>New game</button>
          <button className="btn ghost" onClick={undo} disabled={history.length <= 1}>Undo</button>
        </div>

        {lastMove?.text && <p className="hint">Last: {lastMove.text}</p>}
      </aside>
    </div>
  );
}
