import { useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { ME, SOCIALS, STATS, THEMES, PROJECTS, SKILLS } from "./data";
import { AppIcon, SocialIcon } from "./icons";
import { AppBody } from "./apps";
import {
  APPS, appMeta, fmtDate, fmtTime, useClock, useSystem, type AppId, type WinState,
} from "./system";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ═════════════════════════════════════════════
   LOCK SCREEN
═════════════════════════════════════════════ */
export function LockScreen() {
  const { boot } = useSystem();
  const now = useClock();

  return (
    <motion.div
      className="lock"
      onClick={boot}
      role="button"
      tabIndex={0}
      aria-label="Unlock"
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") boot(); }}
      exit={{ opacity: 0, scale: 1.06, filter: "blur(12px)" }}
      transition={{ duration: 0.8, ease: EASE }}>

      <motion.div className="lock-clock"
        initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}>
        <p className="lock-date">{fmtDate(now)}</p>
        <p className="lock-time">{fmtTime(now)}</p>
      </motion.div>

      <motion.div className="lock-id"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE }}>
        <img className="lock-avatar" src={ME.avatar} alt="" />
        <p className="lock-name">{ME.name}</p>
        <p className="lock-role">{ME.role}</p>
        <span className="lock-btn">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M4.5 7V5a3.5 3.5 0 1 1 7 0v2H12a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zM6 5v2h4V5a2 2 0 1 0-4 0z" />
          </svg>
          Click to unlock
        </span>
      </motion.div>

      <p className="lock-hint">Click anywhere to unlock</p>
    </motion.div>
  );
}

/* ═════════════════════════════════════════════
   MENU BAR
═════════════════════════════════════════════ */
const MENUS: { label: string; items: { label: string; app?: AppId; href?: string }[] }[] = [
  { label: "File", items: [
    { label: "Open Projects", app: "projects" },
    { label: "Open Terminal", app: "terminal" },
    { label: "Open Résumé…", href: "https://github.com/Abhist17" },
  ]},
  { label: "Go", items: [
    { label: "About Me", app: "about" },
    { label: "Background", app: "background" },
    { label: "Stack", app: "stack" },
    { label: "Contact", app: "contact" },
  ]},
  { label: "Help", items: [
    { label: "Try the Terminal", app: "terminal" },
    { label: "Email me", href: "mailto:abhistcodes17@gmail.com" },
  ]},
];

const SOCIAL_GLYPH: Record<string, "github" | "twitter" | "linkedin" | "mail"> = {
  Email: "mail", Twitter: "twitter", GitHub: "github", LinkedIn: "linkedin",
};

export function MenuBar() {
  const { open } = useSystem();
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
            <AnimatePresence>
              {menu === m.label && (
                <motion.div className="dropdown"
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}>
                  {m.items.map(it => it.app ? (
                    <button key={it.label} onClick={() => { open(it.app!); setMenu(null); }}>{it.label}</button>
                  ) : (
                    <a key={it.label} href={it.href} target="_blank" rel="noreferrer" onClick={() => setMenu(null)}>{it.label}</a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="bar-right">
        {SOCIALS.filter(s => s.label !== "Email").map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="bar-social">
            <SocialIcon name={SOCIAL_GLYPH[s.label]} size={14} />
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
        <motion.button
          key={a.id}
          className={`icon ${sel === a.id ? "is-sel" : ""}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 + i * 0.05, ease: EASE }}
          onClick={() => setSel(a.id)}
          onDoubleClick={() => open(a.id)}
          aria-label={`${a.name} — double-click to open`}>
          <span className="icon-art"><AppIcon kind={a.kind} size={60} src={ME.avatar} /></span>
          <span className="icon-label">{a.name}</span>
        </motion.button>
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
    <motion.div className="intro"
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: EASE }}>
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
    </motion.div>
  );
}

/* ═════════════════════════════════════════════
   WIDGETS
═════════════════════════════════════════════ */
export function Widgets() {
  const { theme, setTheme, open } = useSystem();

  return (
    <motion.aside className="widgets"
      initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: EASE }}>

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

      <div className="w-card w-status">
        <p className="w-kicker">Status</p>
        <p className="w-big"><span className="w-dot" />{ME.status}</p>
        <p className="w-sub">{ME.location} · {ME.handle}</p>
      </div>

      <div className="w-card">
        <p className="w-kicker">By the numbers</p>
        <div className="w-stats">
          {STATS.map(([v, l]) => (
            <div key={l}><strong>{v}</strong><span>{l}</span></div>
          ))}
        </div>
      </div>

      <button className="w-card w-repos" onClick={() => open("projects")}>
        <p className="w-kicker">Repositories</p>
        <p className="w-big">{PROJECTS.length}</p>
        <p className="w-sub">{PROJECTS.filter(p => p.done).length} shipped · {PROJECTS.filter(p => !p.done).length} in progress</p>
      </button>
    </motion.aside>
  );
}

/* ═════════════════════════════════════════════
   WINDOW
═════════════════════════════════════════════ */
/* `win` is passed in rather than looked up: while AnimatePresence plays a
   window's exit animation it has already been removed from state, so a
   lookup here would come back undefined mid-flight. */
function Window({ win }: { win: WinState }) {
  const { close, focus, minimise, zoom, move, topId, open } = useSystem();
  const id = win.id;
  const meta = appMeta(id);
  const controls = useDragControls();
  const ref = useRef<HTMLDivElement>(null);
  const active = topId === id;

  return (
    <motion.div
      ref={ref}
      className={`win ${active ? "is-active" : ""}`}
      style={{ width: win.w, height: win.h, zIndex: 100 + win.z }}
      initial={{ opacity: 0, scale: 0.94, x: win.x, y: win.y }}
      animate={{
        opacity: win.minimised ? 0 : 1,
        scale: win.minimised ? 0.86 : 1,
        x: win.x, y: win.y,
        pointerEvents: win.minimised ? "none" : "auto",
      }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.28, ease: EASE }}
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
    </motion.div>
  );
}

export function Windows() {
  const { windows } = useSystem();
  return (
    <AnimatePresence>
      {windows.map(w => <Window key={w.id} win={w} />)}
    </AnimatePresence>
  );
}

/* ═════════════════════════════════════════════
   DOCK
═════════════════════════════════════════════ */
export function Dock() {
  const { open, windows } = useSystem();
  const dockApps = APPS.filter(a => a.inDock);
  const stack = Object.values(SKILLS).flat();

  return (
    <motion.div className="dock-wrap"
      initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.45, ease: EASE }}>
      <p className="dock-kicker">{stack.length} tools · {ME.handle}</p>
      <div className="dock">
        {dockApps.map(a => {
          const isOpen = windows.some(w => w.id === a.id);
          return (
            <button key={a.id} className="dock-item" onClick={() => open(a.id)} aria-label={a.name}>
              <span className="dock-art"><AppIcon kind={a.kind} size={44} src={ME.avatar} /></span>
              <span className="dock-tip">{a.name}</span>
              <span className={`dock-dot ${isOpen ? "on" : ""}`} />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
