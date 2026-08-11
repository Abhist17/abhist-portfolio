/* ═════════════════════════════════════════════
   CHESS
   Board is a 64-length array, index 0 = a8,
   index 63 = h1. White is positive, black is
   negative. Full legal move generation, so the
   rules are the real ones: castling, en passant,
   promotion, check, checkmate and stalemate.
═════════════════════════════════════════════ */

export const EMPTY = 0;
export const PAWN = 1, KNIGHT = 2, BISHOP = 3, ROOK = 4, QUEEN = 5, KING = 6;

export type Color = 1 | -1;   // 1 = white, -1 = black
export type Piece = number;   // signed: +PAWN is a white pawn

export type Move = {
  from: number;
  to: number;
  piece: Piece;
  captured: Piece;      // 0 when the move is quiet
  promo: number;        // 0, or KNIGHT..QUEEN
  isEp: boolean;
  isCastle: boolean;
};

export type Castling = { wk: boolean; wq: boolean; bk: boolean; bq: boolean };

export type State = {
  board: Int8Array;
  turn: Color;
  castling: Castling;
  ep: number;           // en-passant target square, or -1
  half: number;         // halfmove clock
  full: number;
};

/* ── helpers ──────────────────────────────── */
const rank = (i: number) => i >> 3;         // 0 = rank 8
const file = (i: number) => i & 7;          // 0 = file a
const onBoard = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
const idx = (r: number, c: number) => r * 8 + c;
const colorOf = (p: Piece): Color => (p > 0 ? 1 : -1);
const typeOf = (p: Piece) => Math.abs(p);

export const SQUARE_NAME = (i: number) =>
  "abcdefgh"[file(i)] + (8 - rank(i));

const PIECE_FROM_CHAR: Record<string, number> = {
  p: PAWN, n: KNIGHT, b: BISHOP, r: ROOK, q: QUEEN, k: KING,
};

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function parseFen(fen: string): State {
  const [placement, turn, castle, ep, half, full] = fen.trim().split(/\s+/);
  const board = new Int8Array(64);
  let i = 0;
  for (const ch of placement) {
    if (ch === "/") continue;
    if (ch >= "1" && ch <= "8") { i += Number(ch); continue; }
    const t = PIECE_FROM_CHAR[ch.toLowerCase()];
    board[i++] = ch === ch.toUpperCase() ? t : -t;
  }
  return {
    board,
    turn: turn === "w" ? 1 : -1,
    castling: {
      wk: castle.includes("K"), wq: castle.includes("Q"),
      bk: castle.includes("k"), bq: castle.includes("q"),
    },
    ep: ep && ep !== "-" ? idx(8 - Number(ep[1]), "abcdefgh".indexOf(ep[0])) : -1,
    half: Number(half ?? 0),
    full: Number(full ?? 1),
  };
}

export const initialState = () => parseFen(START_FEN);

export function cloneState(s: State): State {
  return {
    board: Int8Array.from(s.board),
    turn: s.turn,
    castling: { ...s.castling },
    ep: s.ep,
    half: s.half,
    full: s.full,
  };
}

/* ── attack detection ─────────────────────── */
const KNIGHT_D = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
const KING_D   = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
const BISHOP_D = [[-1,-1],[-1,1],[1,-1],[1,1]];
const ROOK_D   = [[-1,0],[1,0],[0,-1],[0,1]];

/** Is `sq` attacked by any piece of colour `by`? */
export function isAttacked(board: Int8Array, sq: number, by: Color): boolean {
  const r = rank(sq), c = file(sq);

  // pawns: a white pawn sits one rank *below* (higher r) the square it attacks
  const pr = r + by;
  for (const dc of [-1, 1]) {
    if (onBoard(pr, c + dc) && board[idx(pr, c + dc)] === by * PAWN) return true;
  }

  for (const [dr, dc] of KNIGHT_D) {
    if (onBoard(r + dr, c + dc) && board[idx(r + dr, c + dc)] === by * KNIGHT) return true;
  }

  for (const [dr, dc] of KING_D) {
    if (onBoard(r + dr, c + dc) && board[idx(r + dr, c + dc)] === by * KING) return true;
  }

  const slide = (dirs: number[][], a: number, b: number) => {
    for (const [dr, dc] of dirs) {
      let rr = r + dr, cc = c + dc;
      while (onBoard(rr, cc)) {
        const p = board[idx(rr, cc)];
        if (p !== EMPTY) {
          if (colorOf(p) === by && (typeOf(p) === a || typeOf(p) === b)) return true;
          break;
        }
        rr += dr; cc += dc;
      }
    }
    return false;
  };

  return slide(BISHOP_D, BISHOP, QUEEN) || slide(ROOK_D, ROOK, QUEEN);
}

export function kingSquare(board: Int8Array, color: Color): number {
  for (let i = 0; i < 64; i++) if (board[i] === color * KING) return i;
  return -1;
}

export function inCheck(s: State, color: Color = s.turn): boolean {
  const k = kingSquare(s.board, color);
  return k >= 0 && isAttacked(s.board, k, (-color) as Color);
}

/* ── move generation ──────────────────────── */
function push(list: Move[], from: number, to: number, piece: Piece, captured: Piece,
              promo = 0, isEp = false, isCastle = false) {
  list.push({ from, to, piece, captured, promo, isEp, isCastle });
}

/** Pseudo-legal moves — may leave the own king in check. */
export function pseudoMoves(s: State): Move[] {
  const out: Move[] = [];
  const { board, turn } = s;

  for (let from = 0; from < 64; from++) {
    const p = board[from];
    if (p === EMPTY || colorOf(p) !== turn) continue;
    const r = rank(from), c = file(from), t = typeOf(p);

    if (t === PAWN) {
      const dir = -turn;                       // white (1) moves toward rank 8 → r decreases
      const startRank = turn === 1 ? 6 : 1;
      const promoRank = turn === 1 ? 0 : 7;

      const one = idx(r + dir, c);
      if (onBoard(r + dir, c) && board[one] === EMPTY) {
        if (r + dir === promoRank) {
          for (const q of [QUEEN, ROOK, BISHOP, KNIGHT]) push(out, from, one, p, 0, q);
        } else {
          push(out, from, one, p, 0);
          const two = idx(r + 2 * dir, c);
          if (r === startRank && board[two] === EMPTY) push(out, from, two, p, 0);
        }
      }

      for (const dc of [-1, 1]) {
        const rr = r + dir, cc = c + dc;
        if (!onBoard(rr, cc)) continue;
        const to = idx(rr, cc);
        const target = board[to];
        if (target !== EMPTY && colorOf(target) !== turn) {
          if (rr === promoRank) {
            for (const q of [QUEEN, ROOK, BISHOP, KNIGHT]) push(out, from, to, p, target, q);
          } else push(out, from, to, p, target);
        } else if (to === s.ep && target === EMPTY) {
          push(out, from, to, p, (-turn * PAWN) as Piece, 0, true);
        }
      }
      continue;
    }

    if (t === KNIGHT || t === KING) {
      const dirs = t === KNIGHT ? KNIGHT_D : KING_D;
      for (const [dr, dc] of dirs) {
        const rr = r + dr, cc = c + dc;
        if (!onBoard(rr, cc)) continue;
        const to = idx(rr, cc);
        const target = board[to];
        if (target !== EMPTY && colorOf(target) === turn) continue;
        push(out, from, to, p, target);
      }
    } else {
      const dirs = t === BISHOP ? BISHOP_D : t === ROOK ? ROOK_D : [...BISHOP_D, ...ROOK_D];
      for (const [dr, dc] of dirs) {
        let rr = r + dr, cc = c + dc;
        while (onBoard(rr, cc)) {
          const to = idx(rr, cc);
          const target = board[to];
          if (target === EMPTY) push(out, from, to, p, 0);
          else {
            if (colorOf(target) !== turn) push(out, from, to, p, target);
            break;
          }
          rr += dr; cc += dc;
        }
      }
    }
  }

  /* castling — squares empty, king not in or through check */
  const home = turn === 1 ? 60 : 4;
  if (board[home] === turn * KING) {
    const opp = (-turn) as Color;
    const canK = turn === 1 ? s.castling.wk : s.castling.bk;
    const canQ = turn === 1 ? s.castling.wq : s.castling.bq;
    const rookK = home + 3, rookQ = home - 4;

    if (canK && board[rookK] === turn * ROOK &&
        board[home + 1] === EMPTY && board[home + 2] === EMPTY &&
        !isAttacked(board, home, opp) && !isAttacked(board, home + 1, opp) && !isAttacked(board, home + 2, opp)) {
      push(out, home, home + 2, board[home], 0, 0, false, true);
    }
    if (canQ && board[rookQ] === turn * ROOK &&
        board[home - 1] === EMPTY && board[home - 2] === EMPTY && board[home - 3] === EMPTY &&
        !isAttacked(board, home, opp) && !isAttacked(board, home - 1, opp) && !isAttacked(board, home - 2, opp)) {
      push(out, home, home - 2, board[home], 0, 0, false, true);
    }
  }

  return out;
}

export function makeMove(s: State, m: Move): State {
  const n = cloneState(s);
  const b = n.board;
  const turn = s.turn;

  b[m.from] = EMPTY;
  b[m.to] = m.promo ? (turn * m.promo) as Piece : m.piece;

  if (m.isEp) b[idx(rank(m.from), file(m.to))] = EMPTY;

  if (m.isCastle) {
    const home = turn === 1 ? 60 : 4;
    if (m.to === home + 2) { b[home + 1] = b[home + 3]; b[home + 3] = EMPTY; }
    else                   { b[home - 1] = b[home - 4]; b[home - 4] = EMPTY; }
  }

  /* castling rights die when the king or a rook leaves, or a rook is taken */
  if (typeOf(m.piece) === KING) {
    if (turn === 1) { n.castling.wk = n.castling.wq = false; }
    else            { n.castling.bk = n.castling.bq = false; }
  }
  const touch = (sq: number) => {
    if (sq === 63) n.castling.wk = false;
    if (sq === 56) n.castling.wq = false;
    if (sq === 7)  n.castling.bk = false;
    if (sq === 0)  n.castling.bq = false;
  };
  touch(m.from); touch(m.to);

  n.ep = -1;
  if (typeOf(m.piece) === PAWN && Math.abs(rank(m.to) - rank(m.from)) === 2) {
    n.ep = idx((rank(m.from) + rank(m.to)) / 2, file(m.from));
  }

  n.half = (typeOf(m.piece) === PAWN || m.captured !== EMPTY) ? 0 : s.half + 1;
  if (turn === -1) n.full = s.full + 1;
  n.turn = (-turn) as Color;
  return n;
}

/** Fully legal moves. */
export function legalMoves(s: State): Move[] {
  const me = s.turn;
  return pseudoMoves(s).filter(m => {
    const n = makeMove(s, m);
    return !inCheck(n, me);
  });
}

export type Outcome = "playing" | "checkmate" | "stalemate" | "draw";

export function outcome(s: State): Outcome {
  if (legalMoves(s).length === 0) return inCheck(s) ? "checkmate" : "stalemate";
  if (s.half >= 100) return "draw";
  if (insufficientMaterial(s.board)) return "draw";
  return "playing";
}

function insufficientMaterial(b: Int8Array): boolean {
  const pieces: number[] = [];
  for (let i = 0; i < 64; i++) if (b[i] !== EMPTY && typeOf(b[i]) !== KING) pieces.push(typeOf(b[i]));
  if (pieces.length === 0) return true;
  if (pieces.length === 1 && (pieces[0] === BISHOP || pieces[0] === KNIGHT)) return true;
  return false;
}

/* ── evaluation ───────────────────────────── */
const VALUE: Record<number, number> = {
  [PAWN]: 100, [KNIGHT]: 320, [BISHOP]: 330, [ROOK]: 500, [QUEEN]: 900, [KING]: 20000,
};

/* piece-square tables, written from white's point of view (index 0 = a8) */
const PST: Record<number, number[]> = {
  [PAWN]: [
      0,  0,  0,  0,  0,  0,  0,  0,
     50, 50, 50, 50, 50, 50, 50, 50,
     10, 10, 20, 30, 30, 20, 10, 10,
      5,  5, 10, 25, 25, 10,  5,  5,
      0,  0,  0, 20, 20,  0,  0,  0,
      5, -5,-10,  0,  0,-10, -5,  5,
      5, 10, 10,-20,-20, 10, 10,  5,
      0,  0,  0,  0,  0,  0,  0,  0],
  [KNIGHT]: [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50],
  [BISHOP]: [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20],
  [ROOK]: [
      0,  0,  0,  0,  0,  0,  0,  0,
      5, 10, 10, 10, 10, 10, 10,  5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
      0,  0,  0,  5,  5,  0,  0,  0],
  [QUEEN]: [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
     -5,  0,  5,  5,  5,  5,  0, -5,
      0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20],
  [KING]: [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
     20, 20,  0,  0,  0,  0, 20, 20,
     20, 30, 10,  0,  0, 10, 30, 20],
};

/** Score from the side-to-move's point of view. */
export function evaluate(s: State): number {
  let score = 0;
  for (let i = 0; i < 64; i++) {
    const p = s.board[i];
    if (p === EMPTY) continue;
    const t = typeOf(p), c = colorOf(p);
    /* the tables are written for white, so black reads the mirrored rank */
    const sq = c === 1 ? i : idx(7 - rank(i), file(i));
    score += c * (VALUE[t] + PST[t][sq]);
  }
  return score * s.turn;
}

/* ── search ───────────────────────────────── */
const MATE = 100000;

function orderMoves(moves: Move[]): Move[] {
  /* most-valuable-victim first so alpha-beta prunes early */
  return moves.slice().sort((a, b) => {
    const sa = a.captured ? VALUE[typeOf(a.captured)] - VALUE[typeOf(a.piece)] / 10 : -1;
    const sb = b.captured ? VALUE[typeOf(b.captured)] - VALUE[typeOf(b.piece)] / 10 : -1;
    return (sb + (b.promo ? 800 : 0)) - (sa + (a.promo ? 800 : 0));
  });
}

function negamax(s: State, depth: number, alpha: number, beta: number, ply: number): number {
  const moves = legalMoves(s);

  if (moves.length === 0) return inCheck(s) ? -MATE + ply : 0;
  if (depth === 0) return evaluate(s);

  let best = -Infinity;
  for (const m of orderMoves(moves)) {
    const score = -negamax(makeMove(s, m), depth - 1, -beta, -alpha, ply + 1);
    if (score > best) best = score;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

export type Level = "easy" | "medium" | "hard";
const DEPTH: Record<Level, number> = { easy: 1, medium: 2, hard: 3 };

/** Pick a move for the side to move. */
export function bestMove(s: State, level: Level = "medium"): Move | null {
  const moves = legalMoves(s);
  if (!moves.length) return null;

  /* easy plays reasonably but blunders sometimes, so it stays beatable */
  if (level === "easy" && Math.random() < 0.35) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  const depth = DEPTH[level];
  let best = -Infinity;
  let picks: Move[] = [];

  for (const m of orderMoves(moves)) {
    const score = -negamax(makeMove(s, m), depth - 1, -Infinity, Infinity, 1);
    if (score > best) { best = score; picks = [m]; }
    else if (score === best) picks.push(m);
  }
  return picks[Math.floor(Math.random() * picks.length)];
}

/* ── notation ─────────────────────────────── */
const GLYPH_LETTER: Record<number, string> = {
  [PAWN]: "", [KNIGHT]: "N", [BISHOP]: "B", [ROOK]: "R", [QUEEN]: "Q", [KING]: "K",
};

export function moveText(s: State, m: Move): string {
  if (m.isCastle) return m.to > m.from ? "O-O" : "O-O-O";
  const letter = GLYPH_LETTER[typeOf(m.piece)];
  const takes = m.captured ? "x" : "";
  const from = typeOf(m.piece) === PAWN && m.captured ? "abcdefgh"[file(m.from)] : "";
  const promo = m.promo ? "=" + GLYPH_LETTER[m.promo] : "";
  const after = makeMove(s, m);
  const suffix = legalMoves(after).length === 0
    ? (inCheck(after) ? "#" : "")
    : (inCheck(after) ? "+" : "");
  return `${letter}${from}${takes}${SQUARE_NAME(m.to)}${promo}${suffix}`;
}

/* ── perft, for verifying move generation ─── */
export function perft(s: State, depth: number): number {
  if (depth === 0) return 1;
  const moves = legalMoves(s);
  if (depth === 1) return moves.length;
  let n = 0;
  for (const m of moves) n += perft(makeMove(s, m), depth - 1);
  return n;
}

/* ── display ──────────────────────────────── */
export const UNICODE: Record<number, string> = {
  [PAWN]: "♟", [KNIGHT]: "♞", [BISHOP]: "♝", [ROOK]: "♜", [QUEEN]: "♛", [KING]: "♚",
};
