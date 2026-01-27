import ThemeToggle from "@/components/ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { Github, Linkedin, Mail, ArrowDown, ExternalLink, Sparkles, Code2, Zap, Briefcase, GraduationCap, FileText, Folder, User, Layers, Twitter, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomCursor from "@/components/CustomCursor";
import MusicPlayer from "@/components/MusicPlayer";
import LinkPreview from "@/components/LinkPreview";

// ============================================
// CONTENT - Edit these to customize your portfolio
// ============================================

const CONTENT = {
  name: "Abhist Kamle",
  tagline: "Web3 Developer",
  roles: [
    "Web3 Developer",
    "Blockchain Developer",
    "Smart Contract Engineer",
    "Competitive Programmer"
  ],
  bio: {
    whoAmI:
      "I am a Web3 developer with 1.5 years of experience, specializing in Solidity and smart contract development. Along with blockchain, I have a strong foundation in competitive programming and data structures using Python. I have also participated in multiple hackathons, where I worked on real-world blockchain projects, solved challenging problems, and improved my technical and problem-solving skills.",

    whatIDo:
      "I build decentralized applications, smart contracts, and blockchain-based solutions. Whether it is DeFi platforms, NFT projects, or Web3 tools, I focus on creating secure, efficient, and user-friendly systems that make blockchain technology easier and more practical to use."
  },

  skills: [
    "C",
    "C++",
    "Python",
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Tailwind",
    "Node.js",
    "Redis",
    "Solidity",
    "Ethereum",
    "Hardhat",
    "Ethers.js",
    "Web3.js",
    "Solana",
    "Rust"
  ],
  projects: [
    {
      title: "Sadak Sathi",
      description: "A solution-focused platform aimed at solving real-world challenges using tech-driven systems.",
      link: "https://github.com/Abhist17/sadak-sathi-",
      icon: Zap,
      tags: ["HTML", "CSS", "JavaScript","Python","Completed"],
    },
    {
      title: "Web3 Todo App",
      description: "A decentralized blockchain-based Todo application ensuring transparency and immutability.",
      link: "https://github.com/Abhist17/todo-web3",
      icon: Sparkles,
      tags: ["HTML", "CSS", "JavaScript","Solidity", "Partially-Completed"],
    },
    {
      title: "Trade Journal",
      description: "A trading activity tracker designed to analyze performance and improve trading discipline.",
      link: "https://github.com/Abhist17/trade-journal",
      icon: Layers,
      tags: ["TypeScript", "JavaScript","Work in Progress"],
    },
    {
      title: "JD–CV Matching AI",
      description: "An AI-powered system that intelligently matches resumes to job descriptions using embeddings.",
      link: "https://github.com/Abhist17/JD-CV-Matching",
      icon: Code2,
      tags: ["TypeScript", "Python", "Python Dependencies", "Completed"],
    },
  ],
   experience: [
    {
      role: "Computer Science Student",
      company: "Indian Institute of Information Technology, Nagpur",
      period: "2024 - Present",
      description: "Pursuing B.Tech in Computer Science.",
      link: "https://iiitn.ac.in/"
    },

    {
      role: "Web3 Lead",
      company: "Elevate Club",
      period: "2025 - Present",
      description:
        "Driving the Web3 wave in my college by building a thriving blockchain community, organizing initiatives, leading sessions, and speaking to inspire the next generation of Web-3 builders.",
      link: "/photos/web-3.png"

    },
    
    {
      role: "Builder",
      company: "Solana Turbin3",
      period: "2025 - Present",
      description: "Getting hands-on experience in building on Solana with the Turbin3 Async Builders Program.",
      link: "https://x.com/solanaturbine"
    },
    {
      role: "Core Member",
      company: "Bhaisaaab DAO",
      period: "2024 - Present",
      description: "Working with the Indian Web3 community which focuses on education and collaboration in the blockchain space.",
      link: "https://x.com/Bhaisaaab_"
    }
  ],
  socials: {
    github: "https://github.com/Abhist17",
    linkedin: "https://www.linkedin.com/in/abhist-k-845079323/",
    twitter: "https://x.com/_abhist_",
    email: "mailto:abhistcodes17@gmail.com"
  },
  resumeLink: "",
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
      { action: "pause", duration: 800 },
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
  className="flex items-center hover:opacity-90 transition-opacity"
  whileHover={{ scale: 1.05 }}
>
  <img
    src="/photos/abhiii.jpg"
    alt="Abhist Kamle"
    className="w-10 h-10 rounded-full object-cover border border-border"
  />
</motion.a>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`relative px-4 py-2 text-xl font-medium transition-colors rounded-lg hover:text-primary ${
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

          {/* Desktop Resume Button */}
          <motion.a
            href={CONTENT.resumeLink}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-xl font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Resume</span>
          </motion.a>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-md border-t border-border"
          >
            <div className="container mx-auto px-6 py-4">
              <div className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`py-3 text-xl font-medium text-muted-foreground hover:text-primary transition-colors ${
                      activeSection === item.href.slice(1) ? "text-primary" : ""
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
                <motion.a
                  href={CONTENT.resumeLink}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-2 py-3 text-xl font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FileText className="w-4 h-4" />
                  Resume
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
        <div className="h-14 md:h-18 mb-10">
          <p className="text-xl md:text-3xl lg:text-4xl text-primary font-semibold tracking-tight">
            {roleText}
            <motion.span
              className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle"
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
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all text-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Folder className="w-5 h-5" />
            View Projects
          </motion.a>
          <motion.a
            href="#experience"
            className="flex items-center gap-2 px-6 py-3 border border-border bg-card/50 backdrop-blur-sm text-foreground rounded-xl font-medium hover:border-primary/50 hover:bg-card transition-all text-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <GraduationCap className="w-5 h-5" />
            View Experience
          </motion.a>
          <motion.a
            href={CONTENT.resumeLink}
            className="flex items-center gap-2 px-6 py-3 border border-border bg-card/50 backdrop-blur-sm text-foreground rounded-xl font-medium hover:border-primary/50 hover:bg-card transition-all text-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText className="w-5 h-5" />
            View Resume
          </motion.a>
        </motion.div>
      </motion.div>

      {/* SMOOTH SCROLL BUTTON */}
      <motion.button
        onClick={() => {
          document.getElementById('about')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }}
        className="absolute bottom-12 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary group cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        whileHover={{ y: -4 }}
      >
        <span className="text-xl tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.button>
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
          <h2 className="text-xl font-medium text-primary tracking-widest uppercase">About Me</h2>
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
              <h3 className="text-3xl font-semibold text-foreground">Who I Am</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-xl">{CONTENT.bio.whoAmI}</p>
          </div>
        </ScrollReveal>

        {/* What I Do */}
        <ScrollReveal delay={0.2} direction="right">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-3xl font-semibold text-foreground">What I Do</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-xl">{CONTENT.bio.whatIDo}</p>
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
            <h3 className="text-3xl font-semibold text-foreground">Tech Stack</h3>
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
                className="group relative px-4 py-2 text-lg font-medium bg-secondary text-secondary-foreground rounded-full cursor-default overflow-hidden border border-border/50 hover:border-primary/50 transition-colors"
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
          <h2 className="text-xl font-medium text-primary tracking-widest uppercase">Projects</h2>
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
              <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-lg mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className={`text-base px-2 py-1 rounded-md ${
                      tag === "Completed" 
                        ? "bg-blue-500 text-white" 
                        : tag === "Partially-Completed" 
                          ? "bg-yellow-500 text-black" 
                          : tag === "Work in Progress" 
                            ? "bg-red-500 text-white" 
                            : "bg-secondary text-secondary-foreground"
                    }`}
                  >
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
// Experience Section
// ============================================


const Experience = () => (
  <section id="experience" className="py-32 px-6 relative">
    <div className="container max-w-4xl">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-12">
          <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-primary" />
          <h2 className="text-xl font-medium text-primary tracking-widest uppercase">Experience</h2>
          <div className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-primary" />
        </div>
      </ScrollReveal>

      <div className="space-y-6">
        {CONTENT.experience.map((exp, index) => (
          <ScrollReveal key={index} delay={0.1 + index * 0.15}>
            <motion.a
              href={exp.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 8 }}
              className="relative block p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-colors group"
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {index === 0 ? <Briefcase className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground">{exp.role}</h3>
                    <p className="text-primary font-medium text-xl">{exp.company}</p>
                    <p className="text-muted-foreground text-lg mt-2">{exp.description}</p>
                  </div>
                </div>
                <span className="text-lg text-muted-foreground font-medium whitespace-nowrap">{exp.period}</span>
              </div>
            </motion.a>

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
          <h2 className="text-xl font-medium text-primary tracking-widest uppercase">Contact</h2>
          <div className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-primary" />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Let's Connect
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <p className="text-muted-foreground mb-12 max-w-md mx-auto text-xl">
          Have a project in mind or just want to chat about Web3? I'm always open to new opportunities and collaborations.
        </p>
      </ScrollReveal>

      <div className="flex items-center justify-center gap-4 flex-wrap">
  {[
  { 
    href: CONTENT.socials.github, 
    icon: Github, 
    label: "GitHub",
    previewImage: "/photos/github.jpg"
  },
  { 
    href: CONTENT.socials.linkedin, 
    icon: Linkedin, 
    label: "LinkedIn",
    previewImage: "/photos/abhist-linkedin.jpg"
  },
  { 
    href: CONTENT.socials.twitter, 
    icon: Twitter, 
    label: "X / Twitter",
    previewImage: "/photos/x.png"
  },
  { 
  href: CONTENT.socials.email, 
  icon: Mail, 
  label: "Email",
  previewImage: "/photos/gmail-logo.jpg",
  isSmall: true  // ADD THIS LINE
},
].map((social, index) => (
  <ScrollReveal key={social.label} delay={0.3 + index * 0.1} direction={index % 2 === 0 ? "up" : "down"}>
    <LinkPreview
      href={social.href}
      previewImage={social.previewImage}
      isSmall={social.isSmall}
    >
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
        <span className="text-lg font-medium text-muted-foreground group-hover:text-primary transition-colors">
          {social.label}
        </span>
      </motion.a>
    </LinkPreview>
  </ScrollReveal>
))}
      </div>

      <ScrollReveal delay={0.7}>
        <p className="mt-20 text-lg text-muted-foreground">
          
        </p>
      </ScrollReveal>
    </div>
  </section>
);


const Index = () => {
  return (
    <>
      <Navbar />
      <CustomCursor />
      <ThemeToggle />  {/* 🔥 ADD THIS LINE */}
      <MusicPlayer />  {/* ADD THIS LINE */}
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
