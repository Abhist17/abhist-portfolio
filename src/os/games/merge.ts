/* ─────────────────────────────────────────────
   MERGE — 2048, denominated in crypto
   Pure board logic. No React, no DOM, so the
   rules stay testable and the app stays dumb.

   Tiles carry an id so the UI can animate a tile
   sliding across the board instead of redrawing
   sixteen squares.
───────────────────────────────────────────── */

export const SIZE = 4;

export type Tile = {
  id: number;
  /* 1 = wei, 2 = kwei … the exponent, not the value */
  rank: number;
  r: number; c: number;
  /* set for one frame so the UI can pop it */
  born?: boolean;
  merged?: boolean;
};

export type Game = {
  tiles: Tile[];
  score: number;
  best: number;
  status: "playing" | "won" | "over";
  /* you can keep playing past the goal; this stops the win banner nagging */
  goalSeen: boolean;
  moves: number;
};

/* the ladder. index = rank, so LADDER[1] is the tile you start with */
export const LADDER = [
  "", "wei", "kwei", "mwei", "gwei", "szabo", "finney",
  "ETH", "SOL", "BTC", "DAO", "ATH", "∞",
];

/** rank 11 ("ATH") is the 2048 tile — the one worth winning. */
export const GOAL_RANK = 11;

/** The number a rank is worth, for the score. rank 1 = 2, rank 2 = 4 … */
export const valueOf = (rank: number) => 2 ** rank;

let seq = 0;
const nextId = () => ++seq;

const emptyCells = (tiles: Tile[]) => {
  const taken = new Set(tiles.map(t => `${t.r},${t.c}`));
  const free: { r: number; c: number }[] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (!taken.has(`${r},${c}`)) free.push({ r, c });
  return free;
};

/** A new tile is a wei nine times out of ten, a kwei the tenth. */
function spawn(tiles: Tile[]): Tile[] {
  const free = emptyCells(tiles);
  if (!free.length) return tiles;
  const spot = free[Math.floor(Math.random() * free.length)];
  return [...tiles, { id: nextId(), rank: Math.random() < 0.9 ? 1 : 2, ...spot, born: true }];
}

export function newGame(best = 0): Game {
  const tiles = spawn(spawn([]));
  return { tiles, score: 0, best, status: "playing", goalSeen: false, moves: 0 };
}

export type Dir = "up" | "down" | "left" | "right";

/* Walk each line in the direction of travel. Every tile slides as far as it
   can; the first tile it meets of equal rank absorbs it. A tile that has
   already absorbed something this move is spent — that's the rule that stops
   4·4·4·4 collapsing to 16 in one swipe. */
function slideLine(line: Tile[]): { line: Tile[]; gained: number } {
  const out: Tile[] = [];
  let gained = 0;
  for (const tile of line) {
    const last = out[out.length - 1];
    if (last && last.rank === tile.rank && !last.merged) {
      last.rank += 1;
      last.merged = true;
      gained += valueOf(last.rank);
    } else {
      out.push({ ...tile, merged: false, born: false });
    }
  }
  return { line: out, gained };
}

/** Returns the same game object when nothing moved, so React can skip the render. */
export function move(game: Game, dir: Dir): Game {
  if (game.status === "over") return game;

  const vertical = dir === "up" || dir === "down";
  const backward = dir === "down" || dir === "right";

  const moved: Tile[] = [];
  let gained = 0;

  for (let i = 0; i < SIZE; i++) {
    /* the tiles in this row (or column), ordered front-to-back */
    const line = game.tiles
      .filter(t => (vertical ? t.c : t.r) === i)
      .sort((a, b) => {
        const av = vertical ? a.r : a.c;
        const bv = vertical ? b.r : b.c;
        return backward ? bv - av : av - bv;
      });

    const res = slideLine(line);
    gained += res.gained;

    res.line.forEach((t, idx) => {
      const pos = backward ? SIZE - 1 - idx : idx;
      moved.push(vertical ? { ...t, r: pos, c: i } : { ...t, r: i, c: pos });
    });
  }

  const changed =
    moved.length !== game.tiles.length ||
    moved.some(t => {
      const was = game.tiles.find(o => o.id === t.id)!;
      return was.r !== t.r || was.c !== t.c || was.rank !== t.rank;
    });

  if (!changed) return game;

  const tiles = spawn(moved);
  const score = game.score + gained;
  const reachedGoal = tiles.some(t => t.rank >= GOAL_RANK);

  return {
    tiles,
    score,
    best: Math.max(game.best, score),
    goalSeen: game.goalSeen || reachedGoal,
    moves: game.moves + 1,
    status: reachedGoal && !game.goalSeen ? "won" : stuck(tiles) ? "over" : "playing",
  };
}

/** No empty cells and no two neighbours alike — the board is dead. */
export function stuck(tiles: Tile[]): boolean {
  if (tiles.length < SIZE * SIZE) return false;
  const grid = new Map(tiles.map(t => [`${t.r},${t.c}`, t.rank]));
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const rank = grid.get(`${r},${c}`);
      if (rank === grid.get(`${r},${c + 1}`) || rank === grid.get(`${r + 1},${c}`)) return false;
    }
  }
  return true;
}

/** Dismiss the win banner and carry on playing. */
export const keepPlaying = (game: Game): Game => ({
  ...game,
  status: stuck(game.tiles) ? "over" : "playing",
});
