import { useState, useEffect, useRef } from "react";
import { Github, Linkedin, Mail, ArrowUpRight, ExternalLink, Twitter, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
   FONTS
───────────────────────────────────────────── */
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Fragment+Mono&display=swap');
    .bb { font-family: 'Bebas Neue', sans-serif; }
    .dm { font-family: 'DM Mono', monospace; }
    .fr { font-family: 'Fragment Mono', monospace; }
    @font-face {
  font-family: 'Soria';
  src: url('/fonts/Soria.woff2') format('woff2'),
       url('/fonts/Soria.ttf') format('truetype');
}
.soria { font-family: 'Soria', serif; }
    

    * { box-sizing: border-box; }

    @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.3} }

    @media (max-width: 768px) {
      .hidden-mobile { display: none !important; }
      .show-mobile   { display: flex !important; }
    }
  `}</style>
);

/* ─────────────────────────────────────────────
   CONTENT
───────────────────────────────────────────── */
const ROLES = ["Web3 Developer.", "Defi.", "Builder @Turbin3.", "CP/DSA Grinder."];

const SKILLS = {
  Blockchain: ["Solidity", "Rust", "Ethereum", "Solana", "Hardhat", "Ethers.js", "Web3.js"],
  Frontend:   ["React", "TypeScript", "JavaScript", "Tailwind"],
  Systems:    ["Node.js", "Python", "Redis", "C++"],
};

const PROJECTS = [
  { n:"01", title:"Sadak Sathi",            done:true,  stack:"HTML · CSS · JS · Python",       link:"https://github.com/Abhist17/sadak-sathi-",          desc:"Real-world problem solving via tech-driven systems focused on road safety, reporting, and actionable civic insights." },
  { n:"02", title:"Web3 Todo",              done:true, stack:"Solidity · JS · HTML",            link:"https://github.com/Abhist17/todo-web3",             desc:"Fully on-chain task manager with immutable state. Built to explore decentralized state persistence and user-owned data." },
  { n:"03", title:"Trade Journal",          done:false, stack:"TypeScript · JS",                 link:"https://github.com/Abhist17/trade-journal",         desc:"Performance tracking system for traders — logs trades, analyzes patterns, and enforces disciplined decision-making." },
  { n:"04", title:"JD-CV Match AI",         done:true,  stack:"TypeScript · Python",             link:"https://github.com/Abhist17/JD-CV-Matching",        desc:"Embedding + NER-based matching engine that aligns resumes with job descriptions using semantic similarity scoring." },
  { n:"05", title:"DigiPramaan",            done:true,  stack:"Solidity · Web3.js · Node.js",   link:"https://github.com/Abhist17/iitr",                  desc:"A REST API that accepts Indian government identity documents (Aadhaar, PAN, Domicile, etc.), automatically processes them, and returns structured data." },
  { n:"06", title:"Sentra",                 done:false, stack:"TypeScript · Node.js · Redis",   link:"https://github.com/Abhist17/sentra",                desc:"Backend-focused risk monitoring engine that detects market anomalies and triggers real-time alerts via Telegram." },
  { n:"07", title:"Web3 Attendance System", done:true,  stack:"Solidity · React · Ethers.js",   link:"https://github.com/Abhist17/web3-attendance-system", desc:"Decentralized attendance tracking leveraging smart contracts for transparency, auditability, and trustless record keeping." },
];

const EXP = [
  { role:"Web3 Lead",   org:"Elevate Club",   period:"2025—", desc:"Running the blockchain community at college — sessions, initiatives, building next-gen Web3 devs.", link:"#" },
  { role:"Builder",     org:"Solana Turbin3", period:"2026—", desc:"Hands-on Solana dev via the Turbin3 Async Builders Program.",                                        link:"https://x.com/solanaturbine" },
  { role:"Core Member", org:"Bhaisaaab DAO",  period:"2024—", desc:"Indian Web3 community — education, collaboration, onboarding builders.",                             link:"https://x.com/Bhaisaaab_" },
  { role:"B.Tech CS",   org:"IIIT Nagpur",    period:"2024—", desc:"Computer Science. Competitive programming. Building things that matter.",                            link:"https://iiitn.ac.in/" },
];

const SOCIALS = [
  { label:"Email",    handle:"abhistcodes17@gmail.com", href:"mailto:abhistcodes17@gmail.com",                       Icon:Mail     },
  { label:"Twitter",  handle:"@_abhist_",               href:"https://x.com/_abhist_",                               Icon:Twitter  },
  { label:"GitHub",   handle:"Abhist17",                href:"https://github.com/Abhist17",                          Icon:Github   },
  { label:"LinkedIn", handle:"abhist-k-...",            href:"https://www.linkedin.com/in/abhist-k-845079323/",      Icon:Linkedin },
];

const NAV = [
  { label:"About",      href:"#about"      },
  { label:"Work",       href:"#projects"   },
  { label:"Background", href:"#experience" },
  { label:"Contact",    href:"#contact"    },
];

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useScrolled(n = 40) {
  const [s, set] = useState(false);
  useEffect(() => {
    const f = () => set(window.scrollY > n);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, [n]);
  return s;
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, v };
}

function useTyper() {
  const [i, setI]         = useState(0);
  const [txt, setTxt]     = useState("");
  const [phase, setPhase] = useState<"in"|"hold"|"out">("in");
  useEffect(() => {
    const role = ROLES[i % ROLES.length];
    let t: ReturnType<typeof setTimeout>;
    if (phase === "in") {
      if (txt.length < role.length) t = setTimeout(() => setTxt(role.slice(0, txt.length + 1)), 70);
      else t = setTimeout(() => setPhase("hold"), 2200);
    } else if (phase === "hold") {
      t = setTimeout(() => setPhase("out"), 300);
    } else {
      if (txt.length > 0) t = setTimeout(() => setTxt(s => s.slice(0, -1)), 35);
      else { setI(n => n + 1); setPhase("in"); }
    }
    return () => clearTimeout(t);
  }, [txt, phase, i]);
  return txt;
}

/* ─────────────────────────────────────────────
   REVEAL WRAPPER
───────────────────────────────────────────── */
function R({ children, d = 0, y = 18, className = "" }:
  { children: React.ReactNode; d?: number; y?: number; className?: string }) {
  const { ref, v } = useInView();
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y }}
      animate={v ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   DIVIDER
───────────────────────────────────────────── */
function Divider({ label }: { label: string }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
      <div style={{ borderTop: "1px solid #2a2a2a", display: "flex", alignItems: "center", gap: 16 }}>
        <span className="fr" style={{ fontSize: 9, color: "#c8ff00", letterSpacing: "0.35em", textTransform: "uppercase", padding: "8px 0", flexShrink: 0 }}>
          {label}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Fonts />
      <motion.header
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          background: scrolled ? "rgba(10,10,10,0.97)" : "transparent",
          borderBottom: scrolled ? "1px solid #2a2a2a" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "all 0.4s",
        }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
            onMouseEnter={e => {
              (e.currentTarget.querySelector("img") as HTMLImageElement).style.filter = "none";
              (e.currentTarget.querySelector("span") as HTMLElement).style.color = "#c8ff00";
            }}
            onMouseLeave={e => {
              (e.currentTarget.querySelector("img") as HTMLImageElement).style.filter = "grayscale(1)";
              (e.currentTarget.querySelector("span") as HTMLElement).style.color = "#ffffff";
            }}>
            <div style={{ width: 26, height: 26, borderRadius: 3, overflow: "hidden", border: "1px solid #333", flexShrink: 0 }}>
              <img src="/photos/abhiii.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)", transition: "filter 0.3s" }} />
            </div>
            <span className="fr" style={{ fontSize: 10, color: "#ffffff", letterSpacing: "0.3em", textTransform: "uppercase", transition: "color 0.2s" }}>ABHIST.DEV</span>
          </a>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 36 }} className="hidden-mobile">
            {NAV.map(n => (
              <a key={n.label} href={n.href} className="fr"
                style={{ fontSize: 10, color: "#ffffff", letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#c8ff00"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#ffffff"}>
                {n.label}
              </a>
            ))}
          </nav>

          <button onClick={() => setOpen(o => !o)} className="show-mobile"
            style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", padding: 4, display: "none", alignItems: "center" }}>
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}
            style={{ position: "fixed", top: 56, left: 0, right: 0, zIndex: 40, background: "#0a0a0a", borderBottom: "1px solid #2a2a2a" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 40px", display: "flex", flexDirection: "column", gap: 20 }}>
              {NAV.map(n => (
                <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="fr"
                  style={{ fontSize: 11, color: "#ffffff", letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#c8ff00"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#ffffff"}>
                  {n.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
  const role = useTyper();

  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "space-between", padding: "0 40px",
      maxWidth: 1100, margin: "0 auto",
    }}>
      {/* top row */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 80 }}>
        <span className="fr" style={{ fontSize: 9, color: "#ffffff", letterSpacing: "0.4em", textTransform: "uppercase" }}>
          Nagpur, IN
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#c8ff00", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span className="fr" style={{ fontSize: 9, color: "#c8ff00", letterSpacing: "0.3em", textTransform: "uppercase" }}>Open to Buidl</span>
        </div>
      </motion.div>

      {/* center */}
      <div style={{ paddingBottom: 20 }}>
        <motion.h1
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="bb"
          style={{ fontSize: "clamp(72px, 19vw, 160px)", color: "#f0f0f0", lineHeight: 0.87, letterSpacing: "-0.01em", whiteSpace: "pre-line", userSelect: "none", margin: 0 }}>
          {"ABHIST\nKAMLE"}
        </motion.h1>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28 }}>
          <div style={{ width: 28, height: 1, background: "#c8ff00", flexShrink: 0 }} />
          <span className="dm" style={{ fontSize: 15, color: "#c8ff00", letterSpacing: "0.04em", minHeight: "1.4em" }}>
            {role}
            <span style={{ display: "inline-block", width: 2, height: 15, background: "#c8ff00", marginLeft: 2, verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
          </span>
        </motion.div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.55 }}
          className="dm"
          style={{ fontSize: 13, color: "#cccccc", maxWidth: 440, lineHeight: 1.9, marginTop: 28 }}>
          1.5 yrs into Web3. Eth &amp; Solana dev. Proficient in Solidity &amp; Rust. B.Tech CS @ IIIT Nagpur. Web3 Lead at Elevate Club. Core member of Bhaisaaab DAO. Won couple of hackathons. Competitive programmer.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.78, duration: 0.5 }}
          style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 36 }}>
          <HoverBtn href="#projects" primary>
            View Work <ArrowUpRight size={12} style={{ marginLeft: 4 }} />
          </HoverBtn>
          <HoverBtn href="https://github.com/Abhist17" target="_blank">
            <Github size={12} style={{ marginRight: 6 }} /> GitHub
          </HoverBtn>
          <HoverBtn href="https://x.com/_abhist_" target="_blank">
            <Twitter size={12} style={{ marginRight: 6 }} /> @_abhist_
          </HoverBtn>
        </motion.div>
      </div>

      {/* bottom */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.5 }}
        style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingBottom: 32 }}>
        <span className="fr" style={{ fontSize: 9, color: "#aaaaaa", letterSpacing: "0.4em", textTransform: "uppercase" }}>Scroll ↓</span>
        <span className="fr" style={{ fontSize: 9, color: "#aaaaaa", letterSpacing: "0.4em", textTransform: "uppercase" }}>@_abhist_</span>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   HOVER BUTTON
───────────────────────────────────────────── */
function HoverBtn({ href, children, primary, target }: {
  href: string; children: React.ReactNode; primary?: boolean; target?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <motion.a
      href={href} target={target} rel={target ? "noreferrer" : undefined}
      whileTap={{ scale: 0.96 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="fr"
      style={{
        display: "flex", alignItems: "center",
        padding: "10px 20px", fontSize: 11,
        letterSpacing: "0.25em", textTransform: "uppercase",
        textDecoration: "none", borderRadius: 2,
        border: primary ? "none" : `1px solid ${hov ? "#c8ff00" : "#857878"}`,
        background: primary ? (hov ? "#d5ff33" : "#c8ff00") : "transparent",
        color: primary ? "#0a0a0a" : (hov ? "#c8ff00" : "#ffffff"),
        transition: "all 0.2s", cursor: "pointer",
      }}>
      {children}
    </motion.a>
  );
}

/* ─────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────── */
function About() {
  return (
    <section id="about" style={{ padding: "96px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 80, alignItems: "start" }}>

        {/* Left sticky */}
        <R d={0.05}>
          <div style={{ position: "sticky", top: 88 }}>
            <span className="fr" style={{ fontSize: 9, color: "#aaaaaa", letterSpacing: "0.4em", textTransform: "uppercase" }}></span>
            <h2 className="bb" style={{ fontSize: 52, color: "#f0f0f0", lineHeight: 1, marginTop: 8, marginBottom: 36, letterSpacing: "0.03em" }}>About</h2>

            {Object.entries(SKILLS).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: 24 }}>
                <span className="fr" style={{ fontSize: 9, color: "#aaaaaa", letterSpacing: "0.35em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>{cat}</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {items.map(s => <SkillTag key={s}>{s}</SkillTag>)}
                </div>
              </div>
            ))}
          </div>
        </R>

        {/* Right text */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <R d={0.1}>
            <p className="dm" style={{ fontSize: 13, color: "#dddddd", lineHeight: 1.95 }}>
              I'm a Web3 developer based in Nagpur, India. Started with competitive programming, fell into blockchain, haven't looked back. Currently doing B.Tech in CS at IIIT Nagpur while building in the Solana and Ethereum ecosystems.
            </p>
          </R>
          <R d={0.16}>
            <p className="dm" style={{ fontSize: 13, color: "#cccccc", lineHeight: 1.95 }}>
              I write Solidity and Rust. I care about security, gas efficiency, and smart contracts that actually work under pressure. Beyond blockchain — full-stack apps, CLI tools, scripts that solve real problems.
            </p>
          </R>
          <R d={0.22}>
            <p className="dm" style={{ fontSize: 13, color: "#cccccc", lineHeight: 1.95 }}>
              Off-chain: Web3 Lead at Elevate Club, Core Member of Bhaisaaab DAO, Turbin3 builder. Multiple projects shipped. Still grinding CP-DSA. If I'm not writing contracts, I'm reading them.
            </p>
          </R>

          {/* Stats */}
          <R d={0.28}>
            <div style={{ borderTop: "1px solid #2a2a2a", paddingTop: 28, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 8 }}>
              {[["1.5y", "Web3 exp"], ["4+", "Projects"], ["3+", "Communities"]].map(([v, l]) => (
                <div key={l}>
                  <p className="bb" style={{ fontSize: 42, color: "#c8ff00", lineHeight: 1, letterSpacing: "0.04em" }}>{v}</p>
                  <p className="fr" style={{ fontSize: 9, color: "#aaaaaa", letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 8 }}>{l}</p>
                </div>
              ))}
            </div>
          </R>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #about > div { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

function SkillTag({ children }: { children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <span className="dm"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: 11, padding: "5px 10px",
        border: `1px solid ${hov ? "#c8ff00" : "#333"}`,
        color: hov ? "#c8ff00" : "#ffffff",
        borderRadius: 2, cursor: "default", transition: "all 0.2s",
        background: hov ? "rgba(140, 170, 32, 0.06)" : "transparent",
      }}>
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────
   PROJECTS
───────────────────────────────────────────── */
function Projects() {
  return (
    <section id="projects" style={{ padding: "96px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <R d={0}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 56 }}>
          <h2 className="bb" style={{ fontSize: 52, color: "#f0f0f0", lineHeight: 1, letterSpacing: "0.03em", margin: 0 }}>Work</h2>
          <span className="fr" style={{ fontSize: 9, color: "#aaaaaa", letterSpacing: "0.4em", textTransform: "uppercase" }}></span>
        </div>
      </R>
      {PROJECTS.map((p, i) => <R key={p.n} d={0.06 * i}><ProjectRow p={p} /></R>)}
      <div style={{ borderTop: "1px solid #2a2a2a" }} />
    </section>
  );
}

function ProjectRow({ p }: { p: typeof PROJECTS[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={p.link} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 40, padding: "28px 0",
        borderTop: `1px solid ${hov ? "rgba(200,255,0,0.3)" : "#2a2a2a"}`,
        textDecoration: "none", transition: "all 0.25s ease",
        background: hov ? "rgba(200,255,0,0.02)" : "transparent",
      }}>

      {/* Number */}
      <span className="fr" style={{ fontSize: 10, color: hov ? "#c8ff00" : "#ffffff", width: 20, flexShrink: 0, marginTop: 2, transition: "color 0.2s" }}>
        {p.n}
      </span>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <h3 className="bb" style={{ fontSize: 28, color: hov ? "#c8ff00" : "#ffffff", transition: "color 0.2s", letterSpacing: "0.05em", margin: 0 }}>
            {p.title}
          </h3>
          <ArrowUpRight size={15} style={{ color: "#c8ff00", opacity: hov ? 1 : 0, transition: "opacity 0.2s" }} />
        </div>
        <p className="dm" style={{ fontSize: 12, color: hov ? "#ffffff" : "#cccccc", lineHeight: 1.7, margin: 0, transition: "color 0.2s" }}>
          {p.desc}
        </p>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0, minWidth: 100 }}>
        <span className="fr" style={{
          fontSize: 9, padding: "3px 8px", borderRadius: 2, letterSpacing: "0.3em",
          border: `1px solid ${p.done ? "rgba(200,255,0,0.5)" : "#ca3c3c"}`,
          color: p.done ? "#c8ff00" : "#ffffff",
          background: p.done ? "rgba(200,255,0,0.08)" : "#ca3030",
        }}>
          {p.done ? "SHIPPED" : "WIP"}
        </span>
        <span className="fr" style={{ fontSize: 12, color: hov ? "#c8ff00" : "#c4c4c4", textAlign: "right", lineHeight: 1.6, transition: "color 0.2s" }}>
          {p.stack}
        </span>
      </div>
    </a>
  );
}

/* ─────────────────────────────────────────────
   EXPERIENCE
───────────────────────────────────────────── */
function Experience() {
  return (
    <section id="experience" style={{ padding: "96px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <R d={0}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 56 }}>
          <h2 className="bb" style={{ fontSize: 52, color: "#f0f0f0", lineHeight: 1, letterSpacing: "0.03em", margin: 0 }}>Background</h2>
          <span className="fr" style={{ fontSize: 9, color: "#aaaaaa", letterSpacing: "0.4em", textTransform: "uppercase" }}></span>
        </div>
      </R>
      {EXP.map((e, i) => <R key={e.org} d={0.07 * i}><ExpRow e={e} /></R>)}
      <div style={{ borderTop: "1px solid #2a2a2a" }} />
    </section>
  );
}

function ExpRow({ e }: { e: typeof EXP[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={e.link} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid", gridTemplateColumns: "160px 1fr 20px", gap: 40, padding: "28px 0",
        borderTop: `1px solid ${hov ? "rgba(200,255,0,0.3)" : "#2a2a2a"}`,
        textDecoration: "none", alignItems: "start", transition: "border-color 0.2s",
        background: hov ? "rgba(200,255,0,0.02)" : "transparent",
      }}>
      <div>
        <p className="bb" style={{ fontSize: 20, color: hov ? "#c8ff00" : "#ffffff", transition: "color 0.2s", letterSpacing: "0.05em", margin: "0 0 6px" }}>{e.org}</p>
        <p className="fr" style={{ fontSize: 9, color: hov ? "#c8ff00" : "#aaaaaa", letterSpacing: "0.35em", margin: 0, transition: "color 0.2s" }}>{e.period}</p>
      </div>
      <div>
        <p className="dm" style={{ fontSize: 12, color: hov ? "#c8ff00" : "#ffffff", margin: "0 0 8px", transition: "color 0.2s" }}>{e.role}</p>
        <p className="dm" style={{ fontSize: 12, color: hov ? "#dddddd" : "#cccccc", lineHeight: 1.75, margin: 0, transition: "color 0.2s" }}>{e.desc}</p>
      </div>
      <ExternalLink size={13} style={{ color: "#c8ff00", opacity: hov ? 1 : 0, transition: "opacity 0.2s", marginTop: 2 }} />

      <style>{`
        @media (max-width: 768px) {
          a[href="${e.link}"] { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
    </a>
  );
}

/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
function Contact() {
  return (
    <section id="contact" style={{ padding: "96px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <R d={0}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 56 }}>
          <h2 className="bb" style={{ fontSize: 90, color: "#f0f0f0", lineHeight: 1, letterSpacing: "0.03em", margin: 0 }}>Contact</h2>
          
        </div>
      </R>

      <R d={0.06}>
        <p className="bb" style={{ fontSize: "clamp(36px, 8vw, 88px)", color: "#c8ff00", lineHeight: 0.95, marginBottom: 56 }}>
          Have a project?<br />
          <span style={{ color: "#f0f0f0" }}>Let's build it.</span>
        </p>
      </R>

      {SOCIALS.map((s, i) => <R key={s.label} d={0.07 * i}><ContactRow s={s} /></R>)}
      <div style={{ borderTop: "1px solid #2a2a2a" }} />

      <R d={0.38}>
        <div style={{ marginTop: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="fr" style={{ fontSize: 12, color: "#aaaaaa", letterSpacing: "0.4em", textTransform: "uppercase" }}>Made with ❤️ in Room 524</span>
          
        </div>
      </R>
    </section>
  );
} 

function ContactRow({ s }: { s: typeof SOCIALS[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={s.href}
      target={s.href.startsWith("mailto") ? undefined : "_blank"}
      rel={s.href.startsWith("mailto") ? undefined : "noreferrer"}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 0",
        borderTop: `1px solid ${hov ? "rgba(200,255,0,0.3)" : "#2a2a2a"}`,
        textDecoration: "none", transition: "border-color 0.2s",
        background: hov ? "rgba(200,255,0,0.02)" : "transparent",
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <s.Icon size={13} style={{ color: hov ? "#c8ff00" : "#ffffff", transition: "color 0.2s", flexShrink: 0 }} />
        <span className="fr" style={{ fontSize: 10, color: hov ? "#c8ff00" : "#ffffff", letterSpacing: "0.35em", textTransform: "uppercase", transition: "color 0.2s" }}>{s.label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span className="dm" style={{ fontSize: 12, color: hov ? "#c8ff00" : "#cccccc", transition: "color 0.2s" }}>{s.handle}</span>
        <ArrowUpRight size={13} style={{ color: "#c8ff00", opacity: hov ? 1 : 0, transition: "opacity 0.2s" }} />
      </div>
    </a>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function Index() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />
      <main>
        <Hero />
        <Divider label="About" />
        <About />
        <Divider label="Work" />
        <Projects />
        <Divider label="Background" />
        <Experience />
        <Divider label="Contact" />
        <Contact />
      </main>
    </div>
  );
}