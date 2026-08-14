import { useEffect, useRef, useState } from "react";
import { ME, SOCIALS, THEMES } from "./data";
import { AppIcon } from "./icons";
import { SocialMark } from "./socials";
import { COVER } from "./gallery";
import { AppBody } from "./apps";
import { APPS, appMeta, fmtDate, fmtTime, useClock, useSystem, type AppId } from "./system";

/* how far, or how fast, a pull on the grip has to be to let the sheet go */
const DISMISS_PX = 110;
const DISMISS_V  = 0.7;   /* px per ms */

/* ═════════════════════════════════════════════
   PHONE — a springboard, not a shrunken desktop
═════════════════════════════════════════════ */
export function Springboard() {
  const { theme, setTheme } = useSystem();
  const [app, setApp] = useState<AppId | null>(null);
  const [closing, setClosing] = useState(false);
  const now = useClock();

  /* let the sheet slide back down, then drop it */
  const closeSheet = () => {
    setClosing(true);
    setTimeout(() => { setApp(null); setClosing(false); }, 400);
  };

  /* An open sheet covers the springboard, so the page behind it must stop
     scrolling — otherwise a flick that starts on the sheet and runs past the
     end of its content drags the home screen around underneath. The scroll
     position is put back on close, because pinning the body to `fixed` is the
     only reliable lock on iOS and that discards it. */
  useEffect(() => {
    if (!app) return;
    const y = window.scrollY;
    const { body } = document;
    const prev = body.style.cssText;
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    return () => {
      body.style.cssText = prev;
      window.scrollTo(0, y);
    };
  }, [app]);

  return (
    <div className="phone">
      <div className="phone-status">
        <span>{fmtTime(now)}</span>
        <span className="phone-status-r">
          <span className="phone-dot" />{ME.status}
        </span>
      </div>

      {/* These entrances are CSS animations with `both` fill, not JS-driven
          opacity — the same reasoning as the desktop. A phone throttles or
          drops frames whenever the tab loses focus mid-animation, and a
          JS-driven fade that never lands leaves the name, the bio and every
          app icon stranded at opacity 0 on an otherwise finished page. */}
      <header className="phone-head anim-rise">
        <img src={ME.avatar} alt="" />
        <div>
          <p className="phone-name">{ME.name}</p>
          <p className="phone-role">{ME.role} · {ME.location}</p>
        </div>
      </header>

      <p className="phone-bio anim-rise" style={{ animationDelay: "0.08s" }}>
        {ME.bio}
      </p>

      <div className="phone-grid">
        {APPS.map((a, i) => (
          <button key={a.id} className="phone-app anim-pop"
            style={{ animationDelay: `${0.12 + i * 0.04}s` }}
            onClick={() => setApp(a.id)}>
            <span className="phone-art"><AppIcon kind={a.kind} size={56} src={COVER} /></span>
            <span className="phone-label">{a.name}</span>
          </button>
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
        {SOCIALS.filter(s => s.href).map(s => {
          const external = !s.href.startsWith("mailto");
          return (
            <a key={s.id} href={s.href} aria-label={s.label}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}>
              <SocialMark id={s.id} size={34} />
            </a>
          );
        })}
      </div>

      <p className="phone-foot">{fmtDate(now)} · Made with ❤️ in Room 524</p>

      {/* Not an AnimatePresence: its exit never completes in this app, and a
          sheet that fails to unmount covers the whole phone for good. The
          slide-out is a CSS animation and the unmount is a timer — neither
          depends on an animation reporting back. */}
      {app && <Sheet id={app} closing={closing} onClose={closeSheet} />}
    </div>
  );
}

/* Full-screen app sheet, the phone equivalent of a window.

   The slide is a CSS animation and the drag writes the node's transform
   directly — no motion component in either, which is the same call the windows,
   the menus and the lock screen already made. Two reasons it matters more here.
   The resting position of this sheet *is* the layout: it is the whole screen,
   so a slide that stops short doesn't just look wrong, it pushes the app's own
   footer under the bottom edge. `both` fill makes the final state a matter of
   the cascade rather than of frames being delivered, which is the guarantee a
   phone — backgrounded mid-animation by a call, a notification, a task switch
   — is least able to give. And the drag had to be re-hosted on the bar anyway
   (see below), which left little of the motion component in use. */
function Sheet({ id, closing, onClose }: { id: AppId; closing: boolean; onClose: () => void }) {
  const meta = appMeta(id);
  const ref = useRef<HTMLDivElement>(null);

  /* A drag leaves inline transform and animation on the node. They have to
     come off before the closing class lands or the slide-out has nothing to
     animate — an inline `animation: none` outranks any stylesheet. */
  useEffect(() => {
    const node = ref.current;
    if (!closing || !node) return;
    node.style.animation = "";
    node.style.transition = "";
    node.style.transform = "";
  }, [closing]);

  /* The gesture is owned by the bar alone. When the whole sheet listened for
     it, every downward swipe over the content — reading down the project list,
     scrolling the résumé — was taken as a dismissal, so the apps could not be
     scrolled past their first screen at all. The grip is the handle, which is
     exactly what the grip looks like. */
  const startDrag = (e: React.PointerEvent) => {
    const node = ref.current;
    if (!node || closing || e.button !== 0) return;

    const bar = e.currentTarget as HTMLElement;
    bar.setPointerCapture(e.pointerId);

    const y0 = e.clientY;
    let dy = 0;
    let lastY = e.clientY, lastT = e.timeStamp, v = 0;

    /* the entrance animation would keep overwriting the drag */
    node.style.animation = "none";
    node.style.transition = "none";

    const onMove = (ev: PointerEvent) => {
      /* down only — the sheet is already against its top stop */
      dy = Math.max(0, ev.clientY - y0);
      const dt = ev.timeStamp - lastT;
      if (dt > 0) { v = (ev.clientY - lastY) / dt; lastY = ev.clientY; lastT = ev.timeStamp; }
      node.style.transform = `translateY(${dy}px)`;
    };

    const onUp = () => {
      bar.removeEventListener("pointermove", onMove);
      bar.removeEventListener("pointerup", onUp);
      bar.removeEventListener("pointercancel", onUp);

      /* a flick counts as well as a long pull, so the quick gesture that never
         travels the full 110px still lets go */
      if (dy > DISMISS_PX || v > DISMISS_V) { onClose(); return; }

      node.style.transition = "transform .26s cubic-bezier(.22,1,.36,1)";
      node.style.transform = "translateY(0px)";
    };

    bar.addEventListener("pointermove", onMove);
    bar.addEventListener("pointerup", onUp);
    bar.addEventListener("pointercancel", onUp);
  };

  return (
    <div ref={ref} className={`sheet ${closing ? "is-closing" : ""}`}>
      <div className="sheet-bar" onPointerDown={startDrag}>
        <span className="sheet-grip" />
        <span className="sheet-title">{meta.name}</span>
        {/* the close button sits on the drag handle, so it has to keep its own
            press to itself or every tap on it begins a drag instead */}
        <button className="sheet-close" onClick={onClose} aria-label="Close"
          onPointerDown={e => e.stopPropagation()}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="sheet-body">
        <AppBody id={id} open={() => {}} />
      </div>
    </div>
  );
}
