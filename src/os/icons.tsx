/* ─────────────────────────────────────────────
   DESKTOP ICONOGRAPHY
   Drawn with depth: a lit top edge, a body
   gradient and a contact shadow, so they read as
   objects at 60px rather than flat glyphs.
───────────────────────────────────────────── */

type P = { size?: number };

/** Shared soft shadow under every icon. */
const Shadow = () => (
  <ellipse cx="32" cy="57.5" rx="17" ry="3.1" fill="#000" opacity=".2" />
);

export function FolderIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="f-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fb6ee" /><stop offset="1" stopColor="#4a86cc" />
        </linearGradient>
        <linearGradient id="f-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bcdcfb" /><stop offset="0.5" stopColor="#8bbef2" />
          <stop offset="1" stopColor="#5b9ada" />
        </linearGradient>
      </defs>
      <Shadow />
      {/* back leaf */}
      <path d="M6 17a4 4 0 0 1 4-4h13.4a3 3 0 0 1 2.2 1l4.2 4.4H54a4 4 0 0 1 4 4v6H6z" fill="url(#f-back)" />
      {/* a sliver of paper poking out */}
      <rect x="15" y="19" width="34" height="7" rx="1.6" fill="#f4f1ea" opacity=".92" />
      {/* front leaf */}
      <path d="M6 23h52v25a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" fill="url(#f-front)" />
      <path d="M6 23h52v1.8H6z" fill="#fff" opacity=".55" />
      <path d="M8.6 50.4h46.8" stroke="#3f7cbe" strokeWidth="1" opacity=".4" />
    </svg>
  );
}

export function FolderAltIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="fa-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9b878" /><stop offset="1" stopColor="#b2894a" />
        </linearGradient>
        <linearGradient id="fa-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0d9a8" /><stop offset="0.5" stopColor="#dcbb7f" />
          <stop offset="1" stopColor="#c19a5c" />
        </linearGradient>
      </defs>
      <Shadow />
      <path d="M6 17a4 4 0 0 1 4-4h13.4a3 3 0 0 1 2.2 1l4.2 4.4H54a4 4 0 0 1 4 4v6H6z" fill="url(#fa-back)" />
      <rect x="15" y="19" width="34" height="7" rx="1.6" fill="#f7f3ea" opacity=".92" />
      <path d="M6 23h52v25a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" fill="url(#fa-front)" />
      <path d="M6 23h52v1.8H6z" fill="#fff" opacity=".5" />
      <path d="M8.6 50.4h46.8" stroke="#9d7736" strokeWidth="1" opacity=".4" />
    </svg>
  );
}

export function DocIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="d-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e6e2d9" />
        </linearGradient>
      </defs>
      <Shadow />
      <path d="M14 6h22.5L52 21.5V56a2.5 2.5 0 0 1-2.5 2.5h-35A2.5 2.5 0 0 1 12 56V8.5A2.5 2.5 0 0 1 14.5 6z"
        fill="url(#d-body)" stroke="#cfcabd" strokeWidth="1" />
      {/* folded corner */}
      <path d="M36.5 6L52 21.5H39a2.5 2.5 0 0 1-2.5-2.5z" fill="#d3cec2" />
      <path d="M36.5 6L52 21.5h-2.4L36.5 8.4z" fill="#bdb8ab" />
      <g stroke="#a8a496" strokeWidth="1.7" strokeLinecap="round">
        <path d="M20 30h24M20 37h24M20 44h24M20 51h15" />
      </g>
      <path d="M20 30h24" stroke="#c4462f" strokeWidth="1.7" strokeLinecap="round" opacity=".75" />
    </svg>
  );
}

export function TerminalIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="t-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#33333c" /><stop offset="1" stopColor="#141418" />
        </linearGradient>
      </defs>
      <Shadow />
      <rect x="6" y="9" width="52" height="45" rx="8" fill="url(#t-body)" />
      <rect x="6" y="9" width="52" height="45" rx="8" fill="none" stroke="#4a4a55" strokeWidth="1" />
      <path d="M6 17.5a8 8 0 0 1 8-8.5h36a8 8 0 0 1 8 8.5v.5H6z" fill="#3d3d47" />
      <circle cx="15" cy="14.4" r="2.5" fill="#ff5f57" />
      <circle cx="23.5" cy="14.4" r="2.5" fill="#febc2e" />
      <circle cx="32" cy="14.4" r="2.5" fill="#28c840" />
      <g stroke="#6ee7a8" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 30l7.5 6.5L16 43" />
      </g>
      <path d="M29 43.5h16" stroke="#6ee7a8" strokeWidth="2.8" strokeLinecap="round" opacity=".8" />
      {/* screen glare */}
      <path d="M6 20h52v10c-18 5-34 4-52 0z" fill="#fff" opacity=".045" />
    </svg>
  );
}

export function MailIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="m-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fd2ff" /><stop offset="1" stopColor="#2b7fd4" />
        </linearGradient>
      </defs>
      <Shadow />
      <rect x="6" y="14" width="52" height="36" rx="8" fill="url(#m-body)" />
      <path d="M6 22a8 8 0 0 1 8-8h36a8 8 0 0 1 8 8L32 39z" fill="#fff" opacity=".9" />
      <path d="M6 22L32 39l26-17v3.4L32 42.6 6 25.4z" fill="#1f6cb8" opacity=".5" />
      <rect x="6" y="14" width="52" height="36" rx="8" fill="none" stroke="#1f6cb8" strokeWidth="1" opacity=".5" />
    </svg>
  );
}

export function GridIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="g-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c3444" /><stop offset="1" stopColor="#161b25" />
        </linearGradient>
      </defs>
      <Shadow />
      <rect x="6" y="6" width="52" height="52" rx="13" fill="url(#g-body)" />
      <rect x="6" y="6" width="52" height="52" rx="13" fill="none" stroke="#495265" strokeWidth="1" />
      {[0, 1, 2].map(r => [0, 1, 2].map(c => {
        const mid = r === 1 && c === 1;
        return (
          <rect key={`${r}-${c}`} x={15 + c * 12.5} y={15 + r * 12.5} width="9.5" height="9.5" rx="2.8"
            fill={mid ? "#c4462f" : "#9aa3b5"} opacity={mid ? 1 : 0.9} />
        );
      }))}
      <path d="M6 19a13 13 0 0 1 13-13h26a13 13 0 0 1 13 13z" fill="#fff" opacity=".06" />
    </svg>
  );
}

export function PhotoIcon({ size = 64, src }: P & { src?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <clipPath id="ph-clip"><rect x="9" y="9" width="46" height="46" rx="4" /></clipPath>
      </defs>
      <Shadow />
      <rect x="5" y="5" width="54" height="54" rx="8" fill="#fdfcf9" />
      <rect x="5" y="5" width="54" height="54" rx="8" fill="none" stroke="#d6d1c6" strokeWidth="1" />
      {src
        ? <image href={src} x="9" y="9" width="46" height="46" clipPath="url(#ph-clip)" preserveAspectRatio="xMidYMid slice" />
        : <rect x="9" y="9" width="46" height="46" rx="4" fill="#cfd4dd" />}
      <path d="M9 9h46v14c-14 6-32 5-46 0z" fill="#fff" opacity=".14" clipPath="url(#ph-clip)" />
    </svg>
  );
}

export function MinesIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="ms-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2efe8" /><stop offset="1" stopColor="#cdc8bc" />
        </linearGradient>
        <radialGradient id="ms-ball" cx="0.35" cy="0.3">
          <stop offset="0" stopColor="#54545e" /><stop offset="1" stopColor="#141418" />
        </radialGradient>
      </defs>
      <Shadow />
      <rect x="6" y="6" width="52" height="52" rx="11" fill="url(#ms-body)" />
      <rect x="6" y="6" width="52" height="52" rx="11" fill="none" stroke="#b6b1a4" strokeWidth="1" />
      <path d="M6 18a12 12 0 0 1 12-12h28a12 12 0 0 1 12 12z" fill="#fff" opacity=".5" />
      <g fill="#1c1b1a">
        <path d="M30.4 13.5h3.2v6h-3.2zM30.4 44.5h3.2v6h-3.2z" />
        <path d="M13.5 30.4h6v3.2h-6zM44.5 30.4h6v3.2h-6z" />
        <path d="M18.6 20.9l2.3-2.3 4.2 4.2-2.3 2.3zM39.2 41.5l2.3-2.3 4.2 4.2-2.3 2.3zM43.4 18.6l2.3 2.3-4.2 4.2-2.3-2.3zM22.8 39.2l2.3 2.3-4.2 4.2-2.3-2.3z" />
      </g>
      <circle cx="32" cy="32" r="11.5" fill="url(#ms-ball)" />
      <circle cx="27.8" cy="27.8" r="3" fill="#fff" opacity=".55" />
    </svg>
  );
}

export function AppIcon({ kind, size = 64, src }: { kind: string; size?: number; src?: string }) {
  switch (kind) {
    case "mines":    return <MinesIcon size={size} />;
    case "folder":   return <FolderIcon size={size} />;
    case "folder-alt": return <FolderAltIcon size={size} />;
    case "doc":      return <DocIcon size={size} />;
    case "terminal": return <TerminalIcon size={size} />;
    case "mail":     return <MailIcon size={size} />;
    case "grid":     return <GridIcon size={size} />;
    case "photo":    return <PhotoIcon size={size} src={src} />;
    default:         return <DocIcon size={size} />;
  }
}

/* ── social glyphs, 16px line icons ─────────
   Keyed by Social.id from data.ts, so a row can
   draw itself without a label lookup table.
   These same paths get scaled up into the brand
   tiles in socials.tsx. */
export const Glyph = {
  github: (
    <path d="M8 .2a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4C3.8 14.4 3.4 13 3.4 13c-.3-.8-.8-1-.8-1-.6-.4 0-.4 0-.4.7 0 1.1.7 1.1.7.6 1.1 1.7.8 2.1.6 0-.5.3-.8.5-1-1.8-.2-3.6-.9-3.6-3.9 0-.9.3-1.6.8-2.1 0-.2-.3-1 .1-2.1 0 0 .7-.2 2.2.8a7.5 7.5 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.5.8 1.2.8 2.1 0 3-1.8 3.7-3.6 3.9.3.2.5.7.5 1.4v2.1c0 .2.1.5.6.4A8 8 0 0 0 8 .2z" />
  ),
  x: (
    <path d="M12.6 1.5h2.5l-5.4 6.2 6.4 8.5h-5l-3.9-5.1-4.5 5.1H.2l5.8-6.6L-.1 1.5h5.1l3.5 4.7zm-.9 13.2h1.4L4.4 2.9H2.9z" />
  ),
  linkedin: (
    <path d="M3.6 5.3H.6V16h3zM2.1.5a1.7 1.7 0 1 0 0 3.5 1.7 1.7 0 0 0 0-3.5zM16 9.7c0-2.9-1.6-4.3-3.7-4.3-1.7 0-2.5.9-2.9 1.6V5.3H6.4V16h3v-6c0-1.2.8-1.8 1.7-1.8s1.6.6 1.6 1.8v6h3z" />
  ),
  instagram: (
    <path d="M4.8.6h6.4A4.2 4.2 0 0 1 15.4 4.8v6.4a4.2 4.2 0 0 1-4.2 4.2H4.8A4.2 4.2 0 0 1 .6 11.2V4.8A4.2 4.2 0 0 1 4.8.6zm0 1.6A2.6 2.6 0 0 0 2.2 4.8v6.4a2.6 2.6 0 0 0 2.6 2.6h6.4a2.6 2.6 0 0 0 2.6-2.6V4.8a2.6 2.6 0 0 0-2.6-2.6zM8 4.2A3.8 3.8 0 1 1 8 11.8 3.8 3.8 0 0 1 8 4.2zm0 1.6a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4zm4.2-2.4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
  ),
  telegram: (
    <path d="M15.3 2.1L13.1 13.6c-.2.8-.7 1-1.4.6l-3.6-2.6-1.7 1.7c-.2.2-.4.3-.7.3l.3-3.6 6.6-6c.3-.3-.1-.4-.5-.2L3.9 8.9l-3.3-1c-.7-.2-.7-.7.1-1L14.2 1.2c.7-.2 1.3.2 1.1.9z" />
  ),
  email: (
    <path d="M1.5 2.5h13c.6 0 1 .4 1 1v9c0 .6-.4 1-1 1h-13c-.6 0-1-.4-1-1v-9c0-.6.4-1 1-1zm.4 1.7L8 8.9l6.1-4.7v-.2H1.9z" />
  ),
};

export type GlyphId = keyof typeof Glyph;

export function SocialIcon({ name, size = 15 }: { name: keyof typeof Glyph; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      {Glyph[name]}
    </svg>
  );
}
