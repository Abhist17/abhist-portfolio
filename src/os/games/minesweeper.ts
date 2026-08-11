/* ═════════════════════════════════════════════
   MINESWEEPER
   Pure logic — the board is a flat array so the
   whole game state is trivially cloneable.
═════════════════════════════════════════════ */

export type Cell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adj: number;      // neighbouring mine count
};

export type Status = "idle" | "playing" | "won" | "lost";

export type Game = {
  w: number;
  h: number;
  mines: number;
  cells: Cell[];
  status: Status;
  /** index of the mine that ended it, for the "you hit this one" highlight */
  boom: number;
};

export type LevelId = "beginner" | "intermediate" | "expert";

export const LEVELS: { id: LevelId; name: string; w: number; h: number; mines: number }[] = [
  { id: "beginner",     name: "Beginner",     w: 9,  h: 9,  mines: 10 },
  { id: "intermediate", name: "Intermediate", w: 16, h: 16, mines: 40 },
  { id: "expert",       name: "Expert",       w: 22, h: 16, mines: 80 },
];

const emptyCell = (): Cell => ({ mine: false, revealed: false, flagged: false, adj: 0 });

export function newGame(level: LevelId): Game {
  const l = LEVELS.find(x => x.id === level)!;
  return {
    w: l.w, h: l.h, mines: l.mines,
    cells: Array.from({ length: l.w * l.h }, emptyCell),
    status: "idle",
    boom: -1,
  };
}

export function neighbours(g: Game, i: number): number[] {
  const x = i % g.w, y = Math.floor(i / g.w);
  const out: number[] = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || nx >= g.w || ny < 0 || ny >= g.h) continue;
      out.push(ny * g.w + nx);
    }
  }
  return out;
}

/** Mines are laid *after* the first click, so the first click is always safe
    — and never lands on a number, so every game opens with a real region. */
function layMines(g: Game, safe: number): Game {
  const forbidden = new Set<number>([safe, ...neighbours(g, safe)]);
  const spots: number[] = [];
  for (let i = 0; i < g.cells.length; i++) if (!forbidden.has(i)) spots.push(i);

  /* if the board is too dense to keep the whole opening pocket clear,
     fall back to protecting just the clicked cell */
  const pool = spots.length >= g.mines
    ? spots
    : Array.from({ length: g.cells.length }, (_, i) => i).filter(i => i !== safe);

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const cells = g.cells.map(c => ({ ...c }));
  for (const i of pool.slice(0, g.mines)) cells[i].mine = true;

  const next: Game = { ...g, cells };
  for (let i = 0; i < cells.length; i++) {
    cells[i].adj = cells[i].mine ? 0 : neighbours(next, i).filter(n => cells[n].mine).length;
  }
  return next;
}

/** Flood the empty region outward from `start`, stopping at numbers. */
function flood(g: Game, start: number): void {
  const stack = [start];
  while (stack.length) {
    const i = stack.pop()!;
    const c = g.cells[i];
    if (c.revealed || c.flagged) continue;
    c.revealed = true;
    if (c.adj === 0 && !c.mine) {
      for (const n of neighbours(g, i)) if (!g.cells[n].revealed) stack.push(n);
    }
  }
}

function checkWin(g: Game): Game {
  const cleared = g.cells.every(c => c.mine || c.revealed);
  if (!cleared) return g;
  return {
    ...g,
    status: "won",
    /* flag the remaining mines for the player, the way the original does */
    cells: g.cells.map(c => (c.mine ? { ...c, flagged: true } : c)),
  };
}

export function reveal(game: Game, i: number): Game {
  if (game.status === "won" || game.status === "lost") return game;

  let g: Game = game.status === "idle"
    ? { ...layMines(game, i), status: "playing" }
    : { ...game, cells: game.cells.map(c => ({ ...c })) };

  const cell = g.cells[i];
  if (cell.revealed || cell.flagged) return game;

  if (cell.mine) {
    cell.revealed = true;
    return {
      ...g,
      status: "lost",
      boom: i,
      cells: g.cells.map(c => (c.mine ? { ...c, revealed: true } : c)),
    };
  }

  flood(g, i);
  return checkWin(g);
}

export function toggleFlag(game: Game, i: number): Game {
  if (game.status === "won" || game.status === "lost") return game;
  const cells = game.cells.map(c => ({ ...c }));
  if (cells[i].revealed) return game;
  cells[i].flagged = !cells[i].flagged;
  return { ...game, cells };
}

/** Click a satisfied number to open its remaining neighbours. */
export function chord(game: Game, i: number): Game {
  if (game.status !== "playing") return game;
  const c = game.cells[i];
  if (!c.revealed || c.adj === 0) return game;

  const ns = neighbours(game, i);
  const flags = ns.filter(n => game.cells[n].flagged).length;
  if (flags !== c.adj) return game;

  let g = game;
  for (const n of ns) {
    if (!g.cells[n].flagged && !g.cells[n].revealed) {
      g = reveal(g, n);
      if (g.status === "lost") return g;
    }
  }
  return g;
}

export const flagsUsed = (g: Game) => g.cells.filter(c => c.flagged).length;
export const minesLeft = (g: Game) => g.mines - flagsUsed(g);
