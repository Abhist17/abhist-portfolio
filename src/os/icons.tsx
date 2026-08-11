/* ─────────────────────────────────────────────
   Hand-drawn SVG iconography.
   No emoji, no icon font — the desktop needs
   icons that hold up at 64px.
───────────────────────────────────────────── */

type P = { size?: number };

export function FolderIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="fld-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fc4f5" /><stop offset="1" stopColor="#4a90d9" />
        </linearGradient>
        <linearGradient id="fld-f" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8d4fa" /><stop offset="1" stopColor="#5ea3e6" />
        </linearGradient>
      </defs>
      <path d="M5 16a4 4 0 0 1 4-4h15l6 6h25a4 4 0 0 1 4 4v9H5z" fill="url(#fld-b)" />
      <path d="M5 22h54v27a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" fill="url(#fld-f)" />
      <path d="M5 22h54v3H5z" fill="#fff" opacity=".28" />
    </svg>
  );
}

export function DocIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M14 6h24l14 14v38a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="#fdfdfb" />
      <path d="M38 6l14 14H40a2 2 0 0 1-2-2z" fill="#d8d6d0" />
      <g stroke="#b9b6ae" strokeWidth="1.6" strokeLinecap="round">
        <path d="M20 30h24M20 37h24M20 44h16" />
      </g>
    </svg>
  );
}

export function TerminalIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="5" y="9" width="54" height="46" rx="7" fill="#16161a" />
      <rect x="5" y="9" width="54" height="12" rx="7" fill="#2b2b31" />
      <rect x="5" y="16" width="54" height="5" fill="#2b2b31" />
      <circle cx="14" cy="15" r="2.4" fill="#ff5f57" />
      <circle cx="22" cy="15" r="2.4" fill="#febc2e" />
      <circle cx="30" cy="15" r="2.4" fill="#28c840" />
      <g stroke="#6ee7a8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 31l7 6-7 6" />
      </g>
      <path d="M27 43h14" stroke="#6ee7a8" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function MailIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="ml" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fd0ff" /><stop offset="1" stopColor="#2f8de0" />
        </linearGradient>
      </defs>
      <rect x="5" y="14" width="54" height="36" rx="7" fill="url(#ml)" />
      <path d="M8 20l24 16 24-16" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function GridIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="5" y="5" width="54" height="54" rx="12" fill="#1f2430" />
      {[0, 1, 2].map(r => [0, 1, 2].map(c => (
        <rect key={`${r}-${c}`} x={14 + c * 13} y={14 + r * 13} width="9" height="9" rx="2.4"
          fill={r === 1 && c === 1 ? "#c4462f" : "#8d94a5"} opacity={r === 1 && c === 1 ? 1 : 0.85} />
      )))}
    </svg>
  );
}

export function PhotoIcon({ size = 64, src }: P & { src?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <clipPath id="ph-c"><rect x="8" y="8" width="48" height="48" rx="5" /></clipPath>
      </defs>
      <rect x="5" y="5" width="54" height="54" rx="8" fill="#fdfdfb" />
      {src
        ? <image href={src} x="8" y="8" width="48" height="48" clipPath="url(#ph-c)" preserveAspectRatio="xMidYMid slice" />
        : <rect x="8" y="8" width="48" height="48" rx="5" fill="#cfd4dd" />}
    </svg>
  );
}

export function MinesIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="ms-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9e6df" /><stop offset="1" stopColor="#c9c5bb" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="54" height="54" rx="10" fill="url(#ms-g)" />
      <rect x="5" y="5" width="54" height="54" rx="10" fill="none" stroke="rgba(0,0,0,.16)" strokeWidth="1.5" />
      <g fill="#1f1e1c">
        <path d="M30.4 14h3.2v5h-3.2z" />
        <path d="M17.6 19.4l2.3-2.3 3.5 3.5-2.3 2.3zM40.6 20.6l3.5-3.5 2.3 2.3-3.5 3.5z" />
        <circle cx="32" cy="35" r="12" />
        <path d="M12 33.4h5v3.2h-5zM47 33.4h5v3.2h-5z" />
        <path d="M17.6 50.6l3.5-3.5 2.3 2.3-3.5 3.5zM43 47.1l3.5 3.5-2.3 2.3-3.5-3.5z" />
      </g>
      <circle cx="27.6" cy="30.6" r="2.9" fill="#f2efe9" opacity=".9" />
    </svg>
  );
}

export function AppIcon({ kind, size = 64, src }: { kind: string; size?: number; src?: string }) {
  switch (kind) {
    case "mines":    return <MinesIcon size={size} />;
    case "folder":   return <FolderIcon size={size} />;
    case "doc":      return <DocIcon size={size} />;
    case "terminal": return <TerminalIcon size={size} />;
    case "mail":     return <MailIcon size={size} />;
    case "grid":     return <GridIcon size={size} />;
    case "photo":    return <PhotoIcon size={size} src={src} />;
    default:         return <DocIcon size={size} />;
  }
}

/* ── social glyphs, 16px line icons ───────── */
export const Glyph = {
  github: (
    <path d="M8 .2a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4C3.8 14.4 3.4 13 3.4 13c-.3-.8-.8-1-.8-1-.6-.4 0-.4 0-.4.7 0 1.1.7 1.1.7.6 1.1 1.7.8 2.1.6 0-.5.3-.8.5-1-1.8-.2-3.6-.9-3.6-3.9 0-.9.3-1.6.8-2.1 0-.2-.3-1 .1-2.1 0 0 .7-.2 2.2.8a7.5 7.5 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.5.8 1.2.8 2.1 0 3-1.8 3.7-3.6 3.9.3.2.5.7.5 1.4v2.1c0 .2.1.5.6.4A8 8 0 0 0 8 .2z" />
  ),
  twitter: (
    <path d="M12.6 1.5h2.5l-5.4 6.2 6.4 8.5h-5l-3.9-5.1-4.5 5.1H.2l5.8-6.6L-.1 1.5h5.1l3.5 4.7zm-.9 13.2h1.4L4.4 2.9H2.9z" />
  ),
  linkedin: (
    <path d="M3.6 5.3H.6V16h3zM2.1.5a1.7 1.7 0 1 0 0 3.5 1.7 1.7 0 0 0 0-3.5zM16 9.7c0-2.9-1.6-4.3-3.7-4.3-1.7 0-2.5.9-2.9 1.6V5.3H6.4V16h3v-6c0-1.2.8-1.8 1.7-1.8s1.6.6 1.6 1.8v6h3z" />
  ),
  mail: (
    <path d="M1.5 2.5h13c.6 0 1 .4 1 1v9c0 .6-.4 1-1 1h-13c-.6 0-1-.4-1-1v-9c0-.6.4-1 1-1zm.4 1.7L8 8.9l6.1-4.7v-.2H1.9z" />
  ),
};

export function SocialIcon({ name, size = 15 }: { name: keyof typeof Glyph; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      {Glyph[name]}
    </svg>
  );
}
