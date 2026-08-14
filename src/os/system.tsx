import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import { WRITING, type ThemeId } from "./data";
import { CONFIG } from "./config";

/* ═════════════════════════════════════════════
   WINDOW MANAGER
   A tiny desktop OS: apps open into windows that
   stack, focus, drag, minimise and zoom.
═════════════════════════════════════════════ */

export type AppId =
  | "about" | "projects" | "background" | "stack" | "contact" | "terminal" | "photo" | "merge"
  | "resume" | "writing";

export type WinState = {
  id: AppId;
  x: number; y: number;
  w: number; h: number;
  z: number;
  minimised: boolean;
  zoomed: boolean;
  /* set for the moment between the close being asked for and the node going
     away; a closing window is not live for focus, persistence or shortcuts */
  closing?: boolean;
  /* geometry to restore when un-zooming */
  prev?: { x: number; y: number; w: number; h: number };
};

export type AppMeta = {
  id: AppId;
  name: string;
  /* what the icon looks like on the desktop */
  kind: "folder" | "folder-alt" | "doc" | "terminal" | "mail" | "grid" | "photo" | "merge" | "pdf"
      | "writing";
  w: number;
  h: number;
  /* desktop icon slot */
  slot: number;
  onDesktop: boolean;
  inDock: boolean;
};

/* Resume sits out of the list entirely when no file is configured, and Writing
   when there is nothing to read — an unset CONFIG.resume or an empty shelf
   costs a dead icon rather than a broken window. */
export const APPS: AppMeta[] = ([
  { id: "projects",   name: "Projects",   kind: "folder",   w: 760, h: 520, slot: 0, onDesktop: true,  inDock: true  },
  { id: "about",      name: "About Me",   kind: "doc",      w: 620, h: 480, slot: 1, onDesktop: true,  inDock: true  },
  { id: "writing",    name: "Writing",    kind: "writing",  w: 720, h: 560, slot: 2, onDesktop: true,  inDock: true  },
  { id: "resume",     name: "Resume",     kind: "pdf",      w: 720, h: 720, slot: 3, onDesktop: true,  inDock: true  },
  { id: "background", name: "Background", kind: "folder-alt", w: 720, h: 460, slot: 4, onDesktop: true,  inDock: true  },
  { id: "terminal",   name: "Terminal",   kind: "terminal", w: 680, h: 440, slot: 5, onDesktop: true,  inDock: true  },
  { id: "stack",      name: "Tech Stack", kind: "grid",     w: 660, h: 580, slot: 6, onDesktop: false, inDock: true  },
  { id: "contact",    name: "Contact",    kind: "mail",     w: 680, h: 620, slot: 7, onDesktop: true,  inDock: true  },
  { id: "merge",      name: "Merge",      kind: "merge",   w: 520, h: 660, slot: 8, onDesktop: true,  inDock: true  },
  { id: "photo",      name: "Photos",     kind: "photo",    w: 780, h: 580, slot: 9, onDesktop: true,  inDock: true  },
] as AppMeta[]).filter(a => {
  if (a.id === "resume")  return !!CONFIG.resume;
  /* either a feed to pull from or something already written down is enough */
  if (a.id === "writing") return !!CONFIG.medium || WRITING.length > 0;
  return true;
});

export const appMeta = (id: AppId) => APPS.find(a => a.id === id)!;
export const hasApp = (id: AppId) => APPS.some(a => a.id === id);

export type Phase = "boot" | "lock" | "desktop";

type SystemCtx = {
  phase: Phase;
  setPhase: (p: Phase) => void;
  booted: boolean;
  boot: () => void;
  windows: WinState[];
  open: (id: AppId) => void;
  close: (id: AppId) => void;
  focus: (id: AppId) => void;
  minimise: (id: AppId) => void;
  zoom: (id: AppId) => void;
  move: (id: AppId, x: number, y: number) => void;
  resize: (id: AppId, w: number, h: number) => void;
  isOpen: (id: AppId) => boolean;
  topId: AppId | null;
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  /* ⌘K search */
  spotlight: boolean;
  setSpotlight: (v: boolean) => void;
  resetDesktop: () => void;
};

/* the smallest a window may be dragged down to */
export const MIN_W = 340;
export const MIN_H = 220;

const Ctx = createContext<SystemCtx | null>(null);

export function useSystem() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSystem must be used inside <System>");
  return c;
}

/* Cascade new windows so they never land exactly on top of each other. */
function spawn(id: AppId, count: number): WinState {
  const meta = appMeta(id);
  const vw = typeof window === "undefined" ? 1280 : window.innerWidth;
  const vh = typeof window === "undefined" ? 800 : window.innerHeight;

  const w = Math.min(meta.w, vw - 80);
  const h = Math.min(meta.h, vh - 160);
  const step = 28 * (count % 5);

  return {
    id, w, h, z: 0, minimised: false, zoomed: false,
    x: Math.max(24, Math.round((vw - w) / 2) - 60 + step),
    y: Math.max(52, Math.round((vh - h) / 2) - 40 + step),
  };
}

const SEEN_BOOT = "abhistos.booted";
const SESSION = "abhistos.session";

type Session = { windows: WinState[]; theme: ThemeId };

/* The desk is restored the way it was left. Anything unreadable, or naming
   an app that no longer exists, is dropped rather than trusted — a stale
   session must never be able to open a window with no metadata behind it. */
function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (!Array.isArray(s.windows)) return null;
    return { theme: s.theme, windows: s.windows.filter(w => w && hasApp(w.id)) };
  } catch { return null; }
}

export function System({ children }: { children: React.ReactNode }) {
  /* the kernel log plays once per tab; coming back lands on the lock screen */
  const [phase, setPhase] = useState<Phase>(() => {
    try { return sessionStorage.getItem(SEEN_BOOT) ? "lock" : "boot"; } catch { return "boot"; }
  });
  const restored = useRef<Session | null>(readSession());
  const [windows, setWindows] = useState<WinState[]>(() => restored.current?.windows ?? []);
  const [theme, setTheme] = useState<ThemeId>(() => restored.current?.theme ?? "sunrise");
  const [spotlight, setSpotlight] = useState(false);
  const zRef = useRef(1);

  const focus = useCallback((id: AppId) => {
    setWindows(ws => {
      const top = ws.reduce((m, w) => Math.max(m, w.z), 0);
      const target = ws.find(w => w.id === id);
      if (!target || target.z === top) return ws;
      zRef.current = top + 1;
      return ws.map(w => (w.id === id ? { ...w, z: top + 1, minimised: false } : w));
    });
  }, []);

  const open = useCallback((id: AppId) => {
    setWindows(ws => {
      const existing = ws.find(w => w.id === id);
      const top = ws.reduce((m, w) => Math.max(m, w.z), 0);
      zRef.current = top + 1;
      if (existing) {
        return ws.map(w => (w.id === id ? { ...w, minimised: false, z: top + 1 } : w));
      }
      return [...ws, { ...spawn(id, ws.length), z: top + 1 }];
    });
  }, []);

  /* The close fades through CSS and the node is dropped on a timer. Framer's
     exit animations never complete anywhere in this app, which used to leave
     every closed window sitting on the desk at full opacity. */
  const close = useCallback((id: AppId) => {
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, closing: true } : w)));
    setTimeout(() => setWindows(ws => ws.filter(w => w.id !== id)), 190);
  }, []);
  const minimise  = useCallback((id: AppId) => setWindows(ws => ws.map(w => (w.id === id ? { ...w, minimised: true } : w))), []);
  const move      = useCallback((id: AppId, x: number, y: number) =>
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, x, y } : w))), []);

  /* a resize cancels "zoomed": the window is no longer the size zoom gave it,
     so restoring the pre-zoom geometry afterwards would be a surprise */
  const resize = useCallback((id: AppId, w: number, h: number) =>
    setWindows(ws => ws.map(win => (win.id === id
      ? { ...win, w: Math.max(MIN_W, w), h: Math.max(MIN_H, h), zoomed: false, prev: undefined }
      : win))), []);

  const resetDesktop = useCallback(() => {
    setWindows([]);
    try { localStorage.removeItem(SESSION); } catch { /* private mode */ }
  }, []);

  const zoom = useCallback((id: AppId) => {
    setWindows(ws => ws.map(w => {
      if (w.id !== id) return w;
      if (w.zoomed && w.prev) return { ...w, ...w.prev, zoomed: false, prev: undefined };
      return {
        ...w, zoomed: true,
        prev: { x: w.x, y: w.y, w: w.w, h: w.h },
        x: 16, y: 44,
        w: window.innerWidth - 32,
        h: window.innerHeight - 132,
      };
    }));
  }, []);

  const isOpen = useCallback((id: AppId) => windows.some(w => w.id === id && !w.minimised && !w.closing), [windows]);

  const topId = useMemo(() => {
    const live = windows.filter(w => !w.minimised && !w.closing);
    if (!live.length) return null;
    return live.reduce((a, b) => (a.z > b.z ? a : b)).id;
  }, [windows]);

  /* the live desk, readable from event listeners without rebinding them */
  const winRef = useRef<WinState[]>(windows);
  useEffect(() => { winRef.current = windows; }, [windows]);

  /* Carry the restored stacking order forward, so the first click after a
     reload doesn't send a window behind the ones it was already in front of. */
  useEffect(() => {
    zRef.current = (restored.current?.windows ?? []).reduce((m, w) => Math.max(m, w.z), 1);
  }, []);

  /* write the desk back on every change; a full desktop is a few hundred bytes */
  useEffect(() => {
    const keep = windows.filter(w => !w.closing);
    try { localStorage.setItem(SESSION, JSON.stringify({ windows: keep, theme })); }
    catch { /* private mode, or quota — the desk just won't persist */ }
  }, [windows, theme]);

  /* ── keyboard ──────────────────────────────
     ⌘K / ctrl-K opens search, ⌘W closes the focused window, ⌘M minimises it.
     Nothing fires while a text field has focus, so the terminal and the
     project search keep every key to themselves. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSpotlight(v => !v);
        return;
      }
      if (typing || !mod) return;

      const key = e.key.toLowerCase();
      if (key !== "w" && key !== "m") return;

      /* read the desk from a ref so the listener never has to be rebound, and
         go through close/minimise so the shortcut behaves like the buttons */
      const live = winRef.current.filter(w => !w.minimised && !w.closing);
      if (!live.length) return;
      e.preventDefault();
      const top = live.reduce((a, b) => (a.z > b.z ? a : b));
      if (key === "w") close(top.id); else minimise(top.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, minimise]);

  /* keep windows on screen when the viewport shrinks */
  useEffect(() => {
    const onResize = () => setWindows(ws => ws.map(w => ({
      ...w,
      x: Math.min(w.x, Math.max(8, window.innerWidth - 160)),
      y: Math.min(w.y, Math.max(44, window.innerHeight - 120)),
    })));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const value: SystemCtx = {
    phase,
    setPhase: (p: Phase) => {
      if (p !== "boot") { try { sessionStorage.setItem(SEEN_BOOT, "1"); } catch { /* ignore */ } }
      setPhase(p);
    },
    booted: phase === "desktop",
    boot: () => setPhase("desktop"),
    windows, open, close, focus, minimise, zoom, move, resize, isOpen, topId,
    theme, setTheme,
    spotlight, setSpotlight, resetDesktop,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* ═════════════════════════════════════════════
   SMALL HOOKS
═════════════════════════════════════════════ */

/** Ticking clock, updated on the minute boundary. */
export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export const fmtTime = (d: Date) =>
  d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

export const fmtDate = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

/** Phones and small tablets get the springboard instead of the desktop. */
export function useIsPhone(bp = 820) {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp}px)`);
    const apply = () => setPhone(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [bp]);
  return phone;
}
