import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ME, SOCIALS, THEMES } from "./data";
import { AppIcon, SocialIcon } from "./icons";
import { AppBody } from "./apps";
import { APPS, appMeta, fmtDate, fmtTime, useClock, useSystem, type AppId } from "./system";

const EASE = [0.22, 1, 0.36, 1] as const;

const SOCIAL_GLYPH: Record<string, "github" | "twitter" | "linkedin" | "mail"> = {
  Email: "mail", Twitter: "twitter", GitHub: "github", LinkedIn: "linkedin",
};

/* ═════════════════════════════════════════════
   PHONE — a springboard, not a shrunken desktop
═════════════════════════════════════════════ */
export function Springboard() {
  const { theme, setTheme } = useSystem();
  const [app, setApp] = useState<AppId | null>(null);
  const now = useClock();

  return (
    <div className="phone">
      <div className="phone-status">
        <span>{fmtTime(now)}</span>
        <span className="phone-status-r">
          <span className="phone-dot" />{ME.status}
        </span>
      </div>

      <motion.header className="phone-head"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}>
        <img src={ME.avatar} alt="" />
        <div>
          <p className="phone-name">{ME.name}</p>
          <p className="phone-role">{ME.role} · {ME.location}</p>
        </div>
      </motion.header>

      <motion.p className="phone-bio"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease: EASE }}>
        {ME.bio}
      </motion.p>

      <div className="phone-grid">
        {APPS.map((a, i) => (
          <motion.button key={a.id} className="phone-app"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.12 + i * 0.04, ease: EASE }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setApp(a.id)}>
            <span className="phone-art"><AppIcon kind={a.kind} size={56} src={ME.avatar} /></span>
            <span className="phone-label">{a.name}</span>
          </motion.button>
        ))}
      </div>

      <div className="phone-themes">
        {THEMES.map(t => (
          <button key={t.id}
            className={`swatch ${theme === t.id ? "is-on" : ""}`}
            style={{ background: t.swatch }}
            onClick={() => setTheme(t.id)}
            aria-label={t.name} aria-pressed={theme === t.id} />
        ))}
      </div>

      <div className="phone-dock">
        {SOCIALS.map(s => {
          const external = !s.href.startsWith("mailto");
          return (
            <a key={s.label} href={s.href} aria-label={s.label}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}>
              <SocialIcon name={SOCIAL_GLYPH[s.label]} size={17} />
            </a>
          );
        })}
      </div>

      <p className="phone-foot">{fmtDate(now)} · Made with ❤️ in Room 524</p>

      <AnimatePresence>
        {app && <Sheet id={app} onClose={() => setApp(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* Full-screen app sheet, the phone equivalent of a window. */
function Sheet({ id, onClose }: { id: AppId; onClose: () => void }) {
  const meta = appMeta(id);
  return (
    <motion.div className="sheet"
      initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
      transition={{ duration: 0.42, ease: EASE }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.4 }}
      onDragEnd={(_, info) => { if (info.offset.y > 110) onClose(); }}>
      <div className="sheet-bar">
        <span className="sheet-grip" />
        <span className="sheet-title">{meta.name}</span>
        <button className="sheet-close" onClick={onClose} aria-label="Close">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="sheet-body">
        <AppBody id={id} open={() => {}} />
      </div>
    </motion.div>
  );
}
