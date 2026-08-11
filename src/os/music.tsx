import { CONFIG } from "./config";

/* ═════════════════════════════════════════════
   NOW PLAYING
   Takes whatever music link is in config —
   YouTube, YouTube Music or Spotify — and turns
   it into an embedded player.
═════════════════════════════════════════════ */

/** Convert a share link into its embeddable form. Returns null if we
    don't recognise it, so the widget can fall back rather than break. */
export function toEmbed(url: string): string | null {
  if (!url) return null;
  let u: URL;
  try { u = new URL(url); } catch { return null; }
  const host = u.hostname.replace(/^www\./, "");

  // youtu.be/<id>
  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  // youtube.com and music.youtube.com
  if (host.endsWith("youtube.com")) {
    const list = u.searchParams.get("list");
    const v = u.searchParams.get("v");
    if (list) return `https://www.youtube.com/embed/videoseries?list=${list}`;
    if (v) return `https://www.youtube.com/embed/${v}`;
    if (u.pathname.startsWith("/playlist")) return null;
    return null;
  }

  // open.spotify.com/<type>/<id>
  if (host === "open.spotify.com") {
    return `https://open.spotify.com/embed${u.pathname}`;
  }

  return null;
}

export function NowPlaying() {
  const link = CONFIG.music;
  const embed = toEmbed(link);

  return (
    <div className="w-card w-music">
      <p className="w-kicker">Now playing</p>

      {embed ? (
        <div className="w-player">
          <iframe
            src={embed}
            title="Now playing"
            loading="lazy"
            allow="encrypted-media; clipboard-write; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : (
        /* No link configured yet — stay visually complete rather than
           inventing a track that isn't playing. */
        <div className="w-music-empty">
          <span className="w-music-art">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20 3.5v12a3.2 3.2 0 1 1-1.8-2.9V7L10 8.7v9a3.2 3.2 0 1 1-1.8-2.9V5.9z" />
            </svg>
          </span>
          <span className="w-music-lines">
            <strong>Nothing queued</strong>
            <span>while building</span>
          </span>
        </div>
      )}

      <a className="w-music-link"
        href={link || "https://music.youtube.com"}
        target="_blank" rel="noreferrer">
        open in youtube music →
      </a>
    </div>
  );
}
