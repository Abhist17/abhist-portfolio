/* ─────────────────────────────────────────────
   DESKTOP ICONOGRAPHY

   These are drawn as objects under a light, not
   as glyphs. Four things do that work, and every
   icon here carries all four:

     · a body gradient with a mid stop, so the
       surface turns rather than ramping flat
     · a rim light along the top edge and a
       darker line along the bottom, which is
       what tells the eye the form has thickness
     · a specular sheen over the upper third
     · a contact shadow with falloff

   Every gradient id is prefixed per icon (f-,
   d-, t-, …). That matters: an icon can be on
   the page several times over — desktop, dock,
   spotlight — and `url(#id)` resolves to the
   first match in the document, so two different
   gradients sharing a name would silently take
   each other's colours.
───────────────────────────────────────────── */

type P = { size?: number };

/** Shared contact shadow: a dark core with a wide soft skirt, rather than a
    flat ellipse — an object this size sitting on a surface throws both. */
const Shadow = () => (
  <>
    <defs>
      <radialGradient id="sh-soft" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#000" stopOpacity=".38" />
        <stop offset=".5" stopColor="#000" stopOpacity=".17" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="32" cy="57" rx="21" ry="4.4" fill="url(#sh-soft)" />
  </>
);

/* The two leaves are lit differently on purpose: the back one stands nearly
   upright and catches less, the front one leans toward the viewer and takes
   the sheen. The front leaf is also a shallow trapezoid rather than a
   rectangle — a couple of degrees of taper is the whole difference between a
   folder that is open and a blue box. */
function Folder({ size, c }: P & { c: {
  id: string; backTop: string; backBot: string;
  top: string; upper: string; mid: string; bot: string; line: string; paper: string;
} }) {
  const k = c.id;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id={`${k}-back`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.backTop} /><stop offset="1" stopColor={c.backBot} />
        </linearGradient>
        <linearGradient id={`${k}-front`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.top} />
          <stop offset=".16" stopColor={c.upper} />
          <stop offset=".62" stopColor={c.mid} />
          <stop offset="1" stopColor={c.bot} />
        </linearGradient>
        <linearGradient id={`${k}-sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".46" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <Shadow />

      {/* back leaf, with its own lit top edge */}
      <path d="M6 17a4 4 0 0 1 4-4h13.4a3 3 0 0 1 2.2 1l4.2 4.4H54a4 4 0 0 1 4 4v6H6z" fill={`url(#${k}-back)`} />
      <path d="M10 13h13.4a3 3 0 0 1 2.2 1H10a4 4 0 0 0-3.7 2.5A4 4 0 0 1 10 13z" fill="#fff" opacity=".45" />

      {/* the papers inside — two sheets, the back one offset, so the folder
          reads as holding something rather than as being empty */}
      <rect x="17" y="17.5" width="30" height="8" rx="1.4" fill={c.paper} opacity=".55" />
      <rect x="14.5" y="19.5" width="35" height="7" rx="1.6" fill={c.paper} />

      {/* front leaf: 1.5 units of taper per side */}
      <path d="M6.2 23h51.6l-2 25.2a4 4 0 0 1-4 3.8H12.2a4 4 0 0 1-4-3.8z" fill={`url(#${k}-front)`} />
      {/* sheen over the upper third */}
      <path d="M6.2 23h51.6l-.9 11.5H7.1z" fill={`url(#${k}-sheen)`} />
      {/* lit lip along the top of the front leaf, and the shade under its base */}
      <path d="M6.2 23h51.6l-.08 1.5H6.28z" fill="#fff" opacity=".7" />
      <path d="M9.1 47.6h45.8l-.12 1.5H9.22z" fill={c.line} opacity=".35" />
    </svg>
  );
}

export function FolderIcon({ size = 64 }: P) {
  return <Folder size={size} c={{
    id: "f",
    backTop: "#8ec1f5", backBot: "#3d76bd",
    top: "#dcedff", upper: "#a9d1f8", mid: "#79b1ee", bot: "#4a8bd3",
    line: "#2f6dae", paper: "#f6f3ec",
  }} />;
}

export function FolderAltIcon({ size = 64 }: P) {
  return <Folder size={size} c={{
    id: "fa",
    backTop: "#e0c084", backBot: "#a87f42",
    top: "#fbeecb", upper: "#f0d9a4", mid: "#dcba7c", bot: "#bd9455",
    line: "#8d6a2e", paper: "#fdfaf2",
  }} />;
}

/* The sheet, shared by the document and the PDF. The folded corner is the
   only part of a paper icon that carries real form, so it gets the most work:
   a lit underside, a shaded fold and a hairline crease. The page itself is
   very slightly warm at the foot, the way paper is when it is lit from above. */
function Sheet({ k }: { k: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${k}-body`} x1=".2" y1="0" x2=".8" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".55" stopColor="#f7f5f0" />
          <stop offset="1" stopColor="#e4e0d6" />
        </linearGradient>
        <linearGradient id={`${k}-fold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8e4da" />
          <stop offset="1" stopColor="#c2bdb0" />
        </linearGradient>
        <linearGradient id={`${k}-edge`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <Shadow />
      {/* a second sheet behind, just proud of the first */}
      <path d="M16.5 8h20L50 21v33a2.5 2.5 0 0 1-2.5 2.5h-31A2.5 2.5 0 0 1 14 54V10.5A2.5 2.5 0 0 1 16.5 8z"
        fill="#d8d3c7" opacity=".55" transform="translate(1.6 1.4)" />
      <path d="M14 6h22.5L52 21.5V56a2.5 2.5 0 0 1-2.5 2.5h-35A2.5 2.5 0 0 1 12 56V8.5A2.5 2.5 0 0 1 14.5 6z"
        fill={`url(#${k}-body)`} stroke="#c9c4b6" strokeWidth=".9" />
      {/* rim light down the left edge and across the top */}
      <path d="M14.5 6.5h21.8v1.1H14.6a1.5 1.5 0 0 0-1.5 1.5V56h-1.1V8.5a2 2 0 0 1 2-2z" fill={`url(#${k}-edge)`} />
      {/* the fold: underside lit, crease dark */}
      <path d="M36.5 6L52 21.5H39a2.5 2.5 0 0 1-2.5-2.5z" fill={`url(#${k}-fold)`} />
      <path d="M36.5 6L52 21.5h-2.6L36.5 8.6z" fill="#aaa598" opacity=".85" />
      <path d="M36.9 6.6l14.4 14.4" stroke="#fff" strokeWidth=".8" opacity=".5" />
    </>
  );
}

export function DocIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Sheet k="d" />
      <g stroke="#a8a496" strokeWidth="1.7" strokeLinecap="round">
        <path d="M20 37h24M20 44h24M20 51h15" />
      </g>
      <path d="M20 30h24" stroke="#c4462f" strokeWidth="1.7" strokeLinecap="round" opacity=".8" />
    </svg>
  );
}

export function PdfIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="p-badge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9573f" /><stop offset="1" stopColor="#a83420" />
        </linearGradient>
      </defs>
      <Sheet k="p" />
      {/* the ruled body peeking out above the badge */}
      <g stroke="#b4b0a3" strokeWidth="1.6" strokeLinecap="round">
        <path d="M20 29h24M20 35h18" />
      </g>
      {/* PDF badge, sitting slightly proud of the page */}
      <g>
        <rect x="12" y="40" width="30" height="14" rx="3.2" fill="#000" opacity=".16" transform="translate(0 1)" />
        <rect x="12" y="40" width="30" height="14" rx="3.2" fill="url(#p-badge)" />
        <path d="M15.2 40h23.6a3.2 3.2 0 0 1 3.2 3.2v1.3H12v-1.3A3.2 3.2 0 0 1 15.2 40z" fill="#fff" opacity=".18" />
        <text x="27" y="50.3" textAnchor="middle" fill="#fff"
          fontSize="9" fontWeight="700" fontFamily="Helvetica, Arial, sans-serif" letterSpacing="0.5">PDF</text>
      </g>
    </svg>
  );
}

export function TerminalIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="t-body" x1=".3" y1="0" x2=".7" y2="1">
          <stop offset="0" stopColor="#3c3c47" />
          <stop offset=".5" stopColor="#212128" />
          <stop offset="1" stopColor="#0d0d11" />
        </linearGradient>
        <linearGradient id="t-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#55555f" /><stop offset="1" stopColor="#3a3a44" />
        </linearGradient>
        {/* the screen is not flat black: a CRT-ish pool of light sits behind
            the prompt and falls off toward the corners */}
        <radialGradient id="t-glow" cx="30%" cy="72%" r="62%">
          <stop offset="0" stopColor="#6ee7a8" stopOpacity=".17" />
          <stop offset="1" stopColor="#6ee7a8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="t-glare" x1="0" y1="0" x2=".6" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".13" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <Shadow />
      <rect x="6" y="9" width="52" height="45" rx="9" fill="url(#t-body)" />
      <rect x="6.5" y="9.5" width="51" height="44" rx="8.5" fill="none" stroke="#63636f" strokeWidth="1" opacity=".8" />
      <rect x="7.6" y="10.6" width="48.8" height="41.8" rx="7.6" fill="none" stroke="#000" strokeWidth="1" opacity=".45" />

      <path d="M6 18a9 9 0 0 1 9-9h34a9 9 0 0 1 9 9v.6H6z" fill="url(#t-bar)" />
      <path d="M15 9h34a9 9 0 0 1 8.6 6.4A9 9 0 0 0 49 10.2H15a9 9 0 0 0-8.6 5.2A9 9 0 0 1 15 9z" fill="#fff" opacity=".22" />

      {[["#ff5f57", "#c33d33", 15], ["#febc2e", "#c9901a", 23.5], ["#28c840", "#1a9c2f", 32]].map(([a, b, cx]) => (
        <g key={cx as number}>
          <circle cx={cx as number} cy="14" r="2.6" fill={b as string} />
          <circle cx={cx as number} cy="13.7" r="2.4" fill={a as string} />
          <circle cx={(cx as number) - 0.7} cy="12.9" r=".85" fill="#fff" opacity=".55" />
        </g>
      ))}

      <rect x="6" y="18.6" width="52" height="35.4" fill="url(#t-glow)" />

      <g stroke="#6ee7a8" strokeWidth="2.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 30l7.5 6.5L16 43" />
      </g>
      <path d="M29 43.5h16" stroke="#6ee7a8" strokeWidth="2.9" strokeLinecap="round" opacity=".72" />

      {/* glare across the glass, clipped to the screen's own rounding */}
      <path d="M6 19h52v11c-18 5.4-34 4.4-52 0z" fill="url(#t-glare)" />
    </svg>
  );
}

export function MailIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="m-body" x1=".3" y1="0" x2=".7" y2="1">
          <stop offset="0" stopColor="#8fd8ff" />
          <stop offset=".5" stopColor="#4c9ee2" />
          <stop offset="1" stopColor="#1f6cb8" />
        </linearGradient>
        {/* the flap is paper, so it warms very slightly toward its fold */}
        <linearGradient id="m-flap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#e8f1fa" />
        </linearGradient>
        <linearGradient id="m-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".38" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <Shadow />
      <rect x="6" y="14" width="52" height="36" rx="8.5" fill="url(#m-body)" />

      {/* the flap, with the shaded gusset the fold throws on each side */}
      <path d="M6 22a8.5 8.5 0 0 1 8.5-8h35A8.5 8.5 0 0 1 58 22L32 39z" fill="url(#m-flap)" />
      <path d="M6 22L32 39 58 22v3.6L32 42.6 6 25.6z" fill="#12508f" opacity=".55" />
      <path d="M6 25.6l19 12.4L6 50z" fill="#fff" opacity=".1" />
      <path d="M58 25.6L39 38l19 12z" fill="#000" opacity=".1" />

      <path d="M6 22.4a8.5 8.5 0 0 1 8.5-8.4h35a8.5 8.5 0 0 1 8.5 8.4l-1.6 1L32 37.4 7.6 23.4z" fill="none" stroke="#0f4a86" strokeWidth=".9" opacity=".4" />
      <path d="M14.5 14h35A8.5 8.5 0 0 1 58 22v6l-.9-.6V22a7.6 7.6 0 0 0-7.6-7.1h-35A7.6 7.6 0 0 0 6.9 22v5.4L6 28v-6a8.5 8.5 0 0 1 8.5-8z" fill="url(#m-sheen)" />
      <rect x="6.5" y="14.5" width="51" height="35" rx="8" fill="none" stroke="#0f4a86" strokeWidth="1" opacity=".45" />
    </svg>
  );
}

export function GridIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="g-body" x1=".3" y1="0" x2=".7" y2="1">
          <stop offset="0" stopColor="#39435a" />
          <stop offset=".5" stopColor="#232a39" />
          <stop offset="1" stopColor="#12161f" />
        </linearGradient>
        <linearGradient id="g-tile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c2cadb" /><stop offset="1" stopColor="#8b95a9" />
        </linearGradient>
        <linearGradient id="g-hot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2694f" /><stop offset="1" stopColor="#ad3a24" />
        </linearGradient>
        <linearGradient id="g-sheen" x1="0" y1="0" x2=".4" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <Shadow />
      <rect x="6" y="6" width="52" height="52" rx="13.5" fill="url(#g-body)" />
      {/* outer rim light, inner dark line — the two edges of a bevel */}
      <rect x="6.5" y="6.5" width="51" height="51" rx="13" fill="none" stroke="#727d94" strokeWidth="1" opacity=".75" />
      <rect x="7.6" y="7.6" width="48.8" height="48.8" rx="12" fill="none" stroke="#000" strokeWidth="1" opacity=".4" />

      {[0, 1, 2].map(r => [0, 1, 2].map(c => {
        const mid = r === 1 && c === 1;
        return (
          <g key={`${r}-${c}`}>
            <rect x={15 + c * 12.5} y={15.7 + r * 12.5} width="9.5" height="9.5" rx="2.9" fill="#000" opacity=".3" />
            <rect x={15 + c * 12.5} y={15 + r * 12.5} width="9.5" height="9.5" rx="2.9"
              fill={mid ? "url(#g-hot)" : "url(#g-tile)"} />
            <rect x={15 + c * 12.5} y={15 + r * 12.5} width="9.5" height="4.2" rx="2.9" fill="#fff" opacity=".22" />
          </g>
        );
      }))}

      <path d="M6 19.5a13.5 13.5 0 0 1 13.5-13.5h25A13.5 13.5 0 0 1 58 19.5c-16 7-36 7-52 0z" fill="url(#g-sheen)" />
    </svg>
  );
}

/* A print in its mount: the paper border is thicker at the foot, the way a
   mounted photograph is, and the image sits in a well with a shadow. */
export function PhotoIcon({ size = 64, src }: P & { src?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <clipPath id="ph-clip"><rect x="9" y="8" width="46" height="43" rx="3" /></clipPath>
        <linearGradient id="ph-mount" x1=".3" y1="0" x2=".7" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".7" stopColor="#f8f6f1" />
          <stop offset="1" stopColor="#e6e1d6" />
        </linearGradient>
        <linearGradient id="ph-glass" x1="0" y1="0" x2=".5" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".26" />
          <stop offset=".55" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <Shadow />
      <rect x="5" y="4" width="54" height="56" rx="4.5" fill="url(#ph-mount)" />
      <rect x="5.5" y="4.5" width="53" height="55" rx="4" fill="none" stroke="#cdc7b9" strokeWidth="1" />
      {/* the well the print sits in */}
      <rect x="8.4" y="7.4" width="47.2" height="44.2" rx="3.4" fill="#000" opacity=".22" />
      {src
        ? <image href={src} x="9" y="8" width="46" height="43" clipPath="url(#ph-clip)" preserveAspectRatio="xMidYMid slice" />
        : <rect x="9" y="8" width="46" height="43" rx="3" fill="#cfd4dd" />}
      {/* glass */}
      <path d="M9 8h46v22c-15 6.5-31 5.5-46 0z" fill="url(#ph-glass)" clipPath="url(#ph-clip)" />
      <rect x="9" y="8" width="46" height="43" rx="3" fill="none" stroke="#000" strokeWidth=".9" opacity=".18" />
    </svg>
  );
}

/* A little 2×2 of the game's own tiles, with the merged one lit and lifted. */
export function MergeIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="mg-body" x1=".3" y1="0" x2=".7" y2="1">
          <stop offset="0" stopColor="#faf8f3" />
          <stop offset=".55" stopColor="#e7e2d6" />
          <stop offset="1" stopColor="#cec8b8" />
        </linearGradient>
        <linearGradient id="mg-hot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9165e8" /><stop offset="1" stopColor="#2fcb9d" />
        </linearGradient>
        <linearGradient id="mg-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ece5d5" /><stop offset="1" stopColor="#d3cab4" />
        </linearGradient>
        <linearGradient id="mg-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4a878" /><stop offset="1" stopColor="#dd7c4b" />
        </linearGradient>
        <linearGradient id="mg-c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7386e8" /><stop offset="1" stopColor="#4356c9" />
        </linearGradient>
        <linearGradient id="mg-sheen" x1="0" y1="0" x2=".4" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".62" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <Shadow />
      <rect x="6" y="6" width="52" height="52" rx="12.5" fill="url(#mg-body)" />
      <rect x="6.5" y="6.5" width="51" height="51" rx="12" fill="none" stroke="#fff" strokeWidth="1" opacity=".7" />
      <rect x="7.6" y="7.6" width="48.8" height="48.8" rx="11" fill="none" stroke="#a9a291" strokeWidth="1" opacity=".55" />

      {/* the wells, then the tiles proud of them */}
      {[[13, 13], [34, 13], [13, 34], [34, 34]].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y + 0.8} width="17" height="17" rx="4.2" fill="#000" opacity=".14" />
      ))}
      <rect x="13" y="13" width="17" height="17" rx="4.2" fill="url(#mg-a)" />
      <rect x="34" y="13" width="17" height="17" rx="4.2" fill="url(#mg-b)" />
      <rect x="13" y="34" width="17" height="17" rx="4.2" fill="url(#mg-c)" />
      <rect x="34" y="34" width="17" height="17" rx="4.2" fill="url(#mg-hot)" />
      {/* each tile catches the light on its top face */}
      {[[13, 13], [34, 13], [13, 34], [34, 34]].map(([x, y]) => (
        <rect key={`h${x}-${y}`} x={x} y={y} width="17" height="7" rx="4.2" fill="#fff" opacity=".2" />
      ))}
      <rect x="34" y="34" width="17" height="17" rx="4.2" fill="none" stroke="#fff" strokeWidth="1.3" opacity=".65" />

      <path d="M6 18.5a12.5 12.5 0 0 1 12.5-12.5h27A12.5 12.5 0 0 1 58 18.5c-16 6.5-36 6.5-52 0z" fill="url(#mg-sheen)" />
    </svg>
  );
}

/* A page of prose with a headline rule and a nib resting on it — a written
   piece rather than a filed one, which is what separates it from DocIcon. */
export function WritingIcon({ size = 64 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="w-body" x1=".25" y1="0" x2=".75" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".6" stopColor="#f8f5ee" />
          <stop offset="1" stopColor="#e7e0cf" />
        </linearGradient>
        <linearGradient id="w-pen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4b4b57" />
          <stop offset=".3" stopColor="#26262e" />
          <stop offset=".62" stopColor="#101014" />
          <stop offset="1" stopColor="#2c2c35" />
        </linearGradient>
        <linearGradient id="w-nib" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9e5da" />
          <stop offset=".45" stopColor="#b9b3a4" />
          <stop offset="1" stopColor="#8f8a7d" />
        </linearGradient>
      </defs>
      <Shadow />

      {/* the sheet, tilted a touch so it reads as paper on a desk, with a
          second page just showing behind it */}
      <g transform="rotate(-4 32 32)">
        <rect x="13.4" y="8.4" width="42" height="49" rx="3.4" fill="#d7d1c0" opacity=".5" />
        <rect x="11" y="7" width="42" height="49" rx="3.4"
          fill="url(#w-body)" stroke="#c9c2ae" strokeWidth=".9" />
        {/* rim light down the lit edge */}
        <path d="M13.4 7.5h39.1v1H13.6a1.6 1.6 0 0 0-1.6 1.6V56h-1V10.1a2.6 2.6 0 0 1 2.6-2.6z" fill="#fff" opacity=".85" />
        {/* headline */}
        <rect x="17" y="14" width="21" height="4.4" rx="1.5" fill="#c4462f" />
        <rect x="17" y="14" width="21" height="1.8" rx="1" fill="#fff" opacity=".22" />
        {/* the column */}
        <g stroke="#b3ac9c" strokeWidth="1.7" strokeLinecap="round">
          <path d="M17 26h30M17 32h30M17 38h30M17 44h19" />
        </g>
      </g>

      {/* the pen, laid across the lower corner — barrel, then a metal nib with
          its own slit, and a shadow on the page under it */}
      <g transform="rotate(34 44 45)">
        <path d="M40.4 29.2c1.5-1.4 5.1-1.4 6.6 0v17.6h-6.6z" fill="#000" opacity=".22" transform="translate(1.4 1.2)" />
        <rect x="40.4" y="27" width="6.6" height="19" rx="2.4" fill="url(#w-pen)" />
        <rect x="41.1" y="27.6" width="1.5" height="17.8" rx=".75" fill="#fff" opacity=".2" />
        <rect x="40.4" y="35.6" width="6.6" height="1.5" fill="#c9a44a" opacity=".85" />
        <path d="M40.4 46h6.6l-3.3 6.6z" fill="url(#w-nib)" />
        <path d="M43.7 47.4v3.4l-.9-1.9z" fill="#1a1a20" opacity=".8" />
      </g>
    </svg>
  );
}

export function AppIcon({ kind, size = 64, src }: { kind: string; size?: number; src?: string }) {
  switch (kind) {
    case "merge":    return <MergeIcon size={size} />;
    case "writing":  return <WritingIcon size={size} />;
    case "folder":   return <FolderIcon size={size} />;
    case "folder-alt": return <FolderAltIcon size={size} />;
    case "doc":      return <DocIcon size={size} />;
    case "pdf":      return <PdfIcon size={size} />;
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
