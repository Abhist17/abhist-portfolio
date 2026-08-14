import { useRef, useState } from "react";
import { motion, useDragControls, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ME, SOCIALS, STATS, THEMES, PROJECTS, SKILLS } from "./data";
import { AppIcon, SocialIcon } from "./icons";
import { COVER } from "./gallery";
import { AppBody } from "./apps";
import { CONFIG } from "./config";

import { useCodeforces, useGitHub, useGitHubActivity, useWeather, weatherText } from "./live";
import { NowPlaying } from "./music";
import {
  APPS, appMeta, fmtDate, fmtTime, hasApp, MIN_H, MIN_W, useClock, useSystem,
  type AppId, type WinState,
} from "./system";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ═════════════════════════════════════════════
   LOCK SCREEN
═════════════════════════════════════════════ */
export function LockScreen() {
  const { boot } = useSystem();
  const now = useClock();
  const [leaving, setLeaving] = useState(false);

  /* The fade is a CSS animation and the unmount is a timer, so the screen
     comes off the desk whether or not the animation ever reports back. */
  const unlock = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(boot, 460);
  };

  return (
    <div
      className={`lock ${leaving ? "is-leaving" : ""}`}
      onClick={unlock}
      role="button"
      tabIndex={0}
      aria-label="Unlock"
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") unlock(); }}>

      <div className="lock-clock anim-drop">
        <p className="lock-date">{fmtDate(now)}</p>
        <p className="lock-time">{fmtTime(now)}</p>
      </div>

      <div className="lock-id anim-rise" style={{ animationDelay: "0.15s" }}>
        <img className="lock-avatar" src={ME.avatar} alt="" />
        <p className="lock-name">{ME.name}</p>
        <p className="lock-role">{ME.role}</p>
        <span className="lock-btn">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M4.5 7V5a3.5 3.5 0 1 1 7 0v2H12a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zM6 5v2h4V5a2 2 0 1 0-4 0z" />
          </svg>
          Click to unlock
        </span>
      </div>

      <p className="lock-hint">Click anywhere to unlock</p>
    </div>
  );
}

/* ═════════════════════════════════════════════
   MENU BAR
═════════════════════════════════════════════ */
type MenuItem = { label: string; app?: AppId; href?: string; act?: "search" | "reset"; hint?: string };

const MENUS: { label: string; items: MenuItem[] }[] = [
  { label: "File", items: [
    { label: "Open Projects", app: "projects" },
    { label: "Open Terminal", app: "terminal" },
    { label: "Open Resume", app: "resume" },
    { label: "Reset Desktop", act: "reset" },
  ]},
  { label: "Go", items: [
    { label: "Search…", act: "search", hint: "⌘K" },
    { label: "About Me", app: "about" },
    { label: "Writing", app: "writing" },
    { label: "Background", app: "background" },
    { label: "Stack", app: "stack" },
    { label: "Contact", app: "contact" },
  ]},
  { label: "Help", items: [
    { label: "Try the Terminal", app: "terminal" },
    { label: "Email me", href: "mailto:abhistcodes17@gmail.com" },
  ]},
];

export function MenuBar() {
  const { open, setSpotlight, resetDesktop } = useSystem();
  const now = useClock();
  const [menu, setMenu] = useState<string | null>(null);

  return (
    <div className="bar" onMouseLeave={() => setMenu(null)}>
      <div className="bar-left">
        <img className="bar-avatar" src={ME.avatar} alt="" />
        <strong className="bar-name">{ME.name}</strong>
        {MENUS.map(m => (
          <div className="bar-menu" key={m.label}>
            <button
              className={`bar-item ${menu === m.label ? "is-open" : ""}`}
              onClick={() => setMenu(v => (v === m.label ? null : m.label))}
              onMouseEnter={() => setMenu(v => (v ? m.label : v))}>
              {m.label}
            </button>
            {/* plain conditional, like the other overlays — an exit that never
                finished left the menu hanging open over the desk */}
            {menu === m.label && (
                <div className="dropdown">
                  {m.items.filter(it => !it.app || hasApp(it.app)).map(it => it.href ? (
                    <a key={it.label} href={it.href} target="_blank" rel="noreferrer" onClick={() => setMenu(null)}>{it.label}</a>
                  ) : (
                    <button
                      key={it.label}
                      onClick={() => {
                        if (it.app) open(it.app);
                        else if (it.act === "search") setSpotlight(true);
                        else if (it.act === "reset") resetDesktop();
                        setMenu(null);
                      }}>
                      {it.label}
                      {it.hint && <kbd className="menu-hint">{it.hint}</kbd>}
                    </button>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>

      <div className="bar-right">
        {/* a shortcut nobody is told about is a shortcut nobody uses */}
        <button className="bar-search" onClick={() => setSpotlight(true)} aria-label="Search">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
            <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10.6 10.6L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <kbd>⌘K</kbd>
        </button>
        {SOCIALS.filter(s => s.href && s.id !== "email").map(s => (
          <a key={s.id} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="bar-social">
            <SocialIcon name={s.id} size={14} />
          </a>
        ))}
        <span className="bar-clock">{fmtDate(now)}</span>
        <span className="bar-clock">{fmtTime(now)}</span>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════
   DESKTOP ICONS
═════════════════════════════════════════════ */
export function DesktopIcons() {
  const { open } = useSystem();
  const [sel, setSel] = useState<AppId | null>(null);

  return (
    <div className="icons" onClick={e => { if (e.target === e.currentTarget) setSel(null); }}>
      {APPS.filter(a => a.onDesktop).map((a, i) => (
        <button
          key={a.id}
          className={`icon anim-pop ${sel === a.id ? "is-sel" : ""}`}
          style={{ animationDelay: `${0.2 + i * 0.05}s` }}
          onClick={() => setSel(a.id)}
          onDoubleClick={() => open(a.id)}
          aria-label={`${a.name} — double-click to open`}>
          <span className="icon-art"><AppIcon kind={a.kind} size={84} src={COVER} /></span>
          <span className="icon-label">{a.name}</span>
        </button>
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════
   INTRO BLOCK
═════════════════════════════════════════════ */
export function Intro() {
  const { open } = useSystem();
  return (
    <div className="intro anim-rise" style={{ animationDelay: "0.1s" }}>
      <img className="intro-avatar" src={ME.avatar} alt={ME.name} />
      <div className="intro-text">
        <p className="intro-kicker">{ME.role}</p>
        <p>{ME.bio}</p>
        <button className="intro-more" onClick={() => open("about")}>
          More about me
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════
   WIDGETS
═════════════════════════════════════════════ */
/* the platforms that can only be linked, not queried */
const CP_LINKS = [
  { label: "LeetCode", handle: CONFIG.leetcode, href: `https://leetcode.com/u/${CONFIG.leetcode}/` },
  { label: "CodeChef", handle: CONFIG.codechef, href: `https://www.codechef.com/users/${CONFIG.codechef}` },
].filter(l => !!l.handle);

export function Widgets() {
  const { theme, setTheme, open } = useSystem();
  const gh   = useGitHub();
  const act  = useGitHubActivity();
  const wx   = useWeather();
  const cf   = useCodeforces();

  return (
    <aside className="widgets anim-slide" style={{ animationDelay: "0.2s" }}>

      <div className="w-card w-theme">
        <p className="w-kicker">Choose a theme</p>
        <div className="w-swatches">
          {THEMES.map(t => (
            <button
              key={t.id}
              className={`swatch ${theme === t.id ? "is-on" : ""}`}
              style={{ background: t.swatch }}
              onClick={() => setTheme(t.id)}
              aria-label={t.name}
              aria-pressed={theme === t.id}
            />
          ))}
        </div>
      </div>

      {/* live weather — hidden entirely if the call fails */}
      {(wx.data || wx.loading) && (
        <div className="w-card w-weather">
          <p className="w-kicker">{CONFIG.place.name} <span className="w-avail"><span className="w-dot" />{ME.status}</span></p>
          {wx.data ? (
            <>
              <p className="w-temp">{wx.data.temp}°</p>
              <p className="w-sub">{weatherText(wx.data.code)} · {wx.data.wind} km/h</p>
            </>
          ) : <p className="w-sub">…</p>}
        </div>
      )}

      <NowPlaying />

      {/* live GitHub */}
      {(gh.data || gh.loading) && (
        <button className="w-card w-gh" onClick={() => open("projects")}>
          <p className="w-kicker">GitHub · {CONFIG.github}</p>
          {gh.data ? (
            <>
              <div className="w-stats">
                <div><strong>{gh.data.repos}</strong><span>repos</span></div>
                <div><strong>{gh.data.stars}</strong><span>stars</span></div>
                <div><strong>{PROJECTS.length}</strong><span>featured</span></div>
              </div>
              {act.data && (
                <>
                  <div className="spark" aria-label="Recent public activity">
                    {act.data.map((n, i) => (
                      <span key={i} className="spark-b" style={{ opacity: n ? Math.min(1, 0.3 + n * 0.18) : 0.1 }} />
                    ))}
                  </div>
                  <p className="w-sub">last 21 days of public activity</p>
                </>
              )}
            </>
          ) : <p className="w-sub">loading…</p>}
        </button>
      )}

      {/* competitive programming — only once a handle is configured */}
      {cf.data && (
        <a className="w-card" href={`https://codeforces.com/profile/${CONFIG.codeforces}`} target="_blank" rel="noreferrer">
          <p className="w-kicker">Codeforces</p>
          <p className="w-big">{cf.data.rating ?? "—"}</p>
          <p className="w-sub">{cf.data.rank ?? "unrated"}{cf.data.maxRating ? ` · peak ${cf.data.maxRating}` : ""}</p>
        </a>
      )}

      {/* LeetCode and CodeChef have no CORS-open API, so these stay honest
          links rather than pretending to live numbers. */}
      {CP_LINKS.length > 0 && (
        <div className="w-card">
          <p className="w-kicker">Also solving on</p>
          <div className="w-links">
            {CP_LINKS.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                <span>{l.label}</span>
                <span className="w-handle">{l.handle}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="w-card">
        <p className="w-kicker">By the numbers</p>
        <div className="w-stats">
          {STATS.map(([v, l]) => (
            <div key={l}><strong>{v}</strong><span>{l}</span></div>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ═════════════════════════════════════════════
   WINDOW
═════════════════════════════════════════════ */
/* `win` is passed in rather than looked up: a closing window is still being
   rendered after the close is asked for, and a lookup by id would race the
   manager dropping it. */
/* Which edges a handle drags. "e" widens, "s" heightens, "se" both. */
const EDGES = ["e", "s", "se"] as const;

function Window({ win }: { win: WinState }) {
  const { close, focus, minimise, zoom, move, resize, topId, open } = useSystem();
  const id = win.id;
  const meta = appMeta(id);
  const controls = useDragControls();
  const ref = useRef<HTMLDivElement>(null);
  const active = topId === id;

  /* Resizing runs on the window rather than through React state per frame:
     the pointer moves far faster than a re-render, and committing only on
     release keeps the drag smooth on a slow machine. */
  const startResize = (edge: typeof EDGES[number]) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    focus(id);

    const node = ref.current;
    if (!node) return;
    const x0 = e.clientX, y0 = e.clientY;
    const w0 = win.w, h0 = win.h;
    let w = w0, h = h0;

    const onMove = (ev: PointerEvent) => {
      if (edge !== "s") w = Math.max(MIN_W, w0 + (ev.clientX - x0));
      if (edge !== "e") h = Math.max(MIN_H, h0 + (ev.clientY - y0));
      node.style.width = `${w}px`;
      node.style.height = `${h}px`;
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      resize(id, w, h);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <motion.div
      ref={ref}
      className={`win ${active ? "is-active" : ""} ${win.closing ? "is-closing" : ""}`}
      style={{ width: win.w, height: win.h, zIndex: 100 + win.z }}
      initial={{ opacity: 0, scale: 0.9, y: win.y + 18, x: win.x }}
      animate={{
        opacity: win.minimised ? 0 : 1,
        scale: win.minimised ? 0.86 : 1,
        x: win.x, y: win.y,
        pointerEvents: win.minimised ? "none" : "auto",
      }}
      transition={{
        default: { type: "spring", stiffness: 420, damping: 32, mass: 0.7 },
        opacity: { duration: 0.18 },
      }}
      drag
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(_, info) => move(id, win.x + info.offset.x, win.y + info.offset.y)}
      onPointerDown={() => focus(id)}>

      <div
        className="win-bar"
        onPointerDown={e => { if (!win.zoomed) controls.start(e); }}
        onDoubleClick={() => zoom(id)}>
        <div className="lights">
          <button className="light red"    onClick={() => close(id)}    aria-label="Close" />
          <button className="light yellow" onClick={() => minimise(id)} aria-label="Minimise" />
          <button className="light green"  onClick={() => zoom(id)}     aria-label="Zoom" />
        </div>
        <span className="win-title">{meta.name}</span>
        <span className="win-spacer" />
      </div>

      <div className="win-body">
        <AppBody id={id} open={open} />
      </div>

      {/* a zoomed window is pinned to the viewport, so it has nothing to drag */}
      {!win.zoomed && EDGES.map(edge => (
        <span
          key={edge}
          className={`win-grip grip-${edge}`}
          onPointerDown={startResize(edge)}
          aria-hidden
        />
      ))}
    </motion.div>
  );
}

export function Windows() {
  const { windows } = useSystem();
  /* No AnimatePresence: its exit never completed here, so closed windows were
     left on the desk at full opacity. The manager drops them itself. */
  return <>{windows.map(w => <Window key={w.id} win={w} />)}</>;
}

/* ═════════════════════════════════════════════
   DOCK
═════════════════════════════════════════════ */
/* macOS-style magnification: each tile scales by how close the pointer is,
   so neighbours swell too instead of one tile popping on hover. */
function DockTile({ app, mouseX, isOpen, onOpen }: {
  app: typeof APPS[number];
  mouseX: ReturnType<typeof useMotionValue<number | null>>;
  isOpen: boolean;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (x) => {
    if (x === null || !ref.current) return 9999;
    const b = ref.current.getBoundingClientRect();
    return Math.abs(x - (b.left + b.width / 2));
  });

  const spring = { stiffness: 340, damping: 26, mass: 0.5 };
  const scale = useSpring(useTransform(distance, [0, 60, 130], [1.58, 1.2, 1]), spring);
  const lift  = useSpring(useTransform(distance, [0, 60, 130], [-12, -5, 0]), spring);

  return (
    <button ref={ref} className="dock-item" onClick={onOpen} aria-label={app.name}>
      <motion.span className="dock-art" style={{ scale, y: lift }}>
        <AppIcon kind={app.kind} size={46} src={COVER} />
      </motion.span>
      <span className="dock-tip">{app.name}</span>
      <span className={`dock-dot ${isOpen ? "on" : ""}`} />
    </button>
  );
}

export function Dock() {
  const { open, windows } = useSystem();
  const mouseX = useMotionValue<number | null>(null);
  const dockApps = APPS.filter(a => a.inDock);

  return (
    <div className="dock-wrap anim-rise" style={{ animationDelay: "0.35s" }}>
      <div
        className="dock"
        onPointerMove={e => mouseX.set(e.clientX)}
        onPointerLeave={() => mouseX.set(null)}>
        {dockApps.map(a => (
          <DockTile
            key={a.id}
            app={a}
            mouseX={mouseX}
            isOpen={windows.some(w => w.id === a.id)}
            onOpen={() => open(a.id)}
          />
        ))}
      </div>
    </div>
  );
}
