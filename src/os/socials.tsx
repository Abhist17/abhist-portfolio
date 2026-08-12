/* ─────────────────────────────────────────────
   SOCIAL BRAND MARKS
   The big version of the glyphs in icons.tsx —
   a real brand tile per network, drawn the same
   way the tech-stack marks are: a coloured body,
   a lit top edge, the logo on top.

   `tint` is the brand colour the Contact card
   borrows on hover.
───────────────────────────────────────────── */
import { Glyph } from "./icons";
import type { SocialId } from "./data";

/** Rounded brand tile, 48×48 canvas. */
const tile = (fill: string) => <rect x="2" y="2" width="44" height="44" rx="12" fill={fill} />;

/** A sliver of light across the top, so the tile reads as an object. */
const gloss = (
  <path d="M2 16a14 14 0 0 1 14-14h16a14 14 0 0 1 14 14z" fill="#fff" opacity=".14" />
);

/** Any 16px glyph, blown up to sit centred on the tile. */
const mark = (id: keyof typeof Glyph, fill: string, scale = 1.75) => {
  const inset = (48 - 16 * scale) / 2;
  return (
    <g transform={`translate(${inset} ${inset}) scale(${scale})`} fill={fill}>
      {Glyph[id]}
    </g>
  );
};

export const SOCIAL_MARK: Record<SocialId, { tint: string; art: JSX.Element }> = {
  email: {
    tint: "#ea4335",
    art: (
      <>
        {tile("#fdfcf9")}
        <rect x="2" y="2" width="44" height="44" rx="12" fill="none" stroke="#ddd8cc" strokeWidth="1" />
        {mark("email", "#ea4335", 1.6)}
      </>
    ),
  },
  x: {
    tint: "#1c1c1f",
    art: (
      <>
        {tile("#0f0f11")}
        {gloss}
        {mark("x", "#fff", 1.6)}
      </>
    ),
  },
  instagram: {
    tint: "#d62976",
    art: (
      <>
        <defs>
          <linearGradient id="ig-g" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#ffd76f" />
            <stop offset="0.32" stopColor="#f7772f" />
            <stop offset="0.62" stopColor="#d62976" />
            <stop offset="1" stopColor="#4f5bd5" />
          </linearGradient>
        </defs>
        {tile("url(#ig-g)")}
        {gloss}
        {mark("instagram", "#fff", 1.72)}
      </>
    ),
  },
  github: {
    tint: "#24292f",
    art: (
      <>
        {tile("#1c1c22")}
        {gloss}
        {mark("github", "#fff", 1.7)}
      </>
    ),
  },
  linkedin: {
    tint: "#0a66c2",
    art: (
      <>
        {tile("#0a66c2")}
        {gloss}
        {mark("linkedin", "#fff", 1.6)}
      </>
    ),
  },
  telegram: {
    tint: "#229ed9",
    art: (
      <>
        <defs>
          <linearGradient id="tg-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#41bcf0" /><stop offset="1" stopColor="#1d92cc" />
          </linearGradient>
        </defs>
        {tile("url(#tg-g)")}
        {gloss}
        {mark("telegram", "#fff", 1.6)}
      </>
    ),
  },
};

export function SocialMark({ id, size = 46 }: { id: SocialId; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      {SOCIAL_MARK[id].art}
    </svg>
  );
}

export const tintOf = (id: SocialId) => SOCIAL_MARK[id].tint;
