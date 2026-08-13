import { useEffect, useRef } from "react";
import { Command } from "cmdk";
import { PROJECTS, SKILLS, SOCIALS, THEMES } from "./data";
import { APPS, useSystem } from "./system";
import { AppIcon } from "./icons";
import { COVER } from "./gallery";

/* ═════════════════════════════════════════════
   SPOTLIGHT — ⌘K over the whole desk

   One field that reaches everything the OS knows about: apps, repos, the
   stack, the links, the wallpaper. Picking a result performs it rather than
   scrolling to it, which is the difference between search and a table of
   contents.
═════════════════════════════════════════════ */
export function Spotlight() {
  const { spotlight, setSpotlight, open, setTheme, resetDesktop } = useSystem();
  const shell = useRef<HTMLDivElement>(null);

  /* The field is found through the DOM rather than through a ref handed to
     Command.Input, which was not reliably populated by the time the effect
     ran — leaving the panel open with the caret nowhere. */
  const focusField = () => shell.current?.querySelector("input")?.focus();

  useEffect(() => {
    if (!spotlight) return;
    const t = setTimeout(focusField, 0);
    return () => clearTimeout(t);
  }, [spotlight]);

  const run = (fn: () => void) => { fn(); setSpotlight(false); };

  /* Deliberately a plain conditional render rather than an animated presence.
     A full-screen veil that fails to unmount leaves the desk permanently
     unclickable, so the overlay trades its exit fade for the guarantee that
     it is either mounted or gone. The entrance is a CSS keyframe. */
  if (!spotlight) return null;

  return (
    <div className="spot-veil" onClick={() => setSpotlight(false)}>
      <div
        className="spot"
        ref={shell}
        onClick={e => e.stopPropagation()}
        /* clicking anywhere in the panel puts the caret back in the field,
           so a stray click on the chrome never swallows the next keystroke */
        onPointerDown={() => focusField()}>

            <Command
              label="Search"
              loop
              /* cmdk scores a fuzzy subsequence by default, which is far too
                 loose against text this long — "rust" matches any description
                 carrying those four letters in order, so every project comes
                 back. Match each word against the start of a word instead:
                 that still finds "Rust" from "ru", without "trustless" also
                 answering to "rust". */
              filter={(value, search) => {
                const v = value.toLowerCase();
                const s = search.trim().toLowerCase();
                if (!s) return 1;
                const hits = s.split(/\s+/).every(w => {
                  const safe = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                  return new RegExp(`\\b${safe}`).test(v);
                });
                if (!hits) return 0;
                return v.startsWith(s) ? 1 : 0.5;
              }}
              onKeyDown={e => { if (e.key === "Escape") setSpotlight(false); }}>
              <div className="spot-field">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10.6 10.6L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <Command.Input autoFocus placeholder="Search apps, projects, skills…" />
                <kbd className="spot-esc">esc</kbd>
              </div>

              <Command.List>
                <Command.Empty>Nothing matches that.</Command.Empty>

                <Command.Group heading="Apps">
                  {APPS.map(a => (
                    <Command.Item key={a.id} value={`app ${a.name}`} onSelect={() => run(() => open(a.id))}>
                      <span className="spot-icon"><AppIcon kind={a.kind} size={20} src={COVER} /></span>
                      <span>{a.name}</span>
                      <span className="spot-tail">Open</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Projects">
                  {PROJECTS.map(p => (
                    <Command.Item
                      key={p.link}
                      value={`project ${p.title} ${p.stack} ${p.desc}`}
                      onSelect={() => run(() => window.open(p.link, "_blank", "noopener"))}>
                      <span className="spot-dot" />
                      <span>{p.title}</span>
                      <span className="spot-tail">{p.stack}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Stack">
                  {Object.entries(SKILLS).map(([group, items]) =>
                    items.map(tool => (
                      <Command.Item
                        key={`${group}-${tool}`}
                        value={`skill ${tool} ${group}`}
                        onSelect={() => run(() => open("stack"))}>
                        <span className="spot-dot" />
                        <span>{tool}</span>
                        <span className="spot-tail">{group}</span>
                      </Command.Item>
                    )))}
                </Command.Group>

                <Command.Group heading="Links">
                  {SOCIALS.filter(s => s.href).map(s => (
                    <Command.Item
                      key={s.id}
                      value={`link ${s.label} ${s.handle}`}
                      onSelect={() => run(() => window.open(s.href, "_blank", "noopener"))}>
                      <span className="spot-dot" />
                      <span>{s.label}</span>
                      <span className="spot-tail">{s.handle}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Wallpaper">
                  {THEMES.map(t => (
                    <Command.Item key={t.id} value={`theme ${t.name} wallpaper`} onSelect={() => run(() => setTheme(t.id))}>
                      <span className="spot-swatch" style={{ background: t.swatch }} />
                      <span>{t.name}</span>
                      <span className="spot-tail">Wallpaper</span>
                    </Command.Item>
                  ))}
                  <Command.Item value="reset desktop close all windows" onSelect={() => run(resetDesktop)}>
                    <span className="spot-dot" />
                    <span>Reset desktop</span>
                    <span className="spot-tail">Close every window</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </div>
    </div>
  );
}
