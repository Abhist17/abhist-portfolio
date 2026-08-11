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

export type Exp = { role: string; org: string; period: string; desc: string; link: string };

export const EXP: Exp[] = [
  { role:"Web3 Lead",   org:"Elevate Club",   period:"2025—",     desc:"Running the blockchain community at college — sessions, initiatives, building next-gen Web3 devs.", link:"#" },
  { role:"Builder",     org:"Solana Turbin3", period:"2026—",     desc:"Hands-on Solana dev via the Turbin3 Async Builders Program.",                                       link:"https://x.com/solanaturbine" },
  { role:"Core Member", org:"Bhaisaaab DAO",  period:"2024—",     desc:"Indian Web3 community — education, collaboration, onboarding builders.",                            link:"https://x.com/Bhaisaaab_" },
  { role:"B.Tech CS",   org:"IIIT Nagpur",    period:"2024—2028", desc:"Computer Science. Competitive programming. Building things that matter.",                           link:"https://iiitn.ac.in/" },
];

export type Social = { label: string; handle: string; href: string };

export const SOCIALS: Social[] = [
  { label:"Email",    handle:"abhistcodes17@gmail.com", href:"mailto:abhistcodes17@gmail.com" },
  { label:"Twitter",  handle:"@_abhist_",               href:"https://x.com/_abhist_" },
  { label:"GitHub",   handle:"Abhist17",                href:"https://github.com/Abhist17" },
  { label:"LinkedIn", handle:"abhist-k-...",            href:"https://www.linkedin.com/in/abhist-k-845079323/" },
];

export const STATS: [string, string][] = [
  ["1.5y", "Web3 exp"],
  ["4+",   "Projects"],
  ["3+",   "Communities"],
];

/* ── wallpaper themes ─────────────────────── */
export type ThemeId = "midnight" | "solana" | "ember" | "graphite";

export const THEMES: { id: ThemeId; name: string; swatch: string; sky: string[]; light: boolean }[] = [
  { id: "midnight", name: "Midnight", swatch: "#2a4d8f", light: false, sky: ["#0b1733", "#1e3f7a", "#5b8bd0", "#a9c6e8"] },
  { id: "solana",   name: "Solana",   swatch: "#7d4fd8", light: false, sky: ["#170b2e", "#3d1c6e", "#7d4fd8", "#41e0b3"] },
  { id: "ember",    name: "Ember",    swatch: "#c4462f", light: false, sky: ["#1d0f0b", "#5c2317", "#c4462f", "#f0a071"] },
  { id: "graphite", name: "Graphite", swatch: "#2c2c2e", light: false, sky: ["#0a0a0a", "#1c1c1e", "#3a3a3c", "#6e6e73"] },
];
