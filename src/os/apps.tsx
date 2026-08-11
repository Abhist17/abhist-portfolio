import { useEffect, useRef, useState } from "react";
import { ABOUT, EXP, ME, PROJECTS, SKILLS, SOCIALS, STATS } from "./data";
import { SocialIcon } from "./icons";
import type { AppId } from "./system";

/* ═════════════════════════════════════════════
   ABOUT — a text document
═════════════════════════════════════════════ */
function AboutApp() {
  return (
    <div className="doc">
      <div className="doc-head">
        <img className="doc-avatar" src={ME.avatar} alt="" />
        <div>
          <h2>{ME.name}</h2>
          <p className="muted">{ME.role} · {ME.location}</p>
        </div>
      </div>
      {ABOUT.map((p, i) => <p className="doc-p" key={i}>{p}</p>)}
      <div className="doc-stats">
        {STATS.map(([v, l]) => (
          <div key={l}>
            <strong>{v}</strong>
            <span className="muted">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════
   PROJECTS — a Finder-ish list view
═════════════════════════════════════════════ */
function ProjectsApp() {
  const [sel, setSel] = useState(0);
  const p = PROJECTS[sel];

  return (
    <div className="finder">
      <div className="finder-list" role="listbox" aria-label="Projects">
        <div className="finder-cols">
          <span>Name</span><span>Stack</span><span>Status</span>
        </div>
        {PROJECTS.map((it, i) => (
          <button
            key={it.n}
            role="option"
            aria-selected={i === sel}
            className={`finder-row ${i === sel ? "is-sel" : ""}`}
            onClick={() => setSel(i)}
            onDoubleClick={() => window.open(it.link, "_blank", "noreferrer")}>
            <span className="fr-name">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M1 4a1 1 0 0 1 1-1h4l1.5 1.5H14a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"
                  fill="currentColor" opacity=".55" />
              </svg>
              {it.title}
            </span>
            <span className="fr-stack">{it.stack}</span>
            <span className={`fr-status ${it.done ? "ok" : "wip"}`}>{it.done ? "Shipped" : "In progress"}</span>
          </button>
        ))}
      </div>

      <aside className="finder-detail">
        <p className="kicker">{p.n} — Project</p>
        <h3>{p.title}</h3>
        <p className="doc-p">{p.desc}</p>
        <dl className="meta">
          <div><dt>Stack</dt><dd>{p.stack}</dd></div>
          <div><dt>Status</dt><dd>{p.done ? "Shipped" : "In progress"}</dd></div>
        </dl>
        <a className="btn" href={p.link} target="_blank" rel="noreferrer">
          Open on GitHub
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 10L10 2M10 2H3.5M10 2V8.5" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </a>
        <p className="hint">Double-click a row to open it directly.</p>
      </aside>
    </div>
  );
}

/* ═════════════════════════════════════════════
   BACKGROUND — a record of roles
═════════════════════════════════════════════ */
function BackgroundApp() {
  return (
    <div className="doc">
      {EXP.map(e => (
        <a className="exp" key={e.org} href={e.link} target="_blank" rel="noreferrer">
          <span className="exp-period muted">{e.period}</span>
          <span className="exp-main">
            <strong>{e.org}</strong>
            <span className="muted">{e.role}</span>
            <span className="exp-desc">{e.desc}</span>
          </span>
          <svg className="exp-go" width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 10L10 2M10 2H3.5M10 2V8.5" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </a>
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════
   STACK
═════════════════════════════════════════════ */
function StackApp() {
  return (
    <div className="doc">
      {Object.entries(SKILLS).map(([cat, items]) => (
        <section className="stack-group" key={cat}>
          <p className="kicker">{cat}</p>
          <div className="chips">
            {items.map(s => <span className="chip" key={s}>{s}</span>)}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════
   CONTACT
═════════════════════════════════════════════ */
const GLYPH_FOR: Record<string, "github" | "twitter" | "linkedin" | "mail"> = {
  Email: "mail", Twitter: "twitter", GitHub: "github", LinkedIn: "linkedin",
};

function ContactApp() {
  return (
    <div className="doc">
      <p className="doc-p">
        Have a project? Say hello — I read everything.
      </p>
      <div className="links">
        {SOCIALS.map(s => {
          const external = !s.href.startsWith("mailto");
          return (
            <a className="link-row" key={s.label} href={s.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}>
              <span className="link-ico"><SocialIcon name={GLYPH_FOR[s.label]} /></span>
              <span className="link-label">{s.label}</span>
              <span className="link-handle muted">{s.handle}</span>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M2 10L10 2M10 2H3.5M10 2V8.5" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </a>
          );
        })}
      </div>
      <p className="hint">Based in {ME.location} · {ME.status}</p>
    </div>
  );
}

/* ═════════════════════════════════════════════
   PHOTO
═════════════════════════════════════════════ */
function PhotoApp() {
  return (
    <div className="photo-app">
      <img src={ME.avatar} alt={ME.name} />
      <p className="hint">Me.jpg — {ME.location}</p>
    </div>
  );
}

/* ═════════════════════════════════════════════
   TERMINAL — a real little shell
═════════════════════════════════════════════ */
type Line = { kind: "in" | "out" | "err"; text: string };

const BANNER: Line[] = [
  { kind: "out", text: `${ME.name} — abhist.dev shell` },
  { kind: "out", text: `Type "help" for the command list.` },
];

const FILES = ["about.txt", "projects/", "background/", "skills.txt", "contact.txt"];

function runCommand(raw: string, open: (id: AppId) => void): Line[] | "clear" {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  const arg = args.join(" ");

  switch (cmd) {
    case "":
      return [];

    case "help":
      return [
        { kind: "out", text: "help          this list" },
        { kind: "out", text: "whoami        who is this" },
        { kind: "out", text: "ls            list files" },
        { kind: "out", text: "cat <file>    read a file" },
        { kind: "out", text: "projects      list the repos" },
        { kind: "out", text: "background    roles and education" },
        { kind: "out", text: "skills        the stack" },
        { kind: "out", text: "contact       how to reach me" },
        { kind: "out", text: "open <app>    open an app window" },
        { kind: "out", text: "neofetch      system info" },
        { kind: "out", text: "clear         clear the screen" },
      ];

    case "whoami":
      return [
        { kind: "out", text: `${ME.name} — ${ME.role}` },
        { kind: "out", text: `${ME.location} · ${ME.status}` },
      ];

    case "ls":
      return [{ kind: "out", text: FILES.join("   ") }];

    case "cat": {
      if (!arg) return [{ kind: "err", text: "cat: missing file operand" }];
      const f = arg.replace(/\/$/, "");
      if (f === "about.txt")   return ABOUT.map(t => ({ kind: "out" as const, text: t }));
      if (f === "skills.txt")  return Object.entries(SKILLS).map(([c, i]) => ({ kind: "out" as const, text: `${c.padEnd(12)} ${i.join(", ")}` }));
      if (f === "contact.txt") return SOCIALS.map(s => ({ kind: "out" as const, text: `${s.label.padEnd(10)} ${s.handle}` }));
      if (f === "projects")    return PROJECTS.map(p => ({ kind: "out" as const, text: `${p.n}  ${p.title}` }));
      if (f === "background")  return EXP.map(e => ({ kind: "out" as const, text: `${e.period.padEnd(11)} ${e.org} — ${e.role}` }));
      return [{ kind: "err", text: `cat: ${arg}: No such file or directory` }];
    }

    case "projects":
      return PROJECTS.map(p => ({
        kind: "out" as const,
        text: `${p.n}  ${p.title.padEnd(24)} ${p.done ? "shipped" : "wip    "}  ${p.link}`,
      }));

    case "background":
      return EXP.map(e => ({ kind: "out" as const, text: `${e.period.padEnd(11)} ${e.org} — ${e.role}` }));

    case "skills":
      return Object.entries(SKILLS).map(([c, i]) => ({ kind: "out" as const, text: `${c.padEnd(12)} ${i.join(", ")}` }));

    case "contact":
      return SOCIALS.map(s => ({ kind: "out" as const, text: `${s.label.padEnd(10)} ${s.href}` }));

    case "open": {
      const valid: AppId[] = ["about", "projects", "background", "stack", "contact", "terminal", "photo"];
      const target = arg as AppId;
      if (valid.includes(target)) { open(target); return [{ kind: "out", text: `opening ${target}…` }]; }
      return [{ kind: "err", text: `open: unknown app "${arg}". try: ${valid.join(", ")}` }];
    }

    case "neofetch":
      return [
        { kind: "out", text: `user@abhist.dev` },
        { kind: "out", text: `───────────────` },
        { kind: "out", text: `OS       AbhistOS 1.0` },
        { kind: "out", text: `Host     ${ME.location}` },
        { kind: "out", text: `Shell    web3-sh` },
        { kind: "out", text: `Uptime   ${STATS[0][0]} in Web3` },
        { kind: "out", text: `Repos    ${PROJECTS.length}` },
        { kind: "out", text: `Stack    ${Object.values(SKILLS).flat().length} tools` },
      ];

    case "sudo":
      return [{ kind: "err", text: "nice try." }];

    case "clear":
      return "clear";

    default:
      return [{ kind: "err", text: `command not found: ${cmd} — try "help"` }];
  }
}

function TerminalApp({ open }: { open: (id: AppId) => void }) {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = value;
    const result = runCommand(raw, open);
    setHistory(h => [raw, ...h].slice(0, 50));
    setHIdx(-1);
    setValue("");
    if (result === "clear") { setLines([]); return; }
    setLines(l => [...l, { kind: "in", text: raw }, ...result]);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(hIdx + 1, history.length - 1);
      if (next >= 0) { setHIdx(next); setValue(history[next]); }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = hIdx - 1;
      setHIdx(next);
      setValue(next >= 0 ? history[next] : "");
    }
  };

  return (
    <div className="term" onClick={() => inputRef.current?.focus()}>
      <div className="term-body" ref={bodyRef}>
        {lines.map((l, i) => (
          <p key={i} className={`term-line term-${l.kind}`}>
            {l.kind === "in" && <span className="term-prompt">$&nbsp;</span>}
            {l.text}
          </p>
        ))}
        <form className="term-input" onSubmit={submit}>
          <span className="term-prompt">$&nbsp;</span>
          <input
            ref={inputRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal input"
          />
        </form>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════
   REGISTRY
═════════════════════════════════════════════ */
export function AppBody({ id, open }: { id: AppId; open: (a: AppId) => void }) {
  switch (id) {
    case "about":      return <AboutApp />;
    case "projects":   return <ProjectsApp />;
    case "background": return <BackgroundApp />;
    case "stack":      return <StackApp />;
    case "contact":    return <ContactApp />;
    case "photo":      return <PhotoApp />;
    case "terminal":   return <TerminalApp open={open} />;
    default:           return null;
  }
}
