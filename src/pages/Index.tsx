import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, animate } from "framer-motion";

/* ═════════════════════════════════════════════
   CONTENT
═════════════════════════════════════════════ */
const ROLES = ["Web3 Developer.", "Defi.", "Builder @Turbin3.", "CP/DSA Grinder."];

const SKILLS = {
  Blockchain: ["Solidity", "Rust", "Ethereum", "Solana", "Hardhat", "Ethers.js", "Web3.js"],
  Frontend:   ["React", "TypeScript", "JavaScript", "Tailwind"],
  Systems:    ["Node.js", "Python", "Redis", "C++"],
};

const PROJECTS = [
  { n:"01", title:"Sadak Sathi",            done:true,  stack:"HTML · CSS · JS · Python",       link:"https://github.com/Abhist17/sadak-sathi-",          desc:"Real-world problem solving via tech-driven systems focused on road safety, reporting, and actionable civic insights." },
  { n:"02", title:"Web3 Todo",              done:true,  stack:"Solidity · JS · HTML",            link:"https://github.com/Abhist17/todo-web3",             desc:"Fully on-chain task manager with immutable state. Built to explore decentralized state persistence and user-owned data." },
  { n:"03", title:"Trade Journal",          done:false, stack:"TypeScript · JS",                 link:"https://github.com/Abhist17/trade-journal",         desc:"Performance tracking system for traders — logs trades, analyzes patterns, and enforces disciplined decision-making." },
  { n:"04", title:"JD-CV Match AI",         done:true,  stack:"TypeScript · Python",             link:"https://github.com/Abhist17/JD-CV-Matching",        desc:"Embedding + NER-based matching engine that aligns resumes with job descriptions using semantic similarity scoring." },
  { n:"05", title:"DigiPramaan",            done:true,  stack:"Solidity · Web3.js · Node.js",   link:"https://github.com/Abhist17/iitr",                  desc:"A REST API that accepts Indian government identity documents (Aadhaar, PAN, Domicile, etc.), automatically processes them, and returns structured data." },
  { n:"06", title:"Sentra",                 done:false, stack:"TypeScript · Node.js · Redis",   link:"https://github.com/Abhist17/sentra",                desc:"Backend-focused risk monitoring engine that detects market anomalies and triggers real-time alerts via Telegram." },
  { n:"07", title:"Web3 Attendance System", done:true,  stack:"Solidity · React · Ethers.js",   link:"https://github.com/Abhist17/web3-attendance-system", desc:"Decentralized attendance tracking leveraging smart contracts for transparency, auditability, and trustless record keeping." },
];

const EXP = [
  { role:"Web3 Lead",   org:"Elevate Club",   period:"2025—",     desc:"Running the blockchain community at college — sessions, initiatives, building next-gen Web3 devs.", link:"#" },
  { role:"Builder",     org:"Solana Turbin3", period:"2026—",     desc:"Hands-on Solana dev via the Turbin3 Async Builders Program.",                                       link:"https://x.com/solanaturbine" },
  { role:"Core Member", org:"Bhaisaaab DAO",  period:"2024—",     desc:"Indian Web3 community — education, collaboration, onboarding builders.",                            link:"https://x.com/Bhaisaaab_" },
  { role:"B.Tech CS",   org:"IIIT Nagpur",    period:"2024—2028", desc:"Computer Science. Competitive programming. Building things that matter.",                           link:"https://iiitn.ac.in/" },
];

const SOCIALS = [
  { label:"Email",    handle:"abhistcodes17@gmail.com", href:"mailto:abhistcodes17@gmail.com" },
  { label:"Twitter",  handle:"@_abhist_",               href:"https://x.com/_abhist_" },
  { label:"GitHub",   handle:"Abhist17",                href:"https://github.com/Abhist17" },
  { label:"LinkedIn", handle:"abhist-k-...",            href:"https://www.linkedin.com/in/abhist-k-845079323/" },
];

const NAV = [
  { label:"About",      href:"#about"      },
  { label:"Work",       href:"#work"       },
  { label:"Background", href:"#background" },
  { label:"Contact",    href:"#contact"    },
];

const STATS: [string, string][] = [["1.5y", "Web3 exp"], ["4+", "Projects"], ["3+", "Communities"]];

/* ═════════════════════════════════════════════
   MOTION — one curve, one scale
═════════════════════════════════════════════ */
const EASE = [0.22, 1, 0.36, 1] as const;
const DUR  = 1;

/* ═════════════════════════════════════════════
   PAGE STYLES
═════════════════════════════════════════════ */
const Styles = () => (
  <style>{`
    /* ── nav ─────────────────────────────── */
    .nav {
      position: fixed; inset: 0 0 auto 0; z-index: 50;
      transition: background .5s ease, border-color .5s ease, backdrop-filter .5s ease;
      border-bottom: 1px solid transparent;
    }
    .nav[data-stuck="true"] {
      background: rgba(11,11,10,.72);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom-color: var(--rule-2);
    }
    .nav-inner {
      height: 72px; display: flex; align-items: center; justify-content: space-between;
    }
    .nav-links { display: flex; gap: 40px; }
    .nav-link {
      position: relative; text-decoration: none; color: var(--mute);
      transition: color .35s ease; padding: 4px 0;
    }
    .nav-link:hover { color: var(--bone); }
    .nav-link::after {
      content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
      background: var(--accent); transform: scaleX(0); transform-origin: 0 50%;
      transition: transform .45s cubic-bezier(.22,1,.36,1);
    }
    .nav-link:hover::after { transform: scaleX(1); }
    .nav-toggle {
      display: none; background: none; border: 0; cursor: pointer;
      color: var(--bone); padding: 8px 0 8px 8px;
    }
    .nav-toggle span {
      display: block; width: 22px; height: 1px; background: currentColor;
      transition: transform .45s cubic-bezier(.22,1,.36,1), opacity .3s ease;
    }
    .nav-toggle span + span { margin-top: 6px; }
    .nav-toggle[data-open="true"] span:first-child { transform: translateY(3.5px) rotate(45deg); }
    .nav-toggle[data-open="true"] span:last-child  { transform: translateY(-3.5px) rotate(-45deg); }

    .menu {
      position: fixed; inset: 72px 0 auto 0; z-index: 45;
      background: var(--bg); border-bottom: 1px solid var(--rule-2);
      overflow: hidden;
    }
    .menu a {
      display: block; text-decoration: none; color: var(--bone);
      font-family: var(--display); font-size: 34px; line-height: 1.25;
      letter-spacing: -0.01em;
    }

    /* ── hero ────────────────────────────── */
    .hero {
      min-height: 100vh;
      min-height: 100svh; /* keeps the fold honest under mobile browser chrome */
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .hero-top {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 24px; padding-top: 120px;
    }
    .hero-name {
      font-size: clamp(58px, 13.5vw, 196px);
      margin-top: clamp(24px, 6vh, 72px);
    }
    .hero-roles {
      font-family: var(--display); font-style: italic;
      font-size: clamp(20px, 2.6vw, 34px); color: var(--bone);
      line-height: 1.2; height: 1.3em; position: relative;
      margin-top: clamp(16px, 3vh, 28px);
    }
    .hero-foot {
      display: flex; align-items: flex-end; justify-content: space-between;
      padding-bottom: 40px; gap: 24px;
    }

    .dot {
      display: inline-block; width: 5px; height: 5px; border-radius: 50%;
      background: var(--accent); margin-right: 10px; vertical-align: 2px;
    }

    /* ── section scaffold ────────────────── */
    .section { padding: var(--section) 0; }
    .rule { height: 1px; background: var(--rule-2); width: 100%; }
    .section-head {
      display: flex; align-items: baseline; justify-content: space-between;
      padding-bottom: clamp(40px, 6vw, 72px);
    }

    /* ── index rows (work + background) ──── */
    .list { border-top: 1px solid var(--rule-2); }
    .row {
      display: block; text-decoration: none; position: relative;
      border-bottom: 1px solid var(--rule-2);
      transition: opacity .5s ease;
    }
    .list[data-active="true"] .row { opacity: .34; }
    .list[data-active="true"] .row[data-on="true"] { opacity: 1; }

    .row-line {
      display: grid; align-items: baseline;
      grid-template-columns: 64px minmax(0,1fr) auto 132px 28px;
      gap: 24px; padding: 28px 0;
    }
    .row-title {
      font-family: var(--display); font-size: clamp(24px, 2.9vw, 38px);
      line-height: 1.05; letter-spacing: -0.015em; color: var(--bone);
      transition: transform .55s cubic-bezier(.22,1,.36,1);
      transform-origin: 0 50%;
    }
    .row[data-on="true"] .row-title { transform: translateX(14px); }
    .row-arrow {
      justify-self: end; color: var(--accent);
      opacity: 0; transform: translateX(-8px);
      transition: opacity .4s ease, transform .55s cubic-bezier(.22,1,.36,1);
    }
    .row[data-on="true"] .row-arrow { opacity: 1; transform: translateX(0); }
    .row-body { overflow: hidden; }
    .row-body-inner { padding: 0 0 28px calc(64px + 24px); max-width: 62ch; }

    /* background rows read as a record, not a card */
    .exp-line {
      display: grid; align-items: baseline;
      grid-template-columns: 128px minmax(0,1fr) 1.1fr 28px;
      gap: 24px; padding: 28px 0;
    }

    /* ── about ───────────────────────────── */
    .about-grid {
      display: grid; grid-template-columns: minmax(0,1.35fr) minmax(0,.65fr);
      gap: clamp(32px, 5vw, 72px); align-items: start;
    }
    .portrait {
      width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block;
      filter: grayscale(1) contrast(1.05);
      transition: filter .8s ease;
    }
    .portrait:hover { filter: grayscale(0) contrast(1); }
    .skills {
      display: grid; grid-template-columns: repeat(3, minmax(0,1fr));
      gap: clamp(24px, 4vw, 56px);
      margin-top: clamp(48px, 7vw, 88px);
      padding-top: clamp(32px, 4vw, 48px);
      border-top: 1px solid var(--rule-2);
    }
    .stats {
      display: grid; grid-template-columns: repeat(3, minmax(0,1fr));
      gap: clamp(24px, 4vw, 56px);
      margin-top: clamp(40px, 6vw, 72px);
      padding-top: clamp(32px, 4vw, 48px);
      border-top: 1px solid var(--rule-2);
    }
    .stat-num {
      font-family: var(--display); font-size: clamp(38px, 5vw, 66px);
      line-height: 1; color: var(--bone); letter-spacing: -0.02em;
    }

    /* ── contact ─────────────────────────── */
    .cta {
      font-family: var(--display); color: var(--bone);
      font-size: clamp(40px, 8.5vw, 128px); line-height: .92;
      letter-spacing: -0.025em;
    }
    .cta em { font-style: italic; color: var(--mute); }
    .contact-line {
      display: grid; grid-template-columns: minmax(0,1fr) auto 28px;
      gap: 24px; align-items: baseline; padding: 26px 0;
    }
    .contact-label {
      font-family: var(--display); font-size: clamp(22px, 2.4vw, 32px);
      color: var(--bone); line-height: 1.1;
      transition: transform .55s cubic-bezier(.22,1,.36,1);
      transform-origin: 0 50%;
    }
    .row[data-on="true"] .contact-label { transform: translateX(14px); }

    .footer {
      display: flex; align-items: center; justify-content: space-between;
      gap: 24px; padding: 40px 0 56px;
      border-top: 1px solid var(--rule-2);
    }

    /* ── responsive ──────────────────────── */
    @media (max-width: 1000px) {
      .row-line { grid-template-columns: 48px minmax(0,1fr) auto 28px; }
      .row-status { display: none; }
      /* keep the description flush with the title column */
      .row-body-inner { padding-left: calc(48px + 24px); }
      .exp-line  { grid-template-columns: 104px minmax(0,1fr) 28px; }
      .exp-desc  { display: none; }
    }

    @media (max-width: 860px) {
      .nav-links { display: none; }
      .nav-toggle { display: block; }
      .about-grid { grid-template-columns: 1fr; }
      .portrait { aspect-ratio: 4/3; }
      .skills { grid-template-columns: 1fr; gap: 28px; }
    }

    @media (max-width: 620px) {
      .hero-top { padding-top: 104px; flex-direction: column; gap: 12px; }
      .row-line {
        grid-template-columns: 40px minmax(0,1fr) 24px;
        gap: 16px; padding: 24px 0;
      }
      .row-stack { display: none; }
      .row-body-inner { padding-left: 56px; }
      .exp-line { grid-template-columns: 1fr; gap: 10px; padding: 24px 0; }
      .exp-line .row-arrow { display: none; }
      .exp-desc { display: block; }
      .stats { grid-template-columns: repeat(3, minmax(0,1fr)); gap: 16px; }
      .contact-line { grid-template-columns: minmax(0,1fr) 24px; }
      .contact-handle { display: none; }
      .footer { flex-direction: column; align-items: flex-start; gap: 12px; }
      .menu a { font-size: 28px; }
    }
  `}</style>
);

/* ═════════════════════════════════════════════
   HOOKS
═════════════════════════════════════════════ */
function useScrolled(n = 24) {
  const [s, set] = useState(false);
  useEffect(() => {
    const f = () => set(window.scrollY > n);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [n]);
  return s;
}

/* real mouse pointers only — touch devices get the open, static layout */
function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const apply = () => setFine(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return fine;
}

function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, v };
}

/* ═════════════════════════════════════════════
   MOTION PRIMITIVES
═════════════════════════════════════════════ */

/* A line of type rising from behind its own edge.
   The in-view trigger sits on the mask, never on the clipped child. */
function Rise({ children, delay = 0, now, className = "", style }: {
  children: React.ReactNode; delay?: number; now?: boolean;
  className?: string; style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className} style={{ display: "block", ...style }}>{children}</span>;

  const trigger = now === undefined
    ? { whileInView: "show" as const, viewport: { once: true, amount: 0.3 } }
    : { animate: now ? "show" : "hidden" };

  return (
    <motion.span className={`mask ${className}`} initial="hidden" {...trigger} style={style}>
      <motion.span
        variants={{ hidden: { y: "115%" }, show: { y: "0%" } }}
        transition={{ duration: DUR * 1.15, delay, ease: EASE }}
        style={{ display: "block", willChange: "transform" }}>
        {children}
      </motion.span>
    </motion.span>
  );
}

/* Everything that isn't a headline. */
function Fade({ children, delay = 0, y = 18, className = "", style }: {
  children: React.ReactNode; delay?: number; y?: number;
  className?: string; style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: DUR * 0.8, delay, ease: EASE }}
      style={style}>
      {children}
    </motion.div>
  );
}

function Arrow({ size = 13 }: { size?: number }) {
  return (
    <svg className="row-arrow" width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2 10L10 2M10 2H3.5M10 2V8.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/* ═════════════════════════════════════════════
   NAV
═════════════════════════════════════════════ */
function Nav() {
  const stuck = useScrolled();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="nav" data-stuck={stuck}>
        <div className="wrap nav-inner">
          <a href="#top" className="t-label" style={{ color: "var(--bone)", textDecoration: "none", letterSpacing: "0.16em" }}>
            ABHIST.DEV
          </a>

          <nav className="nav-links">
            {NAV.map(n => (
              <a key={n.label} href={n.href} className="nav-link t-label">{n.label}</a>
            ))}
          </nav>

          <button
            className="nav-toggle"
            data-open={open}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}>
            <span /><span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.6, ease: EASE }}>
            <div className="wrap" style={{ padding: "32px var(--gutter) 44px" }}>
              {NAV.map((n, i) => (
                <span className="mask" key={n.label}>
                  <motion.a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.7, delay: 0.06 * i, ease: EASE }}>
                    {n.label}
                  </motion.a>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═════════════════════════════════════════════
   HERO
═════════════════════════════════════════════ */
function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState(0);

  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const t = setInterval(() => setRole(r => (r + 1) % ROLES.length), 2600);
    return () => clearInterval(t);
  }, []);

  /* the hero drifts up a touch slower than the page — depth without a gimmick */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y       = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section id="top" className="hero" ref={ref}>
      <motion.div className="wrap" style={reduce ? undefined : { y, opacity }}>
        <div className="hero-top">
          <Rise now={ready} delay={0.05}>
            <span className="t-label">Nagpur, IN</span>
          </Rise>
          <Rise now={ready} delay={0.1}>
            <span className="t-label" style={{ color: "var(--bone)" }}>
              <span className="dot" />Open to Buidl
            </span>
          </Rise>
        </div>

        <h1 className="t-display hero-name">
          <Rise now={ready} delay={0.14}>ABHIST</Rise>
          <Rise now={ready} delay={0.22}>KAMLE</Rise>
        </h1>

        <div className="hero-roles">
          <AnimatePresence mode="wait">
            <motion.span
              key={role}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: "60%" }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: "0%" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: "-60%" }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{ display: "inline-block", position: "absolute", left: 0, top: 0 }}>
              {ROLES[role]}
            </motion.span>
          </AnimatePresence>
        </div>

        <Fade delay={0.5} className="rail" style={{ marginTop: "clamp(48px, 8vh, 96px)" }}>
          <div />
          <p className="t-body" style={{ maxWidth: "56ch" }}>
            1.5 yrs into Web3. Eth &amp; Solana dev. Proficient in Solidity &amp; Rust. B.Tech CS @ IIIT Nagpur.
            Web3 Lead at Elevate Club. Core member of Bhaisaaab DAO. Won couple of hackathons. Competitive programmer.
          </p>
        </Fade>
      </motion.div>

      <div className="wrap hero-foot">
        <Fade delay={0.7}><span className="t-label">Scroll</span></Fade>
        <Fade delay={0.75}><span className="t-label">@_abhist_</span></Fade>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════
   SECTION HEAD
═════════════════════════════════════════════ */
function SectionHead({ label, count }: { label: string; count?: string }) {
  return (
    <div className="section-head">
      <h2 className="t-heading"><Rise>{label}</Rise></h2>
      {count && <Fade delay={0.1}><span className="t-label">({count})</span></Fade>}
    </div>
  );
}

/* ═════════════════════════════════════════════
   ABOUT
═════════════════════════════════════════════ */
function About() {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <SectionHead label="About" />

        <div className="about-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Fade>
              <p className="t-body" style={{ color: "var(--bone)", maxWidth: "62ch" }}>
                I'm a Web3 developer based in Nagpur, India. Started with competitive programming, fell into
                blockchain, haven't looked back. Currently doing B.Tech in CS at IIIT Nagpur while building in
                the Solana and Ethereum ecosystems.
              </p>
            </Fade>
            <Fade delay={0.08}>
              <p className="t-body" style={{ maxWidth: "62ch" }}>
                I write Solidity and Rust. I care about security, gas efficiency, and smart contracts that
                actually work under pressure. Beyond blockchain — full-stack apps, CLI tools, scripts that
                solve real problems.
              </p>
            </Fade>
            <Fade delay={0.16}>
              <p className="t-body" style={{ maxWidth: "62ch" }}>
                Off-chain: Web3 Lead at Elevate Club, Core Member of Bhaisaaab DAO, Turbin3 builder. Multiple
                projects shipped. Still grinding CP-DSA. If I'm not writing contracts, I'm reading them.
              </p>
            </Fade>
          </div>

          <Fade delay={0.12}>
            <img className="portrait" src="/photos/abhiii.jpg" alt="Abhist Kamle" loading="lazy" />
          </Fade>
        </div>

        <div className="skills">
          {Object.entries(SKILLS).map(([cat, items], i) => (
            <Fade key={cat} delay={0.06 * i}>
              <p className="t-label" style={{ marginBottom: 14 }}>{cat}</p>
              <p className="t-body" style={{ color: "var(--bone)" }}>{items.join(", ")}</p>
            </Fade>
          ))}
        </div>

        <div className="stats">
          {STATS.map(([v, l], i) => (
            <Fade key={l} delay={0.06 * i}>
              <p className="stat-num"><Counter value={v} delay={0.06 * i} /></p>
              <p className="t-label" style={{ marginTop: 12 }}>{l}</p>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* counts up to the number inside a label like "1.5y" / "4+" */
function Counter({ value, delay = 0 }: { value: string; delay?: number }) {
  const reduce = useReducedMotion();
  const m = value.match(/^([\d.]+)(.*)$/);
  const numeric = !!m;
  const target = m ? parseFloat(m[1]) : 0;
  const suffix = m ? m[2] : "";
  const decimals = m && m[1].includes(".") ? m[1].split(".")[1].length : 0;
  const { ref, v } = useInView(0.4);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!v || !numeric) return;
    if (reduce) { setN(target); return; }
    const controls = animate(0, target, {
      duration: 1.2, delay, ease: EASE,
      onUpdate: x => setN(x),
      onComplete: () => setN(target),
    });
    return () => controls.stop();
    // target/delay/numeric are fixed for a given stat
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v, reduce]);

  if (!numeric) return <span>{value}</span>;
  return <span ref={ref as unknown as React.RefObject<HTMLSpanElement>}>{n.toFixed(decimals)}{suffix}</span>;
}

/* ═════════════════════════════════════════════
   WORK — an index, not a grid of cards
═════════════════════════════════════════════ */
function Work() {
  const [on, setOn] = useState<number | null>(null);
  const fine = useFinePointer();

  return (
    <section id="work" className="section">
      <div className="wrap">
        <SectionHead label="Selected work" count={String(PROJECTS.length).padStart(2, "0")} />

        <div className="list" data-active={on !== null} onMouseLeave={() => setOn(null)}>
          {PROJECTS.map((p, i) => (
            <WorkRow key={p.n} p={p} i={i} on={on === i} fine={fine} onEnter={() => setOn(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkRow({ p, i, on, fine, onEnter }: {
  p: typeof PROJECTS[0]; i: number; on: boolean; fine: boolean; onEnter: () => void;
}) {
  const reduce = useReducedMotion();
  /* on touch there is no hover, so the description simply stays open */
  const openBody = on || !fine;

  return (
    <motion.a
      href={p.link} target="_blank" rel="noreferrer"
      className="row" data-on={on}
      onMouseEnter={onEnter}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: DUR * 0.9, delay: Math.min(i, 4) * 0.05, ease: EASE }}>

      <div className="row-line">
        <span className="t-label">{p.n}</span>
        <span className="row-title">{p.title}</span>
        <span className="row-stack t-meta">{p.stack}</span>
        <span className="row-status t-meta" style={{ textAlign: "right" }}>
          {p.done ? "Shipped" : "In progress"}
        </span>
        <Arrow />
      </div>

      <motion.div
        className="row-body"
        initial={false}
        animate={{ height: openBody ? "auto" : 0, opacity: openBody ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}>
        <p className="row-body-inner t-body">{p.desc}</p>
      </motion.div>
    </motion.a>
  );
}

/* ═════════════════════════════════════════════
   BACKGROUND
═════════════════════════════════════════════ */
function Background() {
  const [on, setOn] = useState<number | null>(null);

  return (
    <section id="background" className="section">
      <div className="wrap">
        <SectionHead label="Background" />

        <div className="list" data-active={on !== null} onMouseLeave={() => setOn(null)}>
          {EXP.map((e, i) => (
            <ExpRow key={e.org} e={e} i={i} on={on === i} onEnter={() => setOn(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpRow({ e, i, on, onEnter }: {
  e: typeof EXP[0]; i: number; on: boolean; onEnter: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={e.link} target="_blank" rel="noreferrer"
      className="row" data-on={on}
      onMouseEnter={onEnter}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: DUR * 0.9, delay: i * 0.05, ease: EASE }}>
      <div className="exp-line">
        <span className="t-label">{e.period}</span>
        <span className="row-title" style={{ fontSize: "clamp(20px, 2.2vw, 28px)" }}>{e.org}</span>
        <span className="exp-desc t-body">
          <span style={{ color: "var(--bone)" }}>{e.role}</span> — {e.desc}
        </span>
        <Arrow />
      </div>
    </motion.a>
  );
}

/* ═════════════════════════════════════════════
   CONTACT
═════════════════════════════════════════════ */
function Contact() {
  const [on, setOn] = useState<number | null>(null);

  return (
    <section id="contact" className="section" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <SectionHead label="Contact" />

        <p className="cta" style={{ marginBottom: "clamp(56px, 8vw, 104px)" }}>
          <Rise>Have a project?</Rise>
          <Rise delay={0.08}><em>Let's build it.</em></Rise>
        </p>

        <div className="list" data-active={on !== null} onMouseLeave={() => setOn(null)}>
          {SOCIALS.map((s, i) => {
            const external = !s.href.startsWith("mailto");
            return (
              <motion.a
                key={s.label}
                href={s.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="row" data-on={on === i}
                onMouseEnter={() => setOn(i)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: DUR * 0.8, delay: i * 0.05, ease: EASE }}>
                <div className="contact-line">
                  <span className="contact-label">{s.label}</span>
                  <span className="contact-handle t-meta">{s.handle}</span>
                  <Arrow />
                </div>
              </motion.a>
            );
          })}
        </div>

        <div className="footer">
          <span className="t-meta">Made with ❤️ in Room 524</span>
          <span className="t-label">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════
   ROOT
═════════════════════════════════════════════ */
export default function Index() {
  return (
    <>
      <Styles />
      <Nav />
      <main>
        <Hero />
        <div className="wrap"><div className="rule" /></div>
        <About />
        <div className="wrap"><div className="rule" /></div>
        <Work />
        <div className="wrap"><div className="rule" /></div>
        <Background />
        <div className="wrap"><div className="rule" /></div>
        <Contact />
      </main>
    </>
  );
}
