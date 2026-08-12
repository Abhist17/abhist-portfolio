/* ─────────────────────────────────────────────
   TECH STACK MARKS
   One mark per tool, shown inside the Tech Stack
   folder. The dock is for launching apps.
───────────────────────────────────────────── */

export type Tool = { id: string; name: string; art: JSX.Element };

const sq = (fill: string, r = 11) => (
  <rect x="2" y="2" width="44" height="44" rx={r} fill={fill} />
);

export const TOOLS: Tool[] = [
  {
    id: "solidity", name: "Solidity",
    art: (
      <>
        {sq("#1c1c1f")}
        <g transform="translate(24 24)" fill="#fff">
          <path d="M-7 -3.4L-3.4 -9.6h6.8L7 -3.4H0z" opacity=".55" />
          <path d="M-7 -3.4H0l3.4 6.2h-6.8z" opacity=".85" />
          <path d="M7 3.4L3.4 9.6h-6.8L-7 3.4H0z" opacity=".55" />
          <path d="M7 3.4H0l-3.4-6.2h6.8z" opacity=".85" />
        </g>
      </>
    ),
  },
  {
    id: "rust", name: "Rust",
    art: (
      <>
        {sq("#f3f0ea")}
        <g transform="translate(24 24)">
          <circle r="13" fill="none" stroke="#1c1c1f" strokeWidth="2.4" />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x="-1.3" y="-17" width="2.6" height="4.4" rx="1.1" fill="#1c1c1f"
              transform={`rotate(${i * 30})`} />
          ))}
          <path d="M-5.4 6.4V-6.4h5.9a3.7 3.7 0 0 1 0 7.4h-5.9m4.6 0L2.6 6.4"
            fill="none" stroke="#1c1c1f" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </>
    ),
  },
  {
    id: "ethereum", name: "Ethereum",
    art: (
      <>
        {sq("#5b6ee0")}
        <g transform="translate(24 24)" fill="#fff">
          <path d="M0-14l8.4 14L0 5.2-8.4 0z" opacity=".9" />
          <path d="M0 7.6L8.4 2.4 0 14l-8.4-11.6z" opacity=".65" />
        </g>
      </>
    ),
  },
  {
    id: "solana", name: "Solana",
    art: (
      <>
        {sq("#131318")}
        <defs>
          <linearGradient id="sol-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00ffa3" /><stop offset="1" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <g fill="url(#sol-g)">
          <path d="M15 16.5h20l-4.6 4.6h-20z" />
          <path d="M15 22.2h20l-4.6 4.6h-20z" transform="translate(0 0)" />
          <path d="M19.6 27.9h20L35 32.5H15z" />
        </g>
      </>
    ),
  },
  {
    id: "react", name: "React",
    art: (
      <>
        {sq("#15202b")}
        <g transform="translate(24 24)" stroke="#61dafb" strokeWidth="1.8" fill="none">
          <ellipse rx="14" ry="5.4" />
          <ellipse rx="14" ry="5.4" transform="rotate(60)" />
          <ellipse rx="14" ry="5.4" transform="rotate(120)" />
        </g>
        <circle cx="24" cy="24" r="2.9" fill="#61dafb" />
      </>
    ),
  },
  {
    id: "typescript", name: "TypeScript",
    art: (
      <>
        {sq("#3178c6")}
        <text x="24" y="32" textAnchor="middle" fill="#fff"
          style={{ font: "700 19px 'Inter Tight', system-ui, sans-serif", letterSpacing: "-0.02em" }}>TS</text>
      </>
    ),
  },
  {
    id: "node", name: "Node.js",
    art: (
      <>
        {sq("#1c2b1c")}
        <path d="M24 10l12 7v14l-12 7-12-7V17z" fill="#5fa04e" />
        <path d="M24 15.5v17c-3.4 0-5.6-1.9-5.6-5h3c0 1.4.8 2.1 2.6 2.1 1.6 0 2.4-.6 2.4-1.7 0-1.2-.7-1.6-3.1-2-3.2-.5-5-1.6-5-4.4 0-2.6 2.1-4.4 5.7-4.5z" fill="#fff" opacity=".92" />
        <path d="M24 15.5c3.6 0 5.6 1.6 5.8 4.4h-3c-.2-1.2-.9-1.8-2.8-1.8v-2.6z" fill="#fff" opacity=".92" />
      </>
    ),
  },
  {
    id: "python", name: "Python",
    art: (
      <>
        {sq("#1b2a3a")}
        <path d="M24 10c-4.6 0-6.4 1.9-6.4 4.6v3.2h6.6v1.4h-9c-2.8 0-5.2 1.7-5.2 6.2s2 6.4 4.8 6.4h2.6v-3.9c0-3 2.5-5.4 5.5-5.4h5.6c2.4 0 4.3-1.9 4.3-4.3v-3.6c0-2.7-2.2-4.6-6.4-4.6zm-3.6 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="#4b8bbe" />
        <path d="M24 38c4.6 0 6.4-1.9 6.4-4.6v-3.2h-6.6v-1.4h9c2.8 0 5.2-1.7 5.2-6.2s-2-6.4-4.8-6.4h-2.6v3.9c0 3-2.5 5.4-5.5 5.4h-5.6c-2.4 0-4.3 1.9-4.3 4.3v3.6c0 2.7 2.2 4.6 6.4 4.6zm3.6-3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="#ffd43b" />
      </>
    ),
  },
  {
    id: "redis", name: "Redis",
    art: (
      <>
        {sq("#2a1211")}
        <g fill="#dc382d">
          <ellipse cx="24" cy="31" rx="14" ry="5.2" />
          <ellipse cx="24" cy="25" rx="14" ry="5.2" opacity=".8" />
          <ellipse cx="24" cy="19" rx="14" ry="5.2" opacity=".62" />
        </g>
        <ellipse cx="24" cy="19" rx="8" ry="2.8" fill="#fff" opacity=".28" />
      </>
    ),
  },
  {
    id: "cpp", name: "C++",
    art: (
      <>
        {sq("#00599c")}
        <text x="21" y="31" textAnchor="middle" fill="#fff"
          style={{ font: "700 17px 'Inter Tight', system-ui, sans-serif" }}>C</text>
        <g stroke="#fff" strokeWidth="2.1" strokeLinecap="round">
          <path d="M29 22.5v5M26.5 25h5M36 22.5v5M33.5 25h5" />
        </g>
      </>
    ),
  },
  {
    id: "hardhat", name: "Hardhat",
    art: (
      <>
        {sq("#1a1a1f")}
        <g transform="translate(24 26)">
          <path d="M-13 6a13 13 0 0 1 26 0z" fill="#fff048" />
          <path d="M-6.5 -6a6.5 6.5 0 0 1 13 0v12h-13z" fill="#f0c000" />
          <rect x="-16" y="5.4" width="32" height="4.2" rx="2.1" fill="#fff048" />
        </g>
      </>
    ),
  },
  {
    id: "ethers", name: "Ethers.js",
    art: (
      <>
        {sq("#20232f")}
        <g transform="translate(24 24)" stroke="#8a9bf0" strokeWidth="1.7" fill="none">
          <ellipse rx="6" ry="13" />
          <ellipse rx="6" ry="13" transform="rotate(60)" />
          <ellipse rx="6" ry="13" transform="rotate(120)" />
        </g>
        <circle cx="24" cy="24" r="3.4" fill="#8a9bf0" />
      </>
    ),
  },
  {
    id: "web3", name: "Web3.js",
    art: (
      <>
        {sq("#f16822")}
        <text x="24" y="31" textAnchor="middle" fill="#fff"
          style={{ font: "700 16px 'Inter Tight', system-ui, sans-serif" }}>W3</text>
      </>
    ),
  },
  {
    id: "javascript", name: "JavaScript",
    art: (
      <>
        {sq("#f7df1e")}
        <text x="24" y="32" textAnchor="middle" fill="#1a1a1f"
          style={{ font: "700 18px 'Inter Tight', system-ui, sans-serif" }}>JS</text>
      </>
    ),
  },
  {
    id: "tailwind", name: "Tailwind",
    art: (
      <>
        {sq("#0f2330")}
        <g fill="#38bdf8">
          <path d="M24 17c-4 0-6.5 2-7.5 6 1.5-2 3.25-2.75 5.25-2.25 1.14.29 1.96 1.12 2.86 2.04C26.08 24.29 27.78 26 31.5 26c4 0 6.5-2 7.5-6-1.5 2-3.25 2.75-5.25 2.25-1.14-.29-1.96-1.12-2.86-2.04C29.42 18.71 27.72 17 24 17z" transform="translate(-7 0)" />
          <path d="M24 17c-4 0-6.5 2-7.5 6 1.5-2 3.25-2.75 5.25-2.25 1.14.29 1.96 1.12 2.86 2.04C26.08 24.29 27.78 26 31.5 26c4 0 6.5-2 7.5-6-1.5 2-3.25 2.75-5.25 2.25-1.14-.29-1.96-1.12-2.86-2.04C29.42 18.71 27.72 17 24 17z" transform="translate(-14 7)" />
        </g>
      </>
    ),
  },
];

/** Every skill maps to a mark, so the Tech Stack folder is all logos. */
export const TOOL_BY_NAME: Record<string, Tool> = Object.fromEntries(
  TOOLS.map(t => [t.name.toLowerCase(), t]),
);

export const findTool = (name: string) =>
  TOOL_BY_NAME[name.toLowerCase()] ?? null;

export function ToolIcon({ tool, size = 46 }: { tool: Tool; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      {tool.art}
    </svg>
  );
}
