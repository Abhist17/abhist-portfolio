import { useState, useEffect, useRef } from "react";
import { Github, Linkedin, Mail, ArrowUpRight, ExternalLink, Twitter, Menu, X } from "lucide-react";
import {
  motion, AnimatePresence, useScroll, useTransform, useSpring,
  useMotionValue, useMotionTemplate, useReducedMotion, animate,
} from "framer-motion";

/* ─────────────────────────────────────────────
   FONTS + GLOBAL MOTION CSS
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
    @keyframes ringPulse {
      0%   { transform: scale(1);   opacity: 0.55; }
      70%  { transform: scale(2.6); opacity: 0; }
      100% { transform: scale(2.6); opacity: 0; }
    }
    @keyframes floatY {
      0%,100% { transform: translateY(0); }
      50%     { transform: translateY(-6px); }
    }

    /* 3D scene primitives */
    .scene    { perspective: 1000px; perspective-origin: 50% 50%; }
    .scene-sm { perspective: 700px; }
    .p3d      { transform-style: preserve-3d; }

    .marquee-track {
      display: flex;
      width: max-content;
      will-change: transform;
    }

    /* Shine sweep used on cards / buttons */
    .glare {
      position: absolute; inset: 0;
      pointer-events: none;
      border-radius: inherit;
      opacity: 0;
      transition: opacity .35s ease;
    }

    @media (max-width: 768px) {
      .hidden-mobile { display: none !important; }
      .show-mobile   { display: flex !important; }
    }

    /* ── MOBILE RESPONSIVE ── */
    @media (max-width: 768px) {

      /* Hero */
      .hero-section {
        padding: 0 20px !important;
      }

      /* About: single column */
      #about > div {
        grid-template-columns: 1fr !important;
        gap: 40px !important;
      }
      #about .sticky-left {
        position: static !important;
      }

      /* Projects: stack number + content + badge vertically */
      .proj-row {
        flex-direction: column !important;
        gap: 16px !important;
      }
      .proj-right {
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 100% !important;
        min-width: unset !important;
      }

      /* Experience: single column */
      .exp-row {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
      }
      .exp-icon { display: none !important; }

      /* Contact heading */
      .contact-heading {
        font-size: clamp(44px, 12vw, 90px) !important;
      }

      /* Contact "Have a project" text */
      .contact-cta {
        font-size: clamp(28px, 9vw, 88px) !important;
      }

      /* Social rows: truncate handle on small screens */
      .social-handle {
        display: none !important;
      }

      /* General section padding */
      .section-pad {
        padding: 64px 20px !important;
      }

      /* Dividers */
      .divider-wrap {
        padding: 0 20px !important;
      }

      /* Navbar inner padding */
      .nav-inner {
        padding: 0 20px !important;
      }

      /* Mobile menu padding */
      .mobile-menu-inner {
        padding: 24px 20px !important;
      }

      /* Stats: tighter on mobile */
      .stats-grid {
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 16px !important;
      }
      .stat-num {
        font-size: 32px !important;
      }

      /* softer perspective on phones */
      .scene { perspective: 700px; }
    }

    @media (prefers-reduced-motion: reduce) {
      .marquee-track { animation: none !important; }
      * { scroll-behavior: auto !important; }
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
  { n:"02", title:"Web3 Todo",              done:true,  stack:"Solidity · JS · HTML",            link:"https://github.com/Abhist17/todo-web3",             desc:"Fully on-chain task manager with immutable state. Built to explore decentralized state persistence and user-owned data." },
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
  { role:"B.Tech CS",   org:"IIIT Nagpur",    period:"2024—2028", desc:"Computer Science. Competitive programming. Building things that matter.",                            link:"https://iiitn.ac.in/" },
];

const SOCIALS = [
  { label:"Email",    handle:"abhistcodes17@gmail.com", href:"mailto:abhistcodes17@gmail.com",                  Icon:Mail     },
  { label:"Twitter",  handle:"@_abhist_",               href:"https://x.com/_abhist_",                          Icon:Twitter  },
  { label:"GitHub",   handle:"Abhist17",                href:"https://github.com/Abhist17",                     Icon:Github   },
  { label:"LinkedIn", handle:"abhist-k-...",            href:"https://www.linkedin.com/in/abhist-k-845079323/", Icon:Linkedin },
];

const NAV = [
  { label:"About",      href:"#about"      },
  { label:"Work",       href:"#projects"   },
  { label:"Background", href:"#experience" },
  { label:"Contact",    href:"#contact"    },
];

const LIME = "#c8ff00";

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useScrolled(n = 40) {
  const [s, set] = useState(false);
  useEffect(() => {
    const f = () => set(window.scrollY > n);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [n]);
  return s;
}

/* true only for real mouse pointers — phones/tablets skip the tilt work */
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

/* pointer position, normalised to [-0.5, 0.5] over the viewport */
function usePointerNorm() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const fine = useFinePointer();
  useEffect(() => {
    if (!fine) return;
    const f = (e: PointerEvent) => {
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", f, { passive: true });
    return () => window.removeEventListener("pointermove", f);
  }, [fine, x, y]);
  return { x, y, fine };
}

/* ─────────────────────────────────────────────
   AMBIENT 3D BACKDROP
   Perspective grid floor + ceiling that drift with
   scroll, plus a lime glow that trails the cursor.
───────────────────────────────────────────── */
function Backdrop() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const { x: px, y: py, fine } = usePointerNorm();

  const shift   = useTransform(scrollY, [0, 4000], [0, 480]);
  const gridY   = useSpring(shift, { stiffness: 60, damping: 24, mass: 0.6 });
  const gridY2  = useTransform(gridY, v => -v * 0.6);
  const orbA    = useTransform(scrollY, [0, 2500], [0, -260]);
  const orbB    = useTransform(scrollY, [0, 2500], [0, 200]);

  /* glow is a transform-only layer (composited) rather than an animated gradient */
  const glowXp = useTransform(px, v => (v + 0.5) * 100);
  const glowYp = useTransform(py, v => (v + 0.5) * 100);
  const glowX  = useSpring(glowXp, { stiffness: 45, damping: 20 });
  const glowY  = useSpring(glowYp, { stiffness: 45, damping: 20 });
  const glowT  = useMotionTemplate`translate3d(calc(${glowX}vw - 50%), calc(${glowY}vh - 50%), 0)`;

  const grid = `
    linear-gradient(to right, rgba(200,255,0,0.10) 1px, transparent 1px) 0 0 / 64px 64px,
    linear-gradient(to bottom, rgba(200,255,0,0.10) 1px, transparent 1px) 0 0 / 64px 64px
  `;

  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>

      {/* floor plane — the grid itself only ever translates, so it stays composited */}
      <div style={{
        position: "absolute", left: "-25%", right: "-25%", bottom: "-10%", height: "70vh",
        perspective: 420, overflow: "hidden",
        maskImage: "linear-gradient(to bottom, transparent, #000 35%, transparent 92%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 35%, transparent 92%)",
        opacity: 0.5,
      }}>
        <div style={{ position: "absolute", inset: 0, transform: "rotateX(72deg)", transformOrigin: "50% 0%" }}>
          <motion.div style={{
            position: "absolute", left: 0, right: 0, top: "-100%", height: "300%",
            backgroundImage: grid,
            y: reduce ? 0 : gridY,
            willChange: "transform",
          }} />
        </div>
      </div>

      {/* ceiling plane */}
      <div style={{
        position: "absolute", left: "-25%", right: "-25%", top: "-10%", height: "55vh",
        perspective: 520, overflow: "hidden",
        maskImage: "linear-gradient(to top, transparent, #000 40%, transparent 95%)",
        WebkitMaskImage: "linear-gradient(to top, transparent, #000 40%, transparent 95%)",
        opacity: 0.28,
      }}>
        <div style={{ position: "absolute", inset: 0, transform: "rotateX(-72deg)", transformOrigin: "50% 100%" }}>
          <motion.div style={{
            position: "absolute", left: 0, right: 0, top: "-100%", height: "300%",
            backgroundImage: grid,
            y: reduce ? 0 : gridY2,
            willChange: "transform",
          }} />
        </div>
      </div>

      {/* drifting orbs */}
      <motion.div
        style={{
          position: "absolute", top: "18%", left: "8%", width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,255,0,0.06), transparent 70%)",
          y: reduce ? 0 : orbA,
        }}
      />
      <motion.div
        style={{
          position: "absolute", top: "58%", right: "4%", width: 460, height: 460, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,255,0,0.05), transparent 70%)",
          y: reduce ? 0 : orbB,
        }}
      />

      {/* cursor glow */}
      {fine && !reduce && (
        <motion.div style={{
          position: "absolute", top: 0, left: 0, width: 720, height: 720,
          background: "radial-gradient(circle closest-side, rgba(200,255,0,0.07), transparent)",
          transform: glowT, willChange: "transform",
        }} />
      )}

      {/* vignette keeps text crisp on top of the grid */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(120% 90% at 50% 40%, transparent 40%, rgba(10,10,10,0.85) 100%)",
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCROLL PROGRESS RAIL
───────────────────────────────────────────── */
function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 60,
        transformOrigin: "0% 50%", scaleX: sx,
        background: `linear-gradient(90deg, transparent, ${LIME})`,
        boxShadow: `0 0 12px rgba(200,255,0,0.55)`,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   TILT — pointer-driven 3D card
───────────────────────────────────────────── */
function Tilt3D({
  children, max = 6, lift = 14, glare = true, className = "", style = {}, radius = 4,
}: {
  children: React.ReactNode; max?: number; lift?: number; glare?: boolean;
  className?: string; style?: React.CSSProperties; radius?: number;
}) {
  const fine   = useFinePointer();
  const reduce = useReducedMotion();
  const on     = fine && !reduce;

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const [hov, setHov] = useState(false);

  const spring = { stiffness: 220, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(my, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-max, max]), spring);
  const z       = useSpring(0, spring);

  const gx = useTransform(mx, v => `${v * 100}%`);
  const gy = useTransform(my, v => `${v * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(340px circle at ${gx} ${gy}, rgba(200,255,0,0.10), transparent 60%)`;

  if (!on) return <div className={className} style={style}>{children}</div>;

  return (
    <div className={`scene ${className}`} style={style}>
      <motion.div
        className="p3d"
        style={{ rotateX, rotateY, z, position: "relative", borderRadius: radius }}
        onPointerMove={e => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerEnter={() => { setHov(true); z.set(lift); }}
        onPointerLeave={() => { setHov(false); mx.set(0.5); my.set(0.5); z.set(0); }}
      >
        {children}
        {glare && (
          <motion.div
            className="glare"
            style={{ background: sheen, opacity: hov ? 1 : 0, borderRadius: radius }}
          />
        )}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   REVEAL WRAPPER — now a 3D hinge-in
───────────────────────────────────────────── */
function R({ children, d = 0, y = 18, className = "" }:
  { children: React.ReactNode; d?: number; y?: number; className?: string }) {
  const { ref, v } = useInView();
  const reduce = useReducedMotion();
  return (
    <div className="scene" style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        className={`p3d ${className}`}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y, rotateX: -14 }}
        animate={v ? (reduce ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }) : {}}
        transition={{ duration: 0.75, delay: d, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "50% 0%" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   3D TEXT — letters flip up from the floor
───────────────────────────────────────────── */
function Text3D({
  text, className = "", style = {}, delay = 0, stagger = 0.03, once = true, animateNow,
}: {
  text: string; className?: string; style?: React.CSSProperties;
  delay?: number; stagger?: number; once?: boolean; animateNow?: boolean;
}) {
  const reduce = useReducedMotion();
  const letters = Array.from(text);

  const child = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, rotateX: -95, y: "0.35em", z: -40 },
        show:   { opacity: 1, rotateX: 0, y: 0, z: 0,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
      };

  return (
    <motion.span
      className={`scene ${className}`}
      style={{ display: "inline-block", transformStyle: "preserve-3d", ...style }}
      variants={{ show: { transition: { delayChildren: delay, staggerChildren: stagger } } }}
      initial="hidden"
      {...(animateNow !== undefined
        ? { animate: animateNow ? "show" : "hidden" }
        : { whileInView: "show", viewport: { once, amount: 0.5 } })}
    >
      {letters.map((c, i) => (
        <motion.span
          key={i}
          variants={child}
          style={{ display: "inline-block", transformOrigin: "50% 100%", transformStyle: "preserve-3d", whiteSpace: "pre" }}
        >
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ─────────────────────────────────────────────
   DIVIDER — now a 3D marquee rail
───────────────────────────────────────────── */
function Divider({ label }: { label: string }) {
  const reduce = useReducedMotion();
  const items = Array.from({ length: 10 }, (_, i) => i);
  /* the rail only scrolls while it's on screen — no idle rAF work on phones */
  const railRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setLive(e.isIntersecting));
    if (railRef.current) obs.observe(railRef.current);
    return () => obs.disconnect();
  }, []);

  const Strip = () => (
    <>
      {items.map(i => (
        <span key={i} className="fr" style={{
          fontSize: 9, color: i % 2 ? "rgba(200,255,0,0.35)" : LIME,
          letterSpacing: "0.35em", textTransform: "uppercase",
          padding: "0 22px", flexShrink: 0,
        }}>
          {label} <span style={{ opacity: 0.5 }}>◆</span>
        </span>
      ))}
    </>
  );

  return (
    <div ref={railRef} className="divider-wrap scene" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", perspective: 500 }}>
      <motion.div
        initial={{ opacity: 0, rotateX: -30, scaleX: 0.85 }}
        whileInView={{ opacity: 1, rotateX: 0, scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="p3d"
        style={{
          borderTop: "1px solid #2a2a2a",
          padding: "8px 0",
          overflow: "hidden",
          maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        }}
      >
        <motion.div
          className="marquee-track"
          animate={reduce || !live ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 26, ease: "linear", repeat: Infinity }}
        >
          <Strip /><Strip />
        </motion.div>
      </motion.div>
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
        initial={{ y: -56, opacity: 0, rotateX: -25 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          transformOrigin: "50% 0%",
          background: scrolled ? "rgba(10,10,10,0.72)" : "transparent",
          borderBottom: scrolled ? "1px solid #2a2a2a" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          boxShadow: scrolled ? "0 18px 40px -30px rgba(200,255,0,0.5)" : "none",
          transition: "background .4s, border-color .4s, box-shadow .4s, backdrop-filter .4s",
        }}>
        <div className="nav-inner" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <motion.a href="#" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
            onMouseEnter={e => {
              (e.currentTarget.querySelector("img") as HTMLImageElement).style.filter = "none";
              (e.currentTarget.querySelector("span") as HTMLElement).style.color = LIME;
            }}
            onMouseLeave={e => {
              (e.currentTarget.querySelector("img") as HTMLImageElement).style.filter = "grayscale(1)";
              (e.currentTarget.querySelector("span") as HTMLElement).style.color = "#ffffff";
            }}>
            <motion.div
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: 26, height: 26, borderRadius: 3, overflow: "hidden", border: "1px solid #333", flexShrink: 0, transformStyle: "preserve-3d" }}>
              <img src="/photos/abhiii.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)", transition: "filter 0.3s" }} />
            </motion.div>
            <span className="fr" style={{ fontSize: 10, color: "#ffffff", letterSpacing: "0.3em", textTransform: "uppercase", transition: "color 0.2s" }}>ABHIST.DEV</span>
          </motion.a>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 36 }} className="hidden-mobile">
            {NAV.map(n => <NavItem key={n.label} label={n.label} href={n.href} />)}
          </nav>

          <motion.button onClick={() => setOpen(o => !o)} className="show-mobile"
            whileTap={{ scale: 0.85 }}
            style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", padding: 4, display: "none", alignItems: "center" }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={open ? "x" : "m"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex" }}>
                {open ? <X size={16} /> : <Menu size={16} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, rotateX: -18, y: -8 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, rotateX: -12, y: -8 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed", top: 56, left: 0, right: 0, zIndex: 40,
              background: "rgba(10,10,10,0.96)", backdropFilter: "blur(14px)",
              borderBottom: "1px solid #2a2a2a",
              transformOrigin: "50% 0%", perspective: 800,
            }}>
            <div className="mobile-menu-inner" style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 40px", display: "flex", flexDirection: "column", gap: 20 }}>
              {NAV.map((n, i) => (
                <motion.a key={n.label} href={n.href} onClick={() => setOpen(false)} className="fr"
                  initial={{ opacity: 0, x: -18, rotateY: -25 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.06 * i + 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  whileTap={{ x: 6, color: LIME }}
                  style={{ fontSize: 11, color: "#ffffff", letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none", transformOrigin: "0% 50%" }}>
                  {n.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ label, href }: { label: string; href: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} className="fr scene-sm"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: "relative", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none", display: "inline-block", perspective: 300 }}>
      {/* flipping label: white face rolls out, lime face rolls in */}
      <span className="p3d" style={{ display: "inline-block", position: "relative", transformStyle: "preserve-3d" }}>
        <motion.span
          animate={{ rotateX: hov ? 90 : 0, opacity: hov ? 0 : 1 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "inline-block", color: "#ffffff", transformOrigin: "50% 100%", backfaceVisibility: "hidden" }}>
          {label}
        </motion.span>
        <motion.span
          animate={{ rotateX: hov ? 0 : -90, opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "absolute", left: 0, top: 0, display: "inline-block", color: LIME, transformOrigin: "50% 0%", backfaceVisibility: "hidden", whiteSpace: "nowrap" }}>
          {label}
        </motion.span>
      </span>
      <motion.span
        animate={{ scaleX: hov ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "absolute", left: 0, right: 0, bottom: -6, height: 1, background: LIME, transformOrigin: "0% 50%" }}
      />
    </a>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
  const role   = useTyper();
  const reduce = useReducedMotion();
  const ref    = useRef<HTMLElement>(null);
  const { x: px, y: py, fine } = usePointerNorm();

  /* scroll: hero recedes into the scene as you leave it */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroY       = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const heroRotateX = useTransform(scrollYProgress, [0, 1], [0, 16]);
  const heroZ       = useTransform(scrollYProgress, [0, 1], [0, -260]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  /* pointer: the name block turns to face the cursor */
  const sp    = { stiffness: 90, damping: 18, mass: 0.6 };
  const tiltY = useSpring(useTransform(px, [-0.5, 0.5], [-11, 11]), sp);
  const tiltX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), sp);

  /* two depth layers so the name floats in front of the copy */
  const l1x = useSpring(useTransform(px, [-0.5, 0.5], [-18, 18]), sp);
  const l1y = useSpring(useTransform(py, [-0.5, 0.5], [-11, 11]), sp);
  const l2x = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), sp);
  const l2y = useSpring(useTransform(py, [-0.5, 0.5], [-5.5, 5.5]), sp);
  const l1  = { x: l1x, y: l1y };
  const l2  = { x: l2x, y: l2y };

  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 150); return () => clearTimeout(t); }, []);

  return (
    <section ref={ref} className="hero-section scene" style={{
      position: "relative", zIndex: 1,
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "space-between", padding: "0 40px",
      maxWidth: 1100, margin: "0 auto", perspective: 1200,
    }}>
      <motion.div
        className="p3d"
        style={reduce ? {} : { y: heroY, rotateX: heroRotateX, z: heroZ, opacity: heroOpacity, transformOrigin: "50% 0%" }}
      >
        {/* top row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 80 }}>
          <span className="fr" style={{ fontSize: 9, color: "#ffffff", letterSpacing: "0.4em", textTransform: "uppercase" }}>
            Nagpur, IN
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ position: "relative", width: 7, height: 7, display: "inline-block" }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: LIME, animation: "pulse 2s infinite" }} />
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${LIME}`, animation: "ringPulse 2.4s ease-out infinite" }} />
            </span>
            <span className="fr" style={{ fontSize: 9, color: LIME, letterSpacing: "0.3em", textTransform: "uppercase" }}>Open to Buidl</span>
          </div>
        </motion.div>

        {/* center */}
        <div style={{ paddingBottom: 20 }}>
          {/* NAME — 3D letters + parallax layers */}
          <motion.div
            className="p3d"
            style={fine && !reduce ? { rotateX: tiltX, rotateY: tiltY, ...l1 } : {}}
          >
            <h1 className="bb p3d" style={{
              fontSize: "clamp(56px, 19vw, 160px)", color: "#f0f0f0", lineHeight: 0.87,
              letterSpacing: "-0.01em", userSelect: "none", margin: 0,
              textShadow: "0 22px 60px rgba(0,0,0,0.9)",
            }}>
              <span style={{ display: "block" }}>
                <Text3D text="ABHIST" animateNow={ready} delay={0.05} stagger={0.05} />
              </span>
              <span style={{ display: "block" }}>
                <Text3D text="KAMLE" animateNow={ready} delay={0.28} stagger={0.05} />
              </span>
            </h1>
          </motion.div>

          <motion.div className="p3d" style={fine && !reduce ? l2 : {}}>
            {/* Typewriter */}
            <motion.div
              initial={{ opacity: 0, rotateX: -40 }} animate={{ opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.75, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28, transformOrigin: "50% 100%" }}>
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 0.85, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: 28, height: 1, background: LIME, flexShrink: 0, transformOrigin: "0% 50%", boxShadow: `0 0 10px ${LIME}` }} />
              <span className="dm" style={{ fontSize: 15, color: LIME, letterSpacing: "0.04em", minHeight: "1.4em", textShadow: "0 0 18px rgba(200,255,0,0.35)" }}>
                {role}
                <span style={{ display: "inline-block", width: 2, height: 15, background: LIME, marginLeft: 2, verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
              </span>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 16, rotateX: -18 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="dm"
              style={{ fontSize: 13, color: "#cccccc", maxWidth: 440, lineHeight: 1.9, marginTop: 28, transformOrigin: "50% 0%" }}>
              1.5 yrs into Web3. Eth &amp; Solana dev. Proficient in Solidity &amp; Rust. B.Tech CS @ IIIT Nagpur. Web3 Lead at Elevate Club. Core member of Bhaisaaab DAO. Won couple of hackathons. Competitive programmer.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.5 }}
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
          </motion.div>
        </div>
      </motion.div>

      {/* bottom */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.5 }}
        style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingBottom: 32 }}>
        <motion.span className="fr"
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ fontSize: 9, color: "#aaaaaa", letterSpacing: "0.4em", textTransform: "uppercase" }}>Scroll ↓</motion.span>
        <span className="fr" style={{ fontSize: 9, color: "#aaaaaa", letterSpacing: "0.4em", textTransform: "uppercase" }}>@_abhist_</span>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   HOVER BUTTON — magnetic + 3D
───────────────────────────────────────────── */
function HoverBtn({ href, children, primary, target }: {
  href: string; children: React.ReactNode; primary?: boolean; target?: string;
}) {
  const [hov, setHov] = useState(false);
  const fine   = useFinePointer();
  const reduce = useReducedMotion();
  const on     = fine && !reduce;

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const sp  = { stiffness: 300, damping: 20, mass: 0.4 };
  const x   = useSpring(mvX, sp);
  const y   = useSpring(mvY, sp);
  const rY  = useSpring(useTransform(mvX, [-40, 40], [-14, 14]), sp);
  const rX  = useSpring(useTransform(mvY, [-20, 20], [10, -10]), sp);

  return (
    <div className="scene" style={{ perspective: 500 }}>
      <motion.a
        href={href} target={target} rel={target ? "noreferrer" : undefined}
        whileTap={{ scale: 0.95 }}
        onPointerMove={e => {
          if (!on) return;
          const r = e.currentTarget.getBoundingClientRect();
          mvX.set((e.clientX - r.left - r.width / 2) * 0.35);
          mvY.set((e.clientY - r.top - r.height / 2) * 0.5);
        }}
        onPointerEnter={() => setHov(true)}
        onPointerLeave={() => { setHov(false); mvX.set(0); mvY.set(0); }}
        className="fr p3d"
        style={{
          x: on ? x : 0, y: on ? y : 0,
          rotateX: on ? rX : 0, rotateY: on ? rY : 0,
          position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center",
          padding: "10px 20px", fontSize: 11,
          letterSpacing: "0.25em", textTransform: "uppercase",
          textDecoration: "none", borderRadius: 2,
          border: primary ? "none" : `1px solid ${hov ? LIME : "#857878"}`,
          background: primary ? (hov ? "#d5ff33" : LIME) : "transparent",
          color: primary ? "#0a0a0a" : (hov ? LIME : "#ffffff"),
          boxShadow: hov
            ? (primary ? "0 18px 40px -18px rgba(200,255,0,0.85)" : "0 18px 40px -22px rgba(200,255,0,0.6)")
            : "none",
          transition: "background .2s, border-color .2s, color .2s, box-shadow .3s",
          cursor: "pointer",
        }}>
        {/* shine sweep */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ x: hov ? "180%" : "-120%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute", top: 0, bottom: 0, width: "60%",
            background: primary
              ? "linear-gradient(105deg, transparent, rgba(255,255,255,0.55), transparent)"
              : "linear-gradient(105deg, transparent, rgba(200,255,0,0.22), transparent)",
            pointerEvents: "none",
          }}
        />
        <span style={{ display: "flex", alignItems: "center", position: "relative" }}>{children}</span>
      </motion.a>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION HEADING
───────────────────────────────────────────── */
function Heading({ text, size = 52, className = "" }: { text: string; size?: number | string; className?: string }) {
  return (
    <h2 className={`bb ${className}`} style={{ fontSize: size, color: "#f0f0f0", lineHeight: 1, letterSpacing: "0.03em", margin: 0 }}>
      <Text3D text={text} stagger={0.045} />
    </h2>
  );
}

/* ─────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────── */
function About() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="about" ref={ref} className="section-pad scene" style={{ position: "relative", zIndex: 1, padding: "96px 40px", maxWidth: 1100, margin: "0 auto", perspective: 1200 }}>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 80, alignItems: "start" }}>

        {/* Left sticky */}
        <R d={0.05}>
          <div className="sticky-left" style={{ position: "sticky", top: 88 }}>
            <span className="fr" style={{ fontSize: 9, color: "#aaaaaa", letterSpacing: "0.4em", textTransform: "uppercase" }}></span>
            <div style={{ marginTop: 8, marginBottom: 36 }}><Heading text="About" /></div>

            {Object.entries(SKILLS).map(([cat, items], ci) => (
              <div key={cat} style={{ marginBottom: 24 }}>
                <span className="fr" style={{ fontSize: 9, color: "#aaaaaa", letterSpacing: "0.35em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>{cat}</span>
                <div className="scene" style={{ display: "flex", flexWrap: "wrap", gap: 6, perspective: 600 }}>
                  {items.map((s, i) => <SkillTag key={s} delay={0.04 * i + 0.08 * ci}>{s}</SkillTag>)}
                </div>
              </div>
            ))}
          </div>
        </R>

        {/* Right text */}
        <motion.div style={{ display: "flex", flexDirection: "column", gap: 28, y: reduce ? 0 : drift }}>
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
            <div className="stats-grid" style={{ borderTop: "1px solid #2a2a2a", paddingTop: 28, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 8 }}>
              {[["1.5y", "Web3 exp"], ["4+", "Projects"], ["3+", "Communities"]].map(([v, l], i) => (
                <Tilt3D key={l} max={10} lift={20} radius={4}>
                  <div style={{ padding: "4px 2px" }}>
                    <p className="bb stat-num" style={{ fontSize: 42, color: LIME, lineHeight: 1, letterSpacing: "0.04em", textShadow: "0 0 24px rgba(200,255,0,0.28)" }}>
                      <Counter value={v} delay={0.1 * i} />
                    </p>
                    <p className="fr" style={{ fontSize: 9, color: "#aaaaaa", letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 8 }}>{l}</p>
                  </div>
                </Tilt3D>
              ))}
            </div>
          </R>
        </motion.div>
      </div>
    </section>
  );
}

/* counts up to the number inside a label like "1.5y" / "4+" — text is unchanged once settled */
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
      duration: 1.1, delay, ease: [0.16, 1, 0.3, 1],
      onUpdate: x => setN(x),
      onComplete: () => setN(target),
    });
    return () => controls.stop();
    // target/delay/numeric are constant for a given stat
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v, reduce]);

  if (!numeric) return <span>{value}</span>;
  return <span ref={ref as unknown as React.RefObject<HTMLSpanElement>}>{n.toFixed(decimals)}{suffix}</span>;
}

function SkillTag({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.span className="dm p3d"
      initial={{ opacity: 0, rotateX: -80, y: 8 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ rotateX: -12, rotateY: 12, z: 24, scale: 1.06 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{
        display: "inline-block",
        fontSize: 11, padding: "5px 10px",
        border: `1px solid ${hov ? LIME : "#333"}`,
        color: hov ? LIME : "#ffffff",
        borderRadius: 2, cursor: "default",
        transformOrigin: "50% 100%",
        background: hov ? "rgba(140, 170, 32, 0.1)" : "transparent",
        boxShadow: hov ? "0 14px 26px -18px rgba(200,255,0,0.9)" : "none",
        transition: "background .2s, border-color .2s, color .2s, box-shadow .3s",
      }}>
      {children}
    </motion.span>
  );
}

/* ─────────────────────────────────────────────
   PROJECTS
───────────────────────────────────────────── */
function Projects() {
  return (
    <section id="projects" className="section-pad" style={{ position: "relative", zIndex: 1, padding: "96px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <R d={0}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 56 }}>
          <Heading text="Work" />
          <span className="fr" style={{ fontSize: 9, color: "#aaaaaa", letterSpacing: "0.4em", textTransform: "uppercase" }}></span>
        </div>
      </R>
      {PROJECTS.map((p, i) => <ProjectRow key={p.n} p={p} i={i} />)}
      <div style={{ borderTop: "1px solid #2a2a2a" }} />
    </section>
  );
}

function ProjectRow({ p, i }: { p: typeof PROJECTS[0]; i: number }) {
  const [hov, setHov] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="p3d"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, rotateX: -22, z: -80 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0, z: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.8, delay: Math.min(i, 3) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: "50% 100%", perspective: 1200 }}
    >
      <Tilt3D max={4} lift={26} radius={4}>
        <a href={p.link} target="_blank" rel="noreferrer"
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          className="proj-row"
          style={{
            display: "flex", alignItems: "flex-start", gap: 40, padding: "28px 16px 28px 0",
            borderTop: `1px solid ${hov ? "rgba(200,255,0,0.35)" : "#2a2a2a"}`,
            textDecoration: "none", transition: "border-color 0.25s ease, background 0.25s ease, box-shadow .35s ease",
            background: hov ? "rgba(200,255,0,0.035)" : "transparent",
            boxShadow: hov ? "0 30px 60px -40px rgba(200,255,0,0.7)" : "none",
          }}>

          {/* Number */}
          <motion.span className="fr"
            animate={{ color: hov ? LIME : "#ffffff", z: hov ? 30 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ fontSize: 10, width: 20, flexShrink: 0, marginTop: 2, display: "inline-block", transformStyle: "preserve-3d" }}>
            {p.n}
          </motion.span>

          {/* Content */}
          <div className="p3d" style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <motion.h3 className="bb"
                animate={{ color: hov ? LIME : "#ffffff", z: hov ? 40 : 0, x: hov ? 6 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                style={{ fontSize: 28, letterSpacing: "0.05em", margin: 0, transformStyle: "preserve-3d" }}>
                {p.title}
              </motion.h3>
              <motion.span
                animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -6, y: hov ? 0 : 6, rotate: hov ? 0 : -35 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ display: "flex", color: LIME }}>
                <ArrowUpRight size={15} />
              </motion.span>
            </div>
            <p className="dm" style={{ fontSize: 12, color: hov ? "#ffffff" : "#cccccc", lineHeight: 1.7, margin: 0, transition: "color 0.25s" }}>
              {p.desc}
            </p>
          </div>

          {/* Right side */}
          <motion.div className="proj-right p3d"
            animate={{ z: hov ? 28 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0, minWidth: 100 }}>
            <span className="fr" style={{
              fontSize: 9, padding: "3px 8px", borderRadius: 2, letterSpacing: "0.3em",
              border: `1px solid ${p.done ? "rgba(200,255,0,0.5)" : "#ca3c3c"}`,
              color: p.done ? LIME : "#ffffff",
              background: p.done ? "rgba(200,255,0,0.08)" : "#ca3030",
              boxShadow: hov ? (p.done ? "0 0 18px rgba(200,255,0,0.35)" : "0 0 18px rgba(202,48,48,0.45)") : "none",
              transition: "box-shadow .3s",
            }}>
              {p.done ? "SHIPPED" : "WIP"}
            </span>
            <span className="fr" style={{ fontSize: 12, color: hov ? LIME : "#c4c4c4", textAlign: "right", lineHeight: 1.6, transition: "color 0.25s" }}>
              {p.stack}
            </span>
          </motion.div>
        </a>
      </Tilt3D>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   EXPERIENCE
───────────────────────────────────────────── */
function Experience() {
  return (
    <section id="experience" className="section-pad" style={{ position: "relative", zIndex: 1, padding: "96px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <R d={0}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 56 }}>
          <Heading text="Background" />
          <span className="fr" style={{ fontSize: 9, color: "#aaaaaa", letterSpacing: "0.4em", textTransform: "uppercase" }}></span>
        </div>
      </R>
      {EXP.map((e, i) => <ExpRow key={e.org} e={e} i={i} />)}
      <div style={{ borderTop: "1px solid #2a2a2a" }} />
    </section>
  );
}

function ExpRow({ e, i }: { e: typeof EXP[0]; i: number }) {
  const [hov, setHov] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="p3d"
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: i % 2 ? 40 : -40, rotateY: i % 2 ? -18 : 18, z: -60 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, x: 0, rotateY: 0, z: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.85, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200, transformOrigin: i % 2 ? "100% 50%" : "0% 50%" }}
    >
      <Tilt3D max={4} lift={22} radius={4}>
        <a href={e.link} target="_blank" rel="noreferrer"
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          className="exp-row"
          style={{
            display: "grid", gridTemplateColumns: "160px 1fr 20px", gap: 40, padding: "28px 16px 28px 0",
            borderTop: `1px solid ${hov ? "rgba(200,255,0,0.35)" : "#2a2a2a"}`,
            textDecoration: "none", alignItems: "start",
            transition: "border-color 0.25s, background 0.25s, box-shadow .35s",
            background: hov ? "rgba(200,255,0,0.035)" : "transparent",
            boxShadow: hov ? "0 30px 60px -40px rgba(200,255,0,0.6)" : "none",
          }}>
          <motion.div className="p3d" animate={{ z: hov ? 34 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
            <p className="bb" style={{ fontSize: 20, color: hov ? LIME : "#ffffff", transition: "color 0.25s", letterSpacing: "0.05em", margin: "0 0 6px" }}>{e.org}</p>
            <p className="fr" style={{ fontSize: 9, color: hov ? LIME : "#aaaaaa", letterSpacing: "0.35em", margin: 0, transition: "color 0.25s" }}>{e.period}</p>
          </motion.div>
          <motion.div className="p3d" animate={{ z: hov ? 18 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
            <p className="dm" style={{ fontSize: 12, color: hov ? LIME : "#ffffff", margin: "0 0 8px", transition: "color 0.25s" }}>{e.role}</p>
            <p className="dm" style={{ fontSize: 12, color: hov ? "#dddddd" : "#cccccc", lineHeight: 1.75, margin: 0, transition: "color 0.25s" }}>{e.desc}</p>
          </motion.div>
          <motion.span className="exp-icon"
            animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -6, y: hov ? 0 : 6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ display: "flex", color: LIME, marginTop: 2 }}>
            <ExternalLink size={13} />
          </motion.span>
        </a>
      </Tilt3D>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
function Contact() {
  return (
    <section id="contact" className="section-pad" style={{ position: "relative", zIndex: 1, padding: "96px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <R d={0}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 56 }}>
          <h2 className="bb contact-heading" style={{ fontSize: 90, color: "#f0f0f0", lineHeight: 1, letterSpacing: "0.03em", margin: 0 }}>
            <Text3D text="Contact" stagger={0.05} />
          </h2>
        </div>
      </R>

      <div className="scene" style={{ perspective: 1000 }}>
        <motion.p
          className="bb contact-cta p3d"
          initial={{ opacity: 0, rotateX: -35, y: 30 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: "clamp(36px, 8vw, 88px)", color: LIME, lineHeight: 0.95, marginBottom: 56,
            transformOrigin: "50% 100%", textShadow: "0 0 60px rgba(200,255,0,0.22)",
          }}>
          Have a project?<br />
          <span style={{ color: "#f0f0f0", textShadow: "0 20px 50px rgba(0,0,0,0.9)" }}>Let's build it.</span>
        </motion.p>
      </div>

      {SOCIALS.map((s, i) => <ContactRow key={s.label} s={s} i={i} />)}
      <div style={{ borderTop: "1px solid #2a2a2a" }} />

      <R d={0.38}>
        <div style={{ marginTop: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <motion.span className="fr"
            whileHover={{ scale: 1.03, color: LIME }}
            style={{ fontSize: 12, color: "#f3f8f6", letterSpacing: "0.4em", display: "inline-block" }}>
            Made with ❤️ in Room 524
          </motion.span>
        </div>
      </R>
    </section>
  );
}

function ContactRow({ s, i }: { s: typeof SOCIALS[0]; i: number }) {
  const [hov, setHov] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="p3d"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, rotateX: -25 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000, transformOrigin: "50% 100%" }}
    >
      <Tilt3D max={3} lift={18} radius={4}>
        <a
          href={s.href}
          target={s.href.startsWith("mailto") ? undefined : "_blank"}
          rel={s.href.startsWith("mailto") ? undefined : "noreferrer"}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 12px 20px 0",
            borderTop: `1px solid ${hov ? "rgba(200,255,0,0.35)" : "#2a2a2a"}`,
            textDecoration: "none",
            transition: "border-color 0.25s, background 0.25s, box-shadow .35s",
            background: hov ? "rgba(200,255,0,0.035)" : "transparent",
            boxShadow: hov ? "0 24px 50px -40px rgba(200,255,0,0.7)" : "none",
          }}>
          <motion.div className="p3d"
            animate={{ z: hov ? 26 : 0, x: hov ? 6 : 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <motion.span
              animate={{ rotateY: hov ? 360 : 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", color: hov ? LIME : "#ffffff", transformStyle: "preserve-3d", flexShrink: 0 }}>
              <s.Icon size={13} />
            </motion.span>
            <span className="fr" style={{ fontSize: 10, color: hov ? LIME : "#ffffff", letterSpacing: "0.35em", textTransform: "uppercase", transition: "color 0.25s" }}>{s.label}</span>
          </motion.div>
          <motion.div className="p3d"
            animate={{ z: hov ? 18 : 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span className="dm social-handle" style={{ fontSize: 12, color: hov ? LIME : "#cccccc", transition: "color 0.25s" }}>{s.handle}</span>
            <motion.span
              animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -6, y: hov ? 0 : 6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ display: "flex", color: LIME }}>
              <ArrowUpRight size={13} />
            </motion.span>
          </motion.div>
        </a>
      </Tilt3D>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function Index() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", position: "relative" }}>
      <Backdrop />
      <ScrollRail />
      <Navbar />
      <main style={{ position: "relative", zIndex: 1 }}>
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
