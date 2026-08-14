/* ─────────────────────────────────────────────
   Everything the desktop knows about Abhist.
   Content only — no presentation.
───────────────────────────────────────────── */

export const ME = {
  name: "Abhist Kamle",
  handle: "@_abhist_",
  role: "Web3 Developer",
  location: "Nagpur, IN",
  status: "Open to Buidl",
  avatar: "/photos/abhiii.jpg",
  bio: "1.5 yrs into Web3. Eth & Solana dev. Proficient in Solidity & Rust. B.Tech CS @ IIIT Nagpur. Web3 Lead at Elevate Club. Core member of Bhaisaaab DAO. Won couple of hackathons. Competitive programmer.",
};

export const ROLES = ["Web3 Developer.", "Defi.", "Builder @Turbin3.", "CP/DSA Grinder."];

export const ABOUT = [
  "I'm a Web3 developer based in Nagpur, India. Started with competitive programming, fell into blockchain, haven't looked back. Currently doing B.Tech in CS at IIIT Nagpur while building in the Solana and Ethereum ecosystems.",
  "I write Solidity and Rust. I care about security, gas efficiency, and smart contracts that actually work under pressure. Beyond blockchain — full-stack apps, CLI tools, scripts that solve real problems.",
  "Off-chain: Web3 Lead at Elevate Club, Core Member of Bhaisaaab DAO, Turbin3 builder. Multiple projects shipped. Still grinding CP-DSA. If I'm not writing contracts, I'm reading them.",
];

export const SKILLS: Record<string, string[]> = {
  Blockchain: ["Solidity", "Rust", "Ethereum", "Solana", "Hardhat", "Ethers.js", "Web3.js"],
  Frontend:   ["React", "TypeScript", "JavaScript", "Tailwind"],
  Systems:    ["Node.js", "Python", "Redis", "C++"],
};

export type Project = {
  n: string; title: string; done: boolean; stack: string; link: string; desc: string;
};

export const PROJECTS: Project[] = [
  { n:"01", title:"Sadak Sathi",            done:true,  stack:"HTML · CSS · JS · Python",      link:"https://github.com/Abhist17/sadak-sathi-",           desc:"Real-world problem solving via tech-driven systems focused on road safety, reporting, and actionable civic insights." },
  { n:"02", title:"Web3 Todo",              done:true,  stack:"Solidity · JS · HTML",          link:"https://github.com/Abhist17/todo-web3",              desc:"Fully on-chain task manager with immutable state. Built to explore decentralized state persistence and user-owned data." },
  { n:"03", title:"Trade Journal",          done:false, stack:"TypeScript · JS",               link:"https://github.com/Abhist17/trade-journal",          desc:"Performance tracking system for traders — logs trades, analyzes patterns, and enforces disciplined decision-making." },
  { n:"04", title:"JD-CV Match AI",         done:true,  stack:"TypeScript · Python",           link:"https://github.com/Abhist17/JD-CV-Matching",         desc:"Embedding + NER-based matching engine that aligns resumes with job descriptions using semantic similarity scoring." },
  { n:"05", title:"DigiPramaan",            done:true,  stack:"Solidity · Web3.js · Node.js",  link:"https://github.com/Abhist17/iitr",                   desc:"A REST API that accepts Indian government identity documents (Aadhaar, PAN, Domicile, etc.), automatically processes them, and returns structured data." },
  { n:"06", title:"Sentra",                 done:false, stack:"TypeScript · Node.js · Redis",  link:"https://github.com/Abhist17/sentra",                 desc:"Backend-focused risk monitoring engine that detects market anomalies and triggers real-time alerts via Telegram." },
  { n:"07", title:"Web3 Attendance System", done:true,  stack:"Solidity · React · Ethers.js",  link:"https://github.com/Abhist17/web3-attendance-system", desc:"Decentralized attendance tracking leveraging smart contracts for transparency, auditability, and trustless record keeping." },
];

/* ── writing ──────────────────────────────
   ADDING A PIECE
   Nothing is required. Publish on Medium and it
   turns up in the Writing app on its own, pulled
   from the feed, within six hours (the cache TTL
   in live.ts).

   Add it here as well when you want it to read
   the way you'd write it rather than the way the
   feed describes it. An entry here wins outright
   over the live copy on a matching link — same
   rule as the curated projects beating GitHub's
   one-liners — so this is where you get a real
   deck instead of the first 180 characters of the
   article, and tags spelled properly.

   It is also the offline copy: everything here
   renders even when rss2json is down, rate-
   limited, or the handle is unset.

   Match `link` to the Medium URL with the
   ?source=… tracking suffix stripped, or the two
   copies won't recognise each other and you'll
   get the piece twice.

   `read` is minutes — Medium's own estimate,
   shown at the top of the article. */
export type Post = {
  title: string;
  deck: string;
  link: string;
  date: string;      // ISO
  read: number;
  tags: string[];
};

export const WRITING: Post[] = [
  {
    title: "What Crypto Trading in India actually looks like",
    deck: "A grounded look at the rules, risks, and real numbers behind India's most misunderstood asset class.",
    link: "https://medium.com/@abhistcodes17/what-crypto-trading-in-india-actually-looks-like-b447aeb11c54",
    date: "2026-08-13",
    read: 10,
    tags: ["India and Crypto", "Investing", "Bitcoin", "Blockchain", "Finance"],
  },
];

export type Exp = { role: string; org: string; period: string; desc: string; link: string };

export const EXP: Exp[] = [
  { role:"Web3 Lead",   org:"Elevate Club",   period:"2025—",     desc:"Running the blockchain community at college — sessions, initiatives, building next-gen Web3 devs.", link:"#" },
  { role:"Builder",     org:"Solana Turbin3", period:"2026—",     desc:"Hands-on Solana dev via the Turbin3 Async Builders Program.",                                       link:"https://x.com/solanaturbine" },
  { role:"Core Member", org:"Bhaisaaab DAO",  period:"2024—",     desc:"Indian Web3 community — education, collaboration, onboarding builders.",                            link:"https://x.com/Bhaisaaab_" },
  { role:"B.Tech CS",   org:"IIIT Nagpur",    period:"2024—2028", desc:"Computer Science. Competitive programming. Building things that matter.",                           link:"https://iiitn.ac.in/" },
];

/* `id` picks the brand mark (icons.tsx / socials.tsx).
   `note` is the one line the Contact card says about the place.
   Leave `href` empty and the row disappears everywhere. */
export type SocialId = "email" | "x" | "instagram" | "github" | "linkedin" | "telegram";
export type Social = { id: SocialId; label: string; handle: string; href: string; note: string };

export const SOCIALS: Social[] = [
  { id:"email",     label:"Email",     handle:"abhistcodes17@gmail.com", href:"mailto:abhistcodes17@gmail.com",                  note:"Best for work — I read everything." },
  { id:"x",         label:"X",         handle:"@_abhist_",               href:"https://x.com/_abhist_",                          note:"Shipping logs, Web3 takes, threads." },
  { id:"telegram",  label:"Telegram",  handle:"@abhistcodes",            href:"https://t.me/abhistcodes",                        note:"Fastest reply. DMs open." },
  { id:"github",    label:"GitHub",    handle:"Abhist17",                href:"https://github.com/Abhist17",                     note:"Contracts, tools, everything public." },
  { id:"instagram", label:"Instagram", handle:"@oyeabhist",              href:"https://instagram.com/oyeabhist",                 note:"The off-chain life." },
  { id:"linkedin",  label:"LinkedIn",  handle:"abhist-k",                href:"https://www.linkedin.com/in/abhist-k-845079323/", note:"Resume stuff and formal intros." },
];

export const social = (id: SocialId) => SOCIALS.find(s => s.id === id && s.href) ?? null;

export const STATS: [string, string][] = [
  ["1.5y", "Web3 exp"],
  ["4+",   "Projects"],
  ["3+",   "Communities"],
];

/* ── wallpaper themes ─────────────────────── */
export type ThemeId = "sunrise" | "mono" | "midnight" | "solana" | "ember" | "graphite";

/* Each theme is a treatment of the same photograph rather than a palette of
   its own. `filter` runs on the image; `tint` is a wash laid over it with
   `blend` — "color" keeps the photo's light and shade and replaces only the
   hue, which is what turns one sunrise into a duotone in any colour. `sky`
   is the gradient underneath: it shows for the moment before the photo
   decodes, so it has to be in the same key as the treatment above it. */
export const THEMES: {
  id: ThemeId; name: string; swatch: string; sky: string[]; light: boolean;
  filter: string; tint: string; blend: string;
}[] = [
  /* THE DUOTONES AND THEIR TINTS — read this before changing a colour.

     These four used to wash the wallpaper with `color` blending, which keeps
     the photo's luminance and swaps only its hue. That wants a photograph with
     a broad range of mid-tones, because mid-tones are the only place hue can
     land: pure black stays black and pure white stays white whatever hue you
     hand them. The old sunrise had that range. This wallpaper does not — it is
     near-black almost everywhere with a thin near-white swirl through it, so
     `color` had nothing to tint and all four themes came out looking like Mono.

     `screen` is the treatment a dark frame wants. It maps black to the tint
     and leaves white white, which is a duotone in the darkroom sense: the
     shadows carry the colour and the highlights stay clean.

     That inverts what the tint value means. Under `color` it was the hue you
     wanted to see, so it matched the swatch. Under `screen` it is the colour
     the *blacks* become, so it has to be a deep, low-value version of the
     swatch — hand it the bright swatch colour and the whole frame lifts into a
     pastel wash and takes the contrast under the white text with it. */
  { id: "sunrise",  name: "Sunrise",  swatch: "#d9973f", light: false,
    sky: ["#3b2a12", "#8a6224", "#d09a4a", "#f2dcae"],
    filter: "grayscale(1) contrast(1.05)", tint: "rgba(74, 45, 14, 1)", blend: "screen" },

  { id: "mono",     name: "Mono",     swatch: "#9a9a9e", light: false,
    sky: ["#141416", "#3a3a3e", "#7a7a80", "#cfcfd4"],
    filter: "grayscale(1) contrast(1.09)", tint: "transparent", blend: "normal" },

  { id: "midnight", name: "Midnight", swatch: "#2a4d8f", light: false,
    sky: ["#0b1733", "#1e3f7a", "#5b8bd0", "#a9c6e8"],
    filter: "grayscale(1) contrast(1.05)", tint: "rgba(17, 34, 76, 1)", blend: "screen" },

  { id: "solana",   name: "Solana",   swatch: "#7d4fd8", light: false,
    sky: ["#170b2e", "#3d1c6e", "#7d4fd8", "#c9b0f2"],
    filter: "grayscale(1) contrast(1.05)", tint: "rgba(38, 20, 70, 1)", blend: "screen" },

  { id: "ember",    name: "Ember",    swatch: "#c4462f", light: false,
    sky: ["#1d0f0b", "#5c2317", "#c4462f", "#f0a071"],
    filter: "grayscale(1) contrast(1.06)", tint: "rgba(72, 24, 14, 1)", blend: "screen" },

  { id: "graphite", name: "Graphite", swatch: "#2c2c2e", light: false,
    sky: ["#0a0a0a", "#1c1c1e", "#3a3a3c", "#6e6e73"],
    filter: "grayscale(1) contrast(1.2) brightness(.78)", tint: "transparent", blend: "normal" },
];
