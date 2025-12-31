import { useState, useEffect, useRef } from "react";
import { Github, Linkedin, Mail, ArrowDown, ExternalLink, Sparkles, Code2, Zap, Briefcase, GraduationCap, FileText, Folder, User, Layers, Twitter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomCursor from "@/components/CustomCursor";

// ============================================
// CONTENT - Edit these to customize your portfolio
// ============================================

const CONTENT = {
  name: "Abhist Kamle",
  tagline: "Web3 Developer",
  roles: ["Web3 Developer", "Blockchain Enthusiast", "Smart Contract Developer", "DeFi Builder"],
  bio: {
    whoAmI: `I'm a passionate Web3 developer diving deep into the decentralized future. 
             Self-taught and driven by curiosity, I believe in building transparent, 
             trustless systems that empower users worldwide.`,
    whatIDo: `I design and develop decentralized applications, smart contracts, and 
              blockchain solutions. From DeFi protocols to NFT platforms, I craft 
              experiences that bridge the gap between complex technology and seamless UX.`,
  },
  skills: ["Solidity", "Ethereum", "React", "Next.js", "TypeScript", "Hardhat", "Web3.js", "IPFS", "Rust", "Tailwind"],
  projects: [
    {
      title: "DeFi Swap Protocol",
      description: "Decentralized token swap with automated market making",
      link: "https://github.com",
      icon: Zap,
      tags: ["Solidity", "React", "Hardhat"],
    },
    {
      title: "NFT Marketplace",
      description: "Full-featured marketplace for digital collectibles",
      link: "https://github.com",
      icon: Sparkles,
      tags: ["ERC-721", "IPFS", "Next.js"],
    },
    {
      title: "DAO Governance",
      description: "On-chain voting and proposal management system",
      link: "https://github.com",
      icon: Layers,
      tags: ["Solidity", "TheGraph", "React"],
    },
    {
      title: "Crypto Dashboard",
      description: "Real-time portfolio tracking and analytics",
      link: "https://github.com",
      icon: Code2,
      tags: ["TypeScript", "Web3.js", "Charts"],
    },
  ],
  experience: [
    {
      role: "Web3 Developer",
      company: "Freelance",
      period: "2023 - Present",
      description: "Building decentralized applications and smart contracts for various clients",
    },
    {
      role: "Computer Science Student",
      company: "XYZ University",
      period: "2021 - Present",
      description: "Pursuing B.Tech in Computer Science with focus on blockchain technology",
    },
  ],
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "mailto:hello@abhistkamle.dev",
  },
  resumeLink: "#",
};

const NAV_ITEMS = [
  { label: "About", href: "#about", icon: User },
  { label: "Projects", href: "#projects", icon: Folder },
  { label: "Experience", href: "#experience", icon: Briefcase },
  { label: "Contact", href: "#contact", icon: Mail },
];

// ============================================
// ANIMATION VARIANTS
// ============================================

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

// ============================================
// SIMPLE TYPEWRITER HOOK (NO LOOP - TYPES ONCE)
// ============================================

const useTypewriter = (text: string, speed: number = 100, delay: number = 0) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;

    const animate = () => {
      if (currentIndex < text.length) {
        currentIndex++;
        setDisplayText(text.slice(0, currentIndex));
        timeout = setTimeout(animate, speed);
      } else {
        setIsComplete(true);
      }
    };

    const initialDelay = setTimeout(animate, delay);

    return () => {
      clearTimeout(timeout);
      clearTimeout(initialDelay);
    };
  }, [text, speed, delay]);

  return { displayText, isComplete };
};

// ============================================
// WEB2 -> WEB3 TYPEWRITER HOOK (LOOPING)
// ============================================

const useWeb3Typewriter = (startDelay: number = 1500) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentText = "";
    let sequenceIndex = 0;
    let charIndex = 0;
    let timeout: NodeJS.Timeout;

    const sequence = [
      { action: "type", text: "Web2", speed: 120 },
      { action: "pause", duration: 600 },
      { action: "delete", count: 1, speed: 80 },
      { action: "pause", duration: 300 },
      { action: "type", text: "3", speed: 120 },
      { action: "pause", duration: 200 },
      { action: "type", text: " Developer", speed: 100 },
      { action: "pause", duration: 1000 },
      { action: "deleteAll", speed: 50 },
      { action: "pause", duration: 1000 },
      { action: "restart" },
    ];

    const processSequence = () => {
      if (sequenceIndex >= sequence.length) return;

      const step = sequence[sequenceIndex];

      if (step.action === "type") {
        if (charIndex < step.text.length) {
          currentText += step.text[charIndex];
          setDisplayText(currentText);
          charIndex++;
          timeout = setTimeout(processSequence, step.speed);
        } else {
          charIndex = 0;
          sequenceIndex++;
          timeout = setTimeout(processSequence, 50);
        }
      } else if (step.action === "delete") {
        if (charIndex < step.count) {
          currentText = currentText.slice(0, -1);
          setDisplayText(currentText);
          charIndex++;
          timeout = setTimeout(processSequence, step.speed);
        } else {
          charIndex = 0;
          sequenceIndex++;
          timeout = setTimeout(processSequence, 50);
        }
      } else if (step.action === "deleteAll") {
        if (currentText.length > 0) {
          currentText = currentText.slice(0, -1);
          setDisplayText(currentText);
          timeout = setTimeout(processSequence, step.speed);
        } else {
          sequenceIndex++;
          timeout = setTimeout(processSequence, 50);
        }
      } else if (step.action === "pause") {
        sequenceIndex++;
        timeout = setTimeout(processSequence, step.duration);
      } else if (step.action === "restart") {
        sequenceIndex = 0;
        charIndex = 0;
        currentText = "";
        timeout = setTimeout(processSequence, 50);
      }
    };

    const initialDelay = setTimeout(processSequence, startDelay);

    return () => {
      clearTimeout(timeout);
      clearTimeout(initialDelay);
    };
  }, [startDelay]);

  return { displayText };
};

// ============================================
// SCROLL REVEAL HOOK
// ============================================

const useScrollReveal = (threshold: number = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

// ============================================
// SCROLL REVEAL WRAPPER COMPONENT
// ============================================

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

const ScrollReveal = ({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollReveal(0.1);

  const directionVariants = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...directionVariants[direction] }}
      animate={isVisible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directionVariants[direction] }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// FLOATING ELEMENTS
// ============================================

const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
      animate={{
        x: [0, 50, 0],
        y: [0, 30, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.div
      className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 rounded-full blur-3xl"
      animate={{
        x: [0, -40, 0],
        y: [0, -50, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.div
      className="absolute top-1/2 right-1/3 w-64 h-64 bg-primary/5 rounded-full blur-2xl"
      animate={{
        x: [0, 30, 0],
        y: [0, -30, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </div>
);

// ============================================
// NAVBAR
// ============================================

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Determine active section
      const sections = NAV_ITEMS.map((item) => item.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50" : ""
      }`}
    >
      <div className="container max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.a
            href="#"
            className="text-xl font-bold text-foreground hover:text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            AK
          </motion.a>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:text-primary ${
                  activeSection === item.href.slice(1)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {activeSection === item.href.slice(1) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            ))}
          </div>

          <motion.a
            href={CONTENT.resumeLink}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Resume</span>
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
};

// ============================================
// HERO SECTION
// ============================================

const Hero = () => {
  const { displayText: nameText, isComplete: nameComplete } = useTypewriter(CONTENT.name, 100, 500);
  const { displayText: roleText } = useWeb3Typewriter(1800);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20">
      <FloatingOrbs />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      <motion.div
        className="relative z-10 text-center max-w-5xl"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Decorative badge */}
        <motion.div
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-sm text-primary font-medium">Available for work</span>
        </motion.div>

        {/* Typewriter Name */}
        <motion.h1 variants={fadeInUp} className="text-display mb-6 relative min-h-[1.2em]">
          <span className="relative inline-block">
            {nameText}
            {!nameComplete && (
              <motion.span
                className="inline-block w-[3px] h-[0.9em] bg-primary ml-1 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
              />
            )}
          </span>
        </motion.h1>

        {/* Web2 -> Web3 Typewriter Role */}
        <div className="h-12 md:h-16 mb-8">
          <p className="text-xl md:text-2xl lg:text-3xl text-primary font-semibold tracking-tight">
            {roleText}
            <motion.span
              className="inline-block w-[2px] h-[0.9em] bg-primary ml-1 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
            />
          </p>
        </div>

        {/* Action Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href="#projects"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Folder className="w-5 h-5" />
            View Projects
          </motion.a>
          <motion.a
            href="#experience"
            className="flex items-center gap-2 px-6 py-3 border border-border bg-card/50 backdrop-blur-sm text-foreground rounded-xl font-medium hover:border-primary/50 hover:bg-card transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <GraduationCap className="w-5 h-5" />
            View Experience
          </motion.a>
          <motion.a
            href={CONTENT.resumeLink}
            className="flex items-center gap-2 px-6 py-3 border border-border bg-card/50 backdrop-blur-sm text-foreground rounded-xl font-medium hover:border-primary/50 hover:bg-card transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText className="w-5 h-5" />
            View Resume
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        className="absolute bottom-12 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-sm tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.a>
    </section>
  );
};

// ============================================
// ABOUT SECTION
// ============================================

const About = () => (
  <section id="about" className="py-32 px-6 relative">
    <div className="container max-w-4xl">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-12">
          <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-primary" />
          <h2 className="text-sm font-medium text-primary tracking-widest uppercase">About Me</h2>
          <div className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-primary" />
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Who I Am */}
        <ScrollReveal delay={0.1} direction="left">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Who I Am</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">{CONTENT.bio.whoAmI}</p>
          </div>
        </ScrollReveal>

        {/* What I Do */}
        <ScrollReveal delay={0.2} direction="right">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">What I Do</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">{CONTENT.bio.whatIDo}</p>
          </div>
        </ScrollReveal>
      </div>

      {/* Tech Skills */}
      <ScrollReveal delay={0.3}>
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Tech Stack</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {CONTENT.skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="group relative px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-full cursor-default overflow-hidden border border-border/50 hover:border-primary/50 transition-colors"
              >
                <span className="relative z-10">{skill}</span>
                <motion.div
                  className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.span>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

// ============================================
// PROJECTS SECTION
// ============================================

const Projects = () => (
  <section id="projects" className="py-32 px-6 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />

    <div className="container max-w-4xl relative">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-12">
          <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-primary" />
          <h2 className="text-sm font-medium text-primary tracking-widest uppercase">Projects</h2>
          <div className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-primary" />
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-6">
        {CONTENT.projects.map((project, index) => (
          <ScrollReveal key={index} delay={0.1 + index * 0.15} direction={index % 2 === 0 ? "left" : "right"}>
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -8 }}
              className="group block p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-card/50 transition-all duration-300 h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <project.icon className="w-5 h-5" />
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-md text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.a>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// EXPERIENCE SECTION
// ============================================

const Experience = () => (
  <section id="experience" className="py-32 px-6 relative">
    <div className="container max-w-4xl">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-12">
          <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-primary" />
          <h2 className="text-sm font-medium text-primary tracking-widest uppercase">Experience</h2>
          <div className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-primary" />
        </div>
      </ScrollReveal>

      <div className="space-y-6">
        {CONTENT.experience.map((exp, index) => (
          <ScrollReveal key={index} delay={0.1 + index * 0.15}>
            <motion.div
              whileHover={{ x: 8 }}
              className="relative p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-colors group"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {index === 0 ? <Briefcase className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{exp.role}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                    <p className="text-muted-foreground text-sm mt-2">{exp.description}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">{exp.period}</span>
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// CONTACT SECTION
// ============================================

const Contact = () => (
  <section id="contact" className="py-32 px-6 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />

    <div className="container max-w-3xl text-center relative">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-12 justify-center">
          <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-primary" />
          <h2 className="text-sm font-medium text-primary tracking-widest uppercase">Contact</h2>
          <div className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-primary" />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Let's Connect
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <p className="text-muted-foreground mb-12 max-w-md mx-auto">
          Have a project in mind or just want to chat about Web3? I'm always open to new opportunities and collaborations.
        </p>
      </ScrollReveal>

      <div className="flex items-center justify-center gap-4 flex-wrap">
        {[
          { href: CONTENT.socials.github, icon: Github, label: "GitHub" },
          { href: CONTENT.socials.linkedin, icon: Linkedin, label: "LinkedIn" },
          { href: CONTENT.socials.twitter, icon: Twitter, label: "X / Twitter" },
          { href: CONTENT.socials.email, icon: Mail, label: "Email" },
        ].map((social, index) => (
          <ScrollReveal key={social.label} delay={0.3 + index * 0.1} direction={index % 2 === 0 ? "up" : "down"}>
            <motion.a
              href={social.href}
              target={social.href.startsWith("mailto") ? undefined : "_blank"}
              rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-3 px-6 py-3 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/10 transition-all"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {social.label}
              </span>
            </motion.a>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.7}>
        <p className="mt-20 text-sm text-muted-foreground">
          © {new Date().getFullYear()} {CONTENT.name}. Built with passion for the decentralized future.
        </p>
      </ScrollReveal>
    </div>
  </section>
);

// ============================================
// MAIN PAGE
// ============================================

const Index = () => {
  return (
    <>
      <Navbar />
      <CustomCursor />
      <main className="min-h-screen cursor-none">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  );
};

export default Index;
