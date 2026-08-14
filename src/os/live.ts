import { useEffect, useState } from "react";
import { CONFIG } from "./config";
import { WRITING, type Post } from "./data";

/* ═════════════════════════════════════════════
   LIVE DATA
   Every endpoint here is public, key-less and
   CORS-open. Results are cached in localStorage
   so a reload doesn't burn the rate limit, and
   every hook fails quiet — a widget that can't
   load simply doesn't render.
═════════════════════════════════════════════ */

type Result<T> = { data: T | null; loading: boolean; failed: boolean };

function readCache<T>(key: string, ttlMs: number): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw);
    if (Date.now() - at > ttlMs) return null;
    return data as T;
  } catch { return null; }
}

function writeCache(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify({ at: Date.now(), data })); } catch { /* private mode */ }
}

function useJson<T>(key: string, url: string | null, ttlMs: number, map: (raw: never) => T): Result<T> {
  const [state, setState] = useState<Result<T>>(() => {
    const cached = url ? readCache<T>(key, ttlMs) : null;
    return { data: cached, loading: !!url && !cached, failed: false };
  });

  useEffect(() => {
    if (!url) { setState({ data: null, loading: false, failed: false }); return; }
    if (readCache<T>(key, ttlMs)) return;

    let alive = true;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);

    fetch(url, { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(raw => {
        if (!alive) return;
        const data = map(raw as never);
        writeCache(key, data);
        setState({ data, loading: false, failed: false });
      })
      .catch(() => { if (alive) setState({ data: null, loading: false, failed: true }); })
      .finally(() => clearTimeout(timer));

    return () => { alive = false; ctrl.abort(); clearTimeout(timer); };
    // url is the only real input; map/ttl are stable per call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, key]);

  return state;
}

/* ── GitHub ───────────────────────────────── */
export type GitHubStats = {
  repos: number; followers: number; stars: number; updated: string | null;
};

export function useGitHub(): Result<GitHubStats> {
  const user = CONFIG.github;
  return useJson<GitHubStats>(
    `abhistos.gh.${user}`,
    user ? `https://api.github.com/users/${user}/repos?per_page=100&sort=pushed` : null,
    30 * 60 * 1000,
    (raw: never) => {
      const repos = raw as unknown as { stargazers_count: number; pushed_at: string; fork: boolean }[];
      const own = repos.filter(r => !r.fork);
      return {
        repos: own.length,
        followers: 0,
        stars: own.reduce((n, r) => n + (r.stargazers_count || 0), 0),
        updated: own.length ? own[0].pushed_at : null,
      };
    },
  );
}

/** Recent public activity, bucketed by day — GitHub's REST API doesn't
    expose the contribution graph, so this is the honest version of it. */
export function useGitHubActivity(days = 21): Result<number[]> {
  const user = CONFIG.github;
  return useJson<number[]>(
    `abhistos.ghact.${user}.${days}`,
    user ? `https://api.github.com/users/${user}/events/public?per_page=100` : null,
    30 * 60 * 1000,
    (raw: never) => {
      const events = raw as unknown as { created_at: string }[];
      const buckets = new Array(days).fill(0);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      for (const e of events) {
        const d = new Date(e.created_at); d.setHours(0, 0, 0, 0);
        const ago = Math.floor((today.getTime() - d.getTime()) / 86400000);
        if (ago >= 0 && ago < days) buckets[days - 1 - ago] += 1;
      }
      return buckets;
    },
  );
}

/* ── Weather (Open-Meteo, no key) ─────────── */
export type Weather = { temp: number; code: number; wind: number };

export function useWeather(): Result<Weather> {
  const { lat, lon } = CONFIG.place;
  return useJson<Weather>(
    `abhistos.wx.${lat},${lon}`,
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m`,
    20 * 60 * 1000,
    (raw: never) => {
      const r = raw as unknown as { current: { temperature_2m: number; weather_code: number; wind_speed_10m: number } };
      return { temp: Math.round(r.current.temperature_2m), code: r.current.weather_code, wind: Math.round(r.current.wind_speed_10m) };
    },
  );
}

/** WMO weather codes → something a human says. */
export function weatherText(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 2) return "Mostly clear";
  if (code === 3) return "Overcast";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorm";
}

/* ── Codeforces ───────────────────────────── */
export type CFStats = { rating: number | null; rank: string | null; maxRating: number | null };

export function useCodeforces(): Result<CFStats> {
  const handle = CONFIG.codeforces;
  return useJson<CFStats>(
    `abhistos.cf.${handle}`,
    handle ? `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}` : null,
    60 * 60 * 1000,
    (raw: never) => {
      const r = raw as unknown as { status: string; result: { rating?: number; rank?: string; maxRating?: number }[] };
      const u = r.result?.[0] ?? {};
      return { rating: u.rating ?? null, rank: u.rank ?? null, maxRating: u.maxRating ?? null };
    },
  );
}

/* ── Medium ───────────────────────────────
   Medium serves RSS, not JSON, and sends no
   Access-Control-Allow-Origin — so unlike every
   other endpoint here it cannot be read from the
   browser directly. rss2json is a free keyless
   relay that fetches the feed server-side and
   answers with the header. It is the one third
   party in this file, which is exactly why
   WRITING in data.ts exists: this hook failing
   costs the newest posts, never the app. */
export function useMedium(): Result<Post[]> {
  const handle = CONFIG.medium;
  const feed = handle ? `https://medium.com/feed/@${handle}` : null;
  return useJson<Post[]>(
    `abhistos.medium.${handle}`,
    feed ? `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}` : null,
    6 * 60 * 60 * 1000,
    (raw: never) => {
      const r = raw as unknown as {
        status: string;
        items?: { title: string; link: string; pubDate: string; categories?: string[]; description?: string; content?: string }[];
      };
      /* rss2json answers 200 with status:"error" when the feed itself failed,
         so an ok response is not on its own a successful read. */
      if (r.status !== "ok" || !r.items?.length) throw new Error("feed");
      return r.items.map(it => {
        const raw = stripHtml(it.content || it.description || "");

        /* Medium opens every RSS body with its own "Estimated read time: N
           minutes" line. It is not prose — left in, it becomes the first thing
           the deck says — but the number in it is Medium's own count, which
           beats anything derived from a truncated feed body. */
        const stamp = raw.match(/^Estimated read time:\s*(\d+)\s*minutes?\s*/i);
        const body = stamp ? raw.slice(stamp[0].length) : raw;

        return {
          /* the ?source=rss-… suffix is tracking, and it is what would stop a
             live post from matching its hand-written twin */
          link: it.link.split("?")[0],
          title: it.title.trim(),
          deck: clip(body, 180),
          date: new Date(it.pubDate.replace(" ", "T") + "Z").toISOString().slice(0, 10),
          /* Medium's own estimate is ~265 words a minute */
          read: stamp
            ? Number(stamp[1])
            : Math.max(1, Math.round(body.split(/\s+/).length / 265)),
          tags: (it.categories ?? []).map(titleCase),
        };
      });
    },
  );
}

/** Feed HTML → the plain prose under it. DOMParser rather than a regex,
    because the description is arbitrary markup and entities need decoding. */
function stripHtml(html: string): string {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll("figure, figcaption, style, script").forEach(n => n.remove());
    return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
  } catch { return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(); }
}

/** Cut to a whole word — a deck that ends "conversations fo…" reads as broken
    rather than as abridged. */
function clip(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.–—-]+$/, "")}…`;
}

/* Medium's tags arrive lower-cased and hyphenated. Joining words stay down —
   "India and Crypto", not "India And Crypto" — except as the first word. */
const SMALL = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "in", "of", "on", "or", "the", "to", "vs", "with"]);

const titleCase = (s: string) =>
  s.trim().split(/[\s-]+/)
    .map((w, i) => (i > 0 && SMALL.has(w.toLowerCase())
      ? w.toLowerCase()
      : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

/** The live feed under the written-down copy, not over it.
    Anything in WRITING is authored — its deck is a real summary rather than
    the first 180 characters of the body, its tags are spelled the way they
    should read, and its read time is Medium's own. So a hand-written entry
    wins outright on a link match, exactly as the curated projects win over
    GitHub's one-liners; the feed's job is to carry the pieces that have not
    been written down here yet. Newest first either way. */
export function mergePosts(live: Post[] | null): Post[] {
  const byLink = new Map<string, Post>();
  for (const p of live ?? []) byLink.set(p.link.split("?")[0], p);
  for (const p of WRITING) byLink.set(p.link.split("?")[0], p);
  return [...byLink.values()].sort((a, b) => b.date.localeCompare(a.date));
}

/* ── Repositories ─────────────────────────── */
export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  homepage: string | null;
  pushedAt: string;
  isFork: boolean;
  archived: boolean;
};

export function useRepos(): Result<Repo[]> {
  const user = CONFIG.github;
  return useJson<Repo[]>(
    `abhistos.repos.${user}`,
    user ? `https://api.github.com/users/${user}/repos?per_page=100&sort=pushed` : null,
    30 * 60 * 1000,
    (raw: never) => {
      const rs = raw as unknown as Record<string, unknown>[];
      return rs.map(r => ({
        name: String(r.name),
        description: (r.description as string) ?? null,
        language: (r.language as string) ?? null,
        stars: Number(r.stargazers_count ?? 0),
        forks: Number(r.forks_count ?? 0),
        url: String(r.html_url),
        homepage: (r.homepage as string) || null,
        pushedAt: String(r.pushed_at),
        isFork: Boolean(r.fork),
        archived: Boolean(r.archived),
      }));
    },
  );
}

/** GitHub's own language colours, so the dots read as familiar. */
export const LANG_COLOR: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572a5",
  Rust: "#dea584", C: "#555555", "C++": "#f34b7d", HTML: "#e34c26",
  CSS: "#563d7c", "Jupyter Notebook": "#da5b0b", Solidity: "#aa6746",
  Shell: "#89e051", Go: "#00add8", Java: "#b07219",
};

export function timeAgo(iso: string): string {
  const secs = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const steps: [number, string][] = [
    [31536000, "year"], [2592000, "month"], [604800, "week"],
    [86400, "day"], [3600, "hour"], [60, "minute"],
  ];
  for (const [size, label] of steps) {
    const n = Math.floor(secs / size);
    if (n >= 1) return `${n} ${label}${n > 1 ? "s" : ""} ago`;
  }
  return "just now";
}
