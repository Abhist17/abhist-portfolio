import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import type { ThemeId } from "./data";

/* ═════════════════════════════════════════════
   WINDOW MANAGER
   A tiny desktop OS: apps open into windows that
   stack, focus, drag, minimise and zoom.
═════════════════════════════════════════════ */

export type AppId =
  | "about" | "projects" | "background" | "stack" | "contact" | "terminal" | "photo" | "mines";

export type WinState = {
  id: AppId;
  x: number; y: number;
  w: number; h: number;
  z: number;
  minimised: boolean;
  zoomed: boolean;
  /* geometry to restore when un-zooming */
  prev?: { x: number; y: number; w: number; h: number };
};

export type AppMeta = {
  id: AppId;
  name: string;
  /* what the icon looks like on the desktop */
  kind: "folder" | "folder-alt" | "doc" | "terminal" | "mail" | "grid" | "photo" | "mines";
  w: number;
  h: number;
  /* desktop icon slot */
  slot: number;
  onDesktop: boolean;
  inDock: boolean;
};

export const APPS: AppMeta[] = [
  { id: "projects",   name: "Projects",   kind: "folder",   w: 760, h: 520, slot: 0, onDesktop: true,  inDock: true  },
  { id: "about",      name: "About Me",   kind: "doc",      w: 620, h: 480, slot: 1, onDesktop: true,  inDock: true  },
  { id: "background", name: "Background", kind: "folder-alt", w: 720, h: 460, slot: 2, onDesktop: true,  inDock: true  },
  { id: "terminal",   name: "Terminal",   kind: "terminal", w: 680, h: 440, slot: 3, onDesktop: true,  inDock: true  },
  { id: "stack",      name: "Tech Stack", kind: "grid",     w: 660, h: 580, slot: 4, onDesktop: false, inDock: true  },
  { id: "contact",    name: "Contact",    kind: "mail",     w: 560, h: 420, slot: 5, onDesktop: true,  inDock: true  },
  { id: "mines",      name: "Minesweeper", kind: "mines",   w: 640, h: 660, slot: 6, onDesktop: true,  inDock: true  },
  { id: "photo",      name: "Me.jpg",     kind: "photo",    w: 460, h: 560, slot: 7, onDesktop: true,  inDock: false },
];

export const appMeta = (id: AppId) => APPS.find(a => a.id === id)!;

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
  isOpen: (id: AppId) => boolean;
  topId: AppId | null;
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
};

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

export function System({ children }: { children: React.ReactNode }) {
  /* the kernel log plays once per tab; coming back lands on the lock screen */
  const [phase, setPhase] = useState<Phase>(() => {
    try { return sessionStorage.getItem(SEEN_BOOT) ? "lock" : "boot"; } catch { return "boot"; }
  });
  const [windows, setWindows] = useState<WinState[]>([]);
  const [theme, setTheme] = useState<ThemeId>("midnight");
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

  const close     = useCallback((id: AppId) => setWindows(ws => ws.filter(w => w.id !== id)), []);
  const minimise  = useCallback((id: AppId) => setWindows(ws => ws.map(w => (w.id === id ? { ...w, minimised: true } : w))), []);
  const move      = useCallback((id: AppId, x: number, y: number) =>
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, x, y } : w))), []);

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

  const isOpen = useCallback((id: AppId) => windows.some(w => w.id === id && !w.minimised), [windows]);

  const topId = useMemo(() => {
    const live = windows.filter(w => !w.minimised);
    if (!live.length) return null;
    return live.reduce((a, b) => (a.z > b.z ? a : b)).id;
  }, [windows]);

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
    windows, open, close, focus, minimise, zoom, move, isOpen, topId,
    theme, setTheme,
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
