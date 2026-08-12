import { useEffect, useState } from "react";
import { CONFIG } from "./config";

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
