import { useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ME, SOCIALS, STATS, THEMES, PROJECTS, SKILLS } from "./data";
import { AppIcon, SocialIcon } from "./icons";
import { AppBody } from "./apps";
import { CONFIG } from "./config";
import { TOOLS, ToolIcon, type Tool } from "./tech";
import { useCodeforces, useGitHub, useGitHubActivity, useWeather, weatherText } from "./live";
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
  const gh   = useGitHub();
  const act  = useGitHubActivity();
  const wx   = useWeather();
  const cf   = useCodeforces();

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

      <div className="w-row">
        <div className="w-card w-status">
          <p className="w-kicker">Status</p>
          <p className="w-big"><span className="w-dot" />Open</p>
          <p className="w-sub">{ME.status}</p>
        </div>

        {/* live weather — hidden entirely if the call fails */}
        {(wx.data || wx.loading) && (
          <div className="w-card">
            <p className="w-kicker">{CONFIG.place.name}</p>
            {wx.data ? (
              <>
                <p className="w-big">{wx.data.temp}°</p>
                <p className="w-sub">{weatherText(wx.data.code)} · {wx.data.wind} km/h</p>
              </>
            ) : <p className="w-sub">…</p>}
          </div>
        )}
      </div>

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

      <div className="w-card">
        <p className="w-kicker">By the numbers</p>
        <div className="w-stats">
          {STATS.map(([v, l]) => (
            <div key={l}><strong>{v}</strong><span>{l}</span></div>
          ))}
        </div>
      </div>
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
      initial={{ opacity: 0, scale: 0.9, y: win.y + 18, x: win.x }}
      animate={{
        opacity: win.minimised ? 0 : 1,
        scale: win.minimised ? 0.86 : 1,
        x: win.x, y: win.y,
        pointerEvents: win.minimised ? "none" : "auto",
      }}
      exit={{ opacity: 0, scale: 0.93, transition: { duration: 0.18, ease: "easeIn" } }}
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
/* macOS-style magnification: each tile scales by how close the pointer is,
   so neighbours swell too instead of one tile popping on hover. */
function DockTile({ tool, mouseX, onOpen }: {
  tool: Tool; mouseX: ReturnType<typeof useMotionValue<number | null>>; onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (x) => {
    if (x === null || !ref.current) return 9999;
    const b = ref.current.getBoundingClientRect();
    return Math.abs(x - (b.left + b.width / 2));
  });

  const scale = useSpring(
    useTransform(distance, [0, 60, 130], [1.62, 1.22, 1]),
    { stiffness: 340, damping: 26, mass: 0.5 },
  );
  const lift = useSpring(
    useTransform(distance, [0, 60, 130], [-13, -5, 0]),
    { stiffness: 340, damping: 26, mass: 0.5 },
  );

  return (
    <button ref={ref} className="dock-item" onClick={onOpen} aria-label={tool.name}>
      <motion.span className="dock-art" style={{ scale, y: lift }}>
        <ToolIcon tool={tool} size={46} />
      </motion.span>
      <span className="dock-tip">{tool.name}</span>
    </button>
  );
}

export function Dock() {
  const { open } = useSystem();
  const mouseX = useMotionValue<number | null>(null);

  return (
    <motion.div className="dock-wrap"
      initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.45, ease: EASE }}>
      <p className="dock-kicker">Tech stack</p>
      <div
        className="dock"
        onPointerMove={e => mouseX.set(e.clientX)}
        onPointerLeave={() => mouseX.set(null)}>
        {TOOLS.map(t => (
          <DockTile key={t.id} tool={t} mouseX={mouseX} onOpen={() => open("stack")} />
        ))}
      </div>
    </motion.div>
  );
}
