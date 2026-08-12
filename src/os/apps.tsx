import { useEffect, useMemo, useRef, useState } from "react";
import { lazy, Suspense } from "react";
import { ABOUT, EXP, ME, PROJECTS, SKILLS, SOCIALS, STATS } from "./data";
import { SocialIcon } from "./icons";
import { ToolIcon, findTool } from "./tech";
import { LANG_COLOR, timeAgo, useRepos, type Repo } from "./live";
import { CONFIG } from "./config";
import type { AppId } from "./system";

/* Every app opens with its own title, the way a real app does. */
function AppHead({ title, sub }: { title: string; sub: string }) {
  return (
    <header className="app-head">
      <h2>{title}</h2>
      <p>{sub}</p>
    </header>
  );
}

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
   PROJECTS — live from GitHub
═════════════════════════════════════════════ */
type Sort = "recent" | "stars" | "name";

/** A row is either a live repo, one of the hand-written entries, or both. */
type Entry = {
  key: string;
  title: string;
  desc: string;
  link: string;
  language: string | null;
  stars: number;
  pushedAt: string | null;
  featured: boolean;
  isFork: boolean;
  archived: boolean;
  stack: string | null;
  done: boolean | null;
};

const repoSlug = (url: string) => url.replace(/\/+$/, "").split("/").pop()!.toLowerCase();

/** Curated notes win over GitHub's one-liners; everything else comes live. */
function buildEntries(repos: Repo[] | null): Entry[] {
  const curated = new Map(PROJECTS.map(p => [repoSlug(p.link), p]));
  const out: Entry[] = [];
  const seen = new Set<string>();

  for (const r of repos ?? []) {
    const slug = r.name.toLowerCase();
    const c = curated.get(slug);
    /* forks are noise unless they were hand-picked */
    if (r.isFork && !c) continue;
    /* starring your own repo on GitHub is what publishes it here */
    if (r.stars < CONFIG.minStars) continue;
    seen.add(slug);
    out.push({
      key: slug,
      title: c?.title ?? r.name,
      desc: c?.desc ?? r.description ?? "No description yet.",
      link: r.url,
      language: r.language,
      stars: r.stars,
      pushedAt: r.pushedAt,
      featured: !!c,
      isFork: r.isFork,
      archived: r.archived,
      stack: c?.stack ?? null,
      done: c?.done ?? null,
    });
  }

  /* if GitHub is unreachable, fall back to the curated set so the
     window is never empty */
  if (repos && repos.length) return out;
  for (const p of PROJECTS) {
    const slug = repoSlug(p.link);
    if (seen.has(slug)) continue;
    out.push({
      key: slug, title: p.title, desc: p.desc, link: p.link,
      language: null, stars: 0, pushedAt: null, featured: true,
      isFork: false, archived: false, stack: p.stack, done: p.done,
    });
  }
  return out;
}

function ProjectsApp() {
  const { data: repos, loading, failed } = useRepos();
  const [sel, setSel] = useState(0);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("recent");

  const all = useMemo(() => buildEntries(repos), [repos]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = all.filter(e => {
      if (!needle) return true;
      return (
        e.title.toLowerCase().includes(needle) ||
        e.desc.toLowerCase().includes(needle) ||
        (e.language ?? "").toLowerCase().includes(needle)
      );
    });
    const sorted = filtered.slice();
    if (sort === "stars") sorted.sort((a, b) => b.stars - a.stars || a.title.localeCompare(b.title));
    else if (sort === "name") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else sorted.sort((a, b) => (b.pushedAt ?? "").localeCompare(a.pushedAt ?? ""));
    /* featured float to the top so the good work leads */
    return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [all, q, sort]);

  const p = list[Math.min(sel, list.length - 1)];

  return (
    <div className="app">
      <AppHead
        title="Projects"
        sub={loading && !all.length
          ? "loading from github…"
          : `${list.length} starred ${list.length === 1 ? "repository" : "repositories"}${failed ? " · offline copy" : " · live from github"}`}
      />

      <div className="proj-tools">
        <label className="search">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.8 10.8L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setSel(0); }}
            placeholder="Search projects, languages…"
            aria-label="Search projects"
          />
        </label>
        <div className="seg seg-sm">
          {(["recent", "stars", "name"] as Sort[]).map(sv => (
            <button key={sv} className={sort === sv ? "on" : ""} onClick={() => setSort(sv)}>{sv}</button>
          ))}
        </div>
      </div>

      <div className="finder">
        <div className="finder-list" role="listbox" aria-label="Projects">
          {list.map((it, i) => (
            <button
              key={it.key}
              role="option"
              aria-selected={i === sel}
              className={`repo-row ${i === sel ? "is-sel" : ""}`}
              onClick={() => setSel(i)}
              onDoubleClick={() => window.open(it.link, "_blank", "noreferrer")}>
              <span className="repo-main">
                <span className="repo-name">
                  {it.title}
                  {it.featured && <span className="repo-star" title="Featured">★</span>}
                  {it.isFork && <span className="repo-tag">fork</span>}
                  {it.archived && <span className="repo-tag">archived</span>}
                </span>
                <span className="repo-desc">{it.desc}</span>
              </span>
              <span className="repo-meta">
                {it.language && (
                  <span className="repo-lang">
                    <i style={{ background: LANG_COLOR[it.language] ?? "#8a8a93" }} />
                    {it.language}
                  </span>
                )}
                {it.stars > 0 && <span className="repo-stars">★ {it.stars}</span>}
                {it.pushedAt && <span className="repo-time">{timeAgo(it.pushedAt)}</span>}
              </span>
            </button>
          ))}
          {!list.length && (
            <p className="repo-empty">{loading ? "Loading…" : "Nothing matches that search."}</p>
          )}
        </div>

        {p && (
          <aside className="finder-detail">
            <p className="kicker">{p.featured ? "Featured project" : "Repository"}</p>
            <h3>{p.title}</h3>
            <p className="doc-p">{p.desc}</p>
            <dl className="meta">
              {p.stack     && <div><dt>Stack</dt><dd>{p.stack}</dd></div>}
              {p.language  && <div><dt>Lang</dt><dd>{p.language}</dd></div>}
              <div><dt>Stars</dt><dd>{p.stars}</dd></div>
              {p.pushedAt  && <div><dt>Updated</dt><dd>{timeAgo(p.pushedAt)}</dd></div>}
              {p.done !== null && <div><dt>Status</dt><dd>{p.done ? "Shipped" : "In progress"}</dd></div>}
            </dl>
            <a className="btn" href={p.link} target="_blank" rel="noreferrer">
              Open on GitHub
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M2 10L10 2M10 2H3.5M10 2V8.5" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </a>
            <p className="hint">Double-click a row to open it directly.</p>
          </aside>
        )}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════
   BACKGROUND — a record of roles
═════════════════════════════════════════════ */
function BackgroundApp() {
  return (
    <div className="app">
      <AppHead title="Background" sub={`${EXP.length} roles & education`} />
      <div className="doc" style={{ overflow: "auto" }}>
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
    </div>
  );
}

/* ═════════════════════════════════════════════
   STACK
═════════════════════════════════════════════ */
function StackApp() {
  const total = Object.values(SKILLS).flat().length;
  return (
    <div className="app">
      <AppHead title="Tech Stack" sub={`${total} tools across ${Object.keys(SKILLS).length} areas`} />
      <div className="doc" style={{ overflow: "auto" }}>
        {Object.entries(SKILLS).map(([cat, items]) => (
          <section className="stack-group" key={cat}>
            <p className="kicker">{cat}</p>
            <div className="tool-grid">
              {items.map(name => {
                const tool = findTool(name);
                return (
                  <div className="tool" key={name}>
                    <span className="tool-art">
                      {tool
                        ? <ToolIcon tool={tool} size={46} />
                        : <span className="tool-fallback">{name.slice(0, 2)}</span>}
                    </span>
                    <span className="tool-name">{name}</span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
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
    <div className="app">
      <AppHead title="Contact" sub={`${SOCIALS.length} ways to reach me`} />
      <div className="doc" style={{ overflow: "auto" }}>
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

/* the game only loads when someone actually opens it */
const MinesApp = lazy(() => import("./games/MinesApp"));

/* ═════════════════════════════════════════════
   REGISTRY
═════════════════════════════════════════════ */
export function AppBody({ id, open }: { id: AppId; open: (a: AppId) => void }) {
  switch (id) {
    case "mines": return (
      <Suspense fallback={<div className="doc"><p className="muted">Loading…</p></div>}>
        <MinesApp />
      </Suspense>
    );
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
