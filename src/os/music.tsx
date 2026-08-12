import { useCallback, useEffect, useRef, useState } from "react";
import { CONFIG } from "./config";

/* ═════════════════════════════════════════════
   NOW PLAYING
   A real player, not a link. The YouTube iframe
   does the playing but stays hidden — the widget
   draws its own transport, so it looks like part
   of the OS rather than a pasted-in embed.

   Nothing autoplays: browsers block it and it
   would be rude anyway. First click starts it.
═════════════════════════════════════════════ */

type Source =
  | { kind: "playlist"; id: string }
  | { kind: "video"; id: string }
  | { kind: "spotify"; url: string };

/** Read whatever link is in config: playlist, single track, or Spotify. */
export function readSource(url: string): Source | null {
  if (!url) return null;
  let u: URL;
  try { u = new URL(url); } catch { return null; }
  const host = u.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const list = u.searchParams.get("list");
    if (list) return { kind: "playlist", id: list };
    const id = u.pathname.slice(1);
    return id ? { kind: "video", id } : null;
  }

  if (host.endsWith("youtube.com")) {
    const list = u.searchParams.get("list");
    if (list) return { kind: "playlist", id: list };
    const v = u.searchParams.get("v");
    if (v) return { kind: "video", id: v };
    return null;
  }

  if (host === "open.spotify.com") return { kind: "spotify", url: `https://open.spotify.com/embed${u.pathname}` };

  return null;
}

/* ── the YouTube iframe API, loaded once ──────
   The script tag is shared: several players can
   ask for it, only one download happens. */
type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  nextVideo(): void;
  previousVideo(): void;
  setVolume(v: number): void;
  getPlayerState(): number;
  getCurrentTime(): number;
  getDuration(): number;
  getVideoData(): { title?: string; author?: string; video_id?: string };
  destroy(): void;
};

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => YTPlayer; PlayerState: Record<string, number> };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

function loadApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>(resolve => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(); };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  });
  return apiPromise;
}

const mmss = (s: number) => {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

/* ═════════════════════════════════════════════
   THE WIDGET
═════════════════════════════════════════════ */
export function NowPlaying() {
  const link = CONFIG.music;
  const source = readSource(link);

  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState<{ title: string; by: string; id: string } | null>(null);
  const [time, setTime] = useState({ at: 0, of: 0 });
  const [broken, setBroken] = useState(false);
  /* labels blocked from embedding are common in a music playlist — those
     tracks get skipped rather than taking the whole widget down */
  const skipped = useRef(0);

  const isYouTube = source?.kind === "playlist" || source?.kind === "video";

  /* build the player once, then leave it alone */
  useEffect(() => {
    if (!isYouTube || !mountRef.current) return;
    let dead = false;

    loadApi().then(() => {
      if (dead || !mountRef.current || !window.YT?.Player) return;
      const common = {
        height: "0", width: "0",
        playerVars: {
          controls: 0, disablekb: 1, playsinline: 1, rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: () => { if (!dead) setReady(true); },
          onStateChange: (e: { data: number }) => {
            if (dead) return;
            /* 1 = playing, 2 = paused, 0 = ended */
            setPlaying(e.data === 1);
            /* a track that actually plays clears the skip budget */
            if (e.data === 1) skipped.current = 0;
          },
          onError: () => {
            if (dead) return;
            /* step over an unplayable track; give up once the whole
               neighbourhood of the playlist refuses */
            if (source!.kind === "playlist" && skipped.current < 5) {
              skipped.current += 1;
              try { playerRef.current?.nextVideo(); return; } catch { /* fall through */ }
            }
            setBroken(true);
          },
        },
      };
      playerRef.current = new window.YT.Player(
        mountRef.current,
        source!.kind === "playlist"
          ? { ...common, playerVars: { ...common.playerVars, listType: "playlist", list: source!.id } }
          : { ...common, videoId: source!.id },
      );
    }).catch(() => setBroken(true));

    return () => {
      dead = true;
      try { playerRef.current?.destroy(); } catch { /* already gone */ }
      playerRef.current = null;
    };
  }, [isYouTube, source?.kind, source && "id" in source ? source.id : ""]);

  /* poll the player for what's on and how far in — the API has no event for it */
  useEffect(() => {
    if (!ready) return;
    const read = () => {
      const p = playerRef.current;
      if (!p) return;
      try {
        const d = p.getVideoData();
        if (d?.title) setTrack({ title: d.title, by: d.author ?? "", id: d.video_id ?? "" });
        setTime({ at: p.getCurrentTime(), of: p.getDuration() });
      } catch { /* the iframe is mid-navigation */ }
    };
    read();
    const id = setInterval(read, 1000);
    return () => clearInterval(id);
  }, [ready]);

  const toggle = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo(); else p.playVideo();
  }, [playing]);

  const skip = useCallback((d: 1 | -1) => {
    const p = playerRef.current;
    if (!p) return;
    if (d === 1) p.nextVideo(); else p.previousVideo();
  }, []);

  /* Spotify has no comparable API without auth, so that one stays an embed */
  if (source?.kind === "spotify") {
    return (
      <div className="w-card w-music">
        <p className="w-kicker">Now playing</p>
        <div className="w-player">
          <iframe src={source.url} title="Now playing" loading="lazy"
            allow="encrypted-media; clipboard-write; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin" />
        </div>
        <a className="w-music-link" href={link} target="_blank" rel="noreferrer">open in spotify →</a>
      </div>
    );
  }

  /* no link configured, or the link isn't one we can play */
  if (!isYouTube || broken) {
    return (
      <div className="w-card w-music">
        <p className="w-kicker">Now playing</p>
        <div className="w-music-empty">
          <span className="w-music-art">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20 3.5v12a3.2 3.2 0 1 1-1.8-2.9V7L10 8.7v9a3.2 3.2 0 1 1-1.8-2.9V5.9z" />
            </svg>
          </span>
          <span className="w-music-lines">
            <strong>{broken ? "Track unavailable" : "Nothing queued"}</strong>
            <span>while building</span>
          </span>
        </div>
        <a className="w-music-link" href={link || "https://music.youtube.com"} target="_blank" rel="noreferrer">
          open in youtube music →
        </a>
      </div>
    );
  }

  const pct = time.of > 0 ? Math.min(100, (time.at / time.of) * 100) : 0;

  return (
    <div className={`w-card w-music ${playing ? "is-playing" : ""}`}>
      <p className="w-kicker">Now playing</p>

      {/* the player itself — present, sized to nothing */}
      <div className="yt-host"><div ref={mountRef} /></div>

      <div className="np">
        <span className="np-art">
          {track?.id
            ? <img src={`https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`} alt="" />
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20 3.5v12a3.2 3.2 0 1 1-1.8-2.9V7L10 8.7v9a3.2 3.2 0 1 1-1.8-2.9V5.9z" />
              </svg>}
          {/* four bars that only dance while sound is coming out */}
          <span className="np-eq" aria-hidden><i /><i /><i /><i /></span>
        </span>

        <span className="np-lines">
          <strong title={track?.title}>{track?.title ?? (ready ? "Ready when you are" : "Loading…")}</strong>
          <span>{track?.by || (source?.kind === "playlist" ? "from my playlist" : "on repeat")}</span>
        </span>
      </div>

      <div className="np-track" aria-hidden>
        <i style={{ width: `${pct}%` }} />
      </div>

      <div className="np-row">
        <span className="np-time">{mmss(time.at)} / {mmss(time.of)}</span>
        <div className="np-btns">
          {source?.kind === "playlist" && (
            <button className="np-btn" onClick={() => skip(-1)} disabled={!ready} aria-label="Previous track">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M4 3h2v10H4zm9 0v10L6.5 8z" />
              </svg>
            </button>
          )}
          <button className="np-btn np-play" onClick={toggle} disabled={!ready}
            aria-label={playing ? "Pause" : "Play"}>
            {playing
              ? <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M4 3h3v10H4zm5 0h3v10H9z" /></svg>
              : <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M4.5 2.8L13 8l-8.5 5.2z" /></svg>}
          </button>
          {source?.kind === "playlist" && (
            <button className="np-btn" onClick={() => skip(1)} disabled={!ready} aria-label="Next track">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M10 3h2v10h-2zM3 3l6.5 5L3 13z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <a className="w-music-link" href={link} target="_blank" rel="noreferrer">
        {source?.kind === "playlist" ? "open the playlist →" : "open in youtube →"}
      </a>
    </div>
  );
}
