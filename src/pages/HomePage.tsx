import { StitchBackground } from "../components/StitchBackground";
import { useEffect, useRef, useState } from "react";

/* ─── Scroll-reveal hook ─────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("revealed"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealBlock({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal-block ${className}`}>{children}</div>;
}

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-14">
      <span className="text-xs text-white/20 tracking-widest font-mono">{n}</span>
      <span className="flex-1 h-px bg-white/10" />
      <span className="text-xs text-white/20 tracking-widest uppercase font-mono">{label}</span>
    </div>
  );
}

/* ─── Section dot navigator ──────────────────────────────── */
const SECTIONS = [
  { id: "hello",      label: "Hello" },
  { id: "intro",      label: "Intro" },
  { id: "research",   label: "Projects" },
  { id: "references", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "contact",    label: "Contact" },
];

const INTRO_TAGS = ["Python", "C++", "GitHub", "OpenCV", "Azure", "AWS"] as const;

function SideDots({ active, pastHero }: { active: string; pastHero: boolean }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div
      className="fixed left-7 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2 hidden md:flex"
      style={{
        opacity: pastHero ? 1 : 0,
        transform: `translateY(-50%) translateX(${pastHero ? 0 : -8}px)`,
        pointerEvents: pastHero ? "auto" : "none",
        transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            title={s.label}
            className="group relative flex items-center justify-center"
            style={{ width: 24, height: 24 }}
          >
            <span
              className="block rounded-full"
              style={{
                width:  isActive ? 12 : 10,
                height: isActive ? 12 : 10,
                background:   isActive ? "#fff" : "transparent",
                border:       isActive ? "none" : "1.5px solid rgba(255,255,255,0.4)",
                boxShadow:    isActive ? "0 0 0 3px rgba(255,255,255,0.12)" : "none",
                transition:   "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            />
            {/* Tooltip */}
            <span
              className="absolute left-6 whitespace-nowrap text-xs font-mono tracking-widest uppercase pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {s.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function Home() {
  const [scrollY, setScrollY]       = useState(0);
  const [active, setActive]         = useState("hello");
  const [pastHero, setPastHero]     = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      setScrollY(sy);

      const heroH = heroRef.current?.offsetHeight ?? window.innerHeight;
      setPastHero(sy > heroH * 0.6);

      // Determine active section
      const current = SECTIONS.slice().reverse().find((s) => {
        const el = document.getElementById(s.id);
        if (!el) return false;
        return el.getBoundingClientRect().top <= window.innerHeight * 0.4;
      });
      if (current) setActive(current.id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroH       = typeof window !== "undefined" ? window.innerHeight : 800;
  // Parallax: background moves at 40% of scroll speed (slower = deeper feel)
  const parallaxY   = scrollY * 0.45;
  // Fade: start at 15% scroll through hero, fully black by 80%
  const start       = heroH * 0.15;
  const end         = heroH * 0.80;
  const fadeOpacity = Math.min(1, Math.max(0, (scrollY - start) / (end - start)));

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
        body { background: #0a0a0a; }

        .reveal-block {
          opacity: 0;
          transform: translateY(24px) scale(0.99);
          transition: opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal-block.revealed { opacity: 1; transform: translateY(0) scale(1); }

        .pill-tag {
          display: inline-block;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 4px 14px;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          font-family: monospace;
        }

        .card-hover { transition: background 0.25s, border-color 0.25s; }
        .card-hover:hover {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(255,255,255,0.14) !important;
        }

        .card-logo {
          transition: opacity 0.25s ease, filter 0.25s ease;
        }

        .card-hover:hover .card-logo {
          opacity: 0.12;
          filter: saturate(1.35) brightness(1.08);
        }

        section + section { border-top: 1px solid rgba(255,255,255,0.06); }
      `}</style>

      {/* ── Side dots ──────────────────────────────────── */}
      <SideDots active={active} pastHero={pastHero} />

      {/* ── HELLO ──────────────────────────────────────── */}
      <section
        ref={heroRef}
        id="hello"
        className="relative w-full overflow-hidden"
        style={{ height: "100svh" }}
      >
        {/* Parallax background — moves slower than scroll */}
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            top: `-${parallaxY * 0.3}px`,
            bottom: `-${parallaxY * 0.3}px`,
            willChange: "transform",
          }}
        >
          <StitchBackground />
        </div>

        {/* Fade-to-black overlay driven by scroll */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: "#0a0a0a", opacity: fadeOpacity }}
        />

        {/* Name — single horizontal line */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-4"
          style={{ transform: `translateY(${-parallaxY * 0.15}px)` }}
        >
          <h1
            className="font-bold text-white leading-none tracking-tight whitespace-nowrap"
            style={{
              fontFamily: '"Poppins", "Inter", sans-serif',
              fontSize: "clamp(2.5rem, 6.9vw, 6.8rem)",
              fontWeight: 700,
              lineHeight: 0.9,
              textShadow: "0 4px 80px rgba(0,0,0,0.35)",
              opacity: 1 - fadeOpacity * 1.4,
            }}
          >
            OLIVER JAN JAROSIK
          </h1>
          <p
            className="mt-1 text-white"
            style={{
              fontSize: "clamp(1.15rem, 2.3vw, 1.8rem)",
              fontWeight: 700,
              letterSpacing: "0.03em",
              lineHeight: 1.25,
              maxWidth: "28ch",
              opacity: 1 - fadeOpacity * 1.55,
            }}
          >
            Computer Vision and AI Engineer
          </p>
        </div>

        {/* Scroll arrow */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce"
          style={{ opacity: Math.max(0, 0.5 - fadeOpacity * 2) }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ── INTRO ──────────────────────────────────────── */}
      <section id="intro" className="relative py-32 px-8 md:px-24 max-w-6xl mx-auto w-full overflow-hidden">
        <RevealBlock>
          <div className="relative z-10">
            <SectionLabel n="01" label="Intro" />
          </div>
          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-start">
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Computer vision, applied AI, and production-focused engineering.
            </h2>
            <div className="space-y-5 text-white/55 text-base leading-relaxed">
              <p>
                I'm Oliver Jan Jarosik, a Berlin-based Computer Vision and AI Engineer: I work at Media Impact, building AI systems for real-world applications, while completing my M.Sc. in Computer Science at TU Berlin.
              </p>
              <p>
                My focus is on computer vision and applied AI, with work spanning trajectory tracking, 3D reconstruction, production-ready systems, and Microsoft Teams chatbots.
              </p>
              <p>
                What drives me is solving problems that don't have obvious answers: breaking them down, experimenting, and finding practical ways to make them work.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {INTRO_TAGS.map((tag) => (
                  <span key={tag} className="pill-tag" style={{ cursor: "default", userSelect: "none" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </RevealBlock>
      </section>

      {/* ── RESEARCH ───────────────────────────────────── */}
      <section id="research" className="py-32 px-8 md:px-24 max-w-6xl mx-auto w-full">
        <RevealBlock>
          <SectionLabel n="02" label="Projects" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-14">Selected Work</h2>
        </RevealBlock>
        <div className="space-y-4">
          {[
            {
              year: "2026",
              subYear: "- now",
              title: "Learning-Based Optimization for 3D Surgical Visualization",
              venue: "Master Thesis",
              tags: ["Medical Visualization", "Optimization", "3D Vision"],
              desc: "Working with endoscopic images and 3D visualization in close exchange with doctors to improve surgical visualization workflows.",
            },
            {
              year: "2025",
              subYear: "- now",
              title: "Media Impact Assistant Chatbot",
              venue: "Software Engineering Project",
              tags: ["Python", "OpenAI Agents SDK", "Snowflake", "Azure Cognitive Search", "AWS EC2"],
              desc: "Built a modular Microsoft Teams chatbot with function calling, Snowflake query pipelines, Azure vector search-based RAG, Dockerized deployment, and automated Excel reporting for internal workflows.",
            },
            {
              year: "2025",
              subYear: "- 2026",
              title: "Synthetic-to-Stereo Vision Pipeline for Docking Interface Pose Estimation",
              venue: "CAREER Research Project",
              tags: ["vMamba", "3D Gaussian Splatting", "6DoF Pose Estimation", "Stereo Vision", "RANSAC"],
              desc: "Developed a real-time 6DoF pose estimation pipeline for docking interfaces from synchronized stereo imagery, combining synthetic-to-real training, VMamba-based keypoint detection, and robust PnP/RANSAC pose recovery.",
            },
            {
              year: "2026",
              subYear: "",
              title: "F1 Trajectory Tracker",
              venue: "Computer Vision Project",
              tags: ["YOLO", "Homography", "PnP", "OpenCV"],
              desc: "Built a trajectory tracking project focused on following Formula 1 motion patterns and turning them into clear, usable visualizations.",
              href: "https://github.com/deweezy12/f1-trajectory-tracker",
            },
            {
              year: "2024",
              subYear: "",
              title: "Masking Bundle-Adjusting Neural Radiance Fields",
              venue: "Computer Vision Project",
              tags: ["NeRF", "PyTorch", "Blender", "Synthetic Data"],
              desc: "Worked on Neural Radiance Field experiments over synthetic data with a focus on camera parameter handling, occlusion treatment, and changing illumination conditions.",
            },
            {
              year: "2023",
              subYear: "",
              title: "Automatic Texture Extraction on Synthetic Images using 6D Pose Estimation",
              venue: "Bachelor Thesis",
              tags: ["Blender", "Synthetic Dataset", "6D Pose Estimation", "Homography"],
              desc: "Bachelor thesis project on automatic texture extraction on synthetic images using 6D pose estimation.",
            },
          ].map((p, i) => (
            <RevealBlock key={i}>
              {p.href ? (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block card-hover border border-white/8 rounded-2xl p-7 group"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-5">
                    <span className="text-white/20 font-mono text-xs shrink-0 mt-1 tabular-nums md:w-20 leading-relaxed">
                      <span className="block">{p.year}</span>
                      {p.subYear ? <span className="block">{p.subYear}</span> : null}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-white text-lg font-semibold leading-snug">{p.title}</h3>
                        <span className="text-white/20 text-lg shrink-0 group-hover:text-white/60 transition-colors">↗</span>
                      </div>
                      <p className="text-white/30 text-xs font-mono tracking-wider mt-1 mb-3">{p.venue}</p>
                      <p className="text-white/45 text-sm leading-relaxed mb-4">{p.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((t) => <span key={t} className="pill-tag">{t}</span>)}
                      </div>
                    </div>
                  </div>
                </a>
              ) : (
                <div className="card-hover border border-white/8 rounded-2xl p-7 cursor-pointer group" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-5">
                    <span className="text-white/20 font-mono text-xs shrink-0 mt-1 tabular-nums md:w-20 leading-relaxed">
                      <span className="block">{p.year}</span>
                      {p.subYear ? <span className="block">{p.subYear}</span> : null}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-white text-lg font-semibold leading-snug">{p.title}</h3>
                        <span className="text-white/20 text-lg shrink-0 group-hover:text-white/60 transition-colors">↗</span>
                      </div>
                      <p className="text-white/30 text-xs font-mono tracking-wider mt-1 mb-3">{p.venue}</p>
                      <p className="text-white/45 text-sm leading-relaxed mb-4">{p.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((t) => <span key={t} className="pill-tag">{t}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* ── REFERENCES ─────────────────────────────────── */}
      <section id="references" className="py-32 px-8 md:px-24 max-w-6xl mx-auto w-full">
        <RevealBlock>
          <SectionLabel n="03" label="Education" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-14">Education</h2>
        </RevealBlock>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              quote: "Master of Science in Computer Science at TU Berlin, expected October 2026. Thesis in progress: Learning-Based Optimization for 3D Surgical Visualization in Minimally Invasive Heart Valve Procedures.",
              name: "Technische Universität Berlin",
              role: "Oct 2023 - Oct 2026 (expected)",
              logo: "/assets/tu-berlin-logo.svg",
              logoClassName: "absolute right-[-6%] bottom-[-5%] w-[62%] max-w-none opacity-[0.07] pointer-events-none select-none",
              logoStyle: undefined,
            },
            {
              quote: "Bachelor of Science in Computer Science, completed in 2023. Bachelor thesis: Automatic Texture Extraction on Synthetic Images using 6D Pose Estimation.",
              name: "Bergische Universität Wuppertal",
              role: "Completed 2023",
              logo: "/assets/uni-wuppertal-8aba18.png",
              logoClassName: "absolute right-[-6%] bottom-[-20%] w-[62%] max-w-none opacity-[0.07] pointer-events-none select-none",
              logoStyle: undefined,
            },
          ].map((r, i) => (
            <RevealBlock key={i}>
              <div
                className="card-hover relative overflow-hidden border border-white/8 rounded-2xl p-7 h-full"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                {r.logo ? (
                  <img
                    src={r.logo}
                    alt=""
                    aria-hidden="true"
                    className={`card-logo ${r.logoClassName ?? ""}`}
                    style={r.logoStyle}
                  />
                ) : null}
                <div className="relative z-10">
                  <p className="text-white/60 text-base leading-relaxed mb-6">{r.quote}</p>
                  <p className="text-white text-sm font-semibold">{r.name}</p>
                  <p className="text-white/30 text-xs font-mono mt-0.5">{r.role}</p>
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ─────────────────────────────────── */}
      <section id="experience" className="py-32 px-8 md:px-24 max-w-6xl mx-auto w-full">
        <RevealBlock>
          <SectionLabel n="04" label="Experience" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-14">Career</h2>
        </RevealBlock>
        <div className="space-y-5">
          {[
            {
              period: "Feb 2026",
              subPeriod: "- Now",
              role: "Master Thesis Student",
              org: "Charité – Universitätsmedizin",
              desc: "Working with endoscopic images and 3D visualization, including close collaboration with doctors on practical clinical use cases.",
              logo: "/assets/charite-logo-white-text.svg",
              logoClassName: "absolute right-[0%] top-[-13%] w-[52%] max-w-none opacity-[0.05] pointer-events-none select-none",
            },
            {
              period: "Nov 2024",
              subPeriod: "- Now",
              role: "AI Engineer",
              org: "Media Impact GmbH & Co. KG",
              desc: "Developing AI-supported internal tools, including a Microsoft Teams chatbot with RAG, vector databases, API integrations, debugging, and performance optimization.",
              logo: "/assets/MI_Logo_Pink_weiss.svg",
              logoClassName: "absolute right-[-13%] top-[15%] w-[64%] max-w-none opacity-[0.045] pointer-events-none select-none",
            },
            {
              period: "Oct 2016",
              subPeriod: "- Sep 2024",
              role: "Team Lead",
              org: "CinemaxX Entertainment GmbH",
              desc: "Managed cashiering and settlement processes in a high-traffic environment and took responsibility for scheduling, onboarding, and maintaining strong service quality.",
              logo: "/assets/cinemaxx-logo-white-text.svg",
              logoClassName: "absolute right-[-16%] top-[-31%] w-[66%] max-w-none opacity-[0.04] pointer-events-none select-none",
            },
          ].map((e, i) => (
            <RevealBlock key={i}>
              <div className="card-hover relative overflow-hidden border border-white/8 rounded-2xl p-6 flex flex-col md:flex-row md:items-start gap-6" style={{ background: "rgba(255,255,255,0.02)" }}>
                {e.logo ? (
                  <img
                    src={e.logo}
                    alt=""
                    aria-hidden="true"
                    className={`card-logo ${e.logoClassName ?? ""}`}
                  />
                ) : null}
                <span className="relative z-10 text-white/25 text-xs font-mono shrink-0 md:w-28 md:pt-0.5 leading-relaxed">
                  <span className="block">{e.period}</span>
                  {e.subPeriod ? <span className="block">{e.subPeriod}</span> : null}
                </span>
                <div className="relative z-10 flex-1 min-w-0">
                  <div className="mb-1">
                    <h3 className="text-white font-semibold text-base">{e.role}</h3>
                  </div>
                  <p className="text-white/35 text-xs font-mono tracking-wider mb-3">{e.org}</p>
                  <p className="text-white/50 text-sm leading-relaxed">{e.desc}</p>
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* ── CONTACT ────────────────────────────────────── */}
      <section id="contact" className="py-32 px-8 md:px-24 max-w-6xl mx-auto w-full">
        <RevealBlock>
          <SectionLabel n="05" label="Contact" />
          <h2 className="font-bold text-white leading-tight mb-8" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
            Let's work on<br />something useful.
          </h2>
          <p className="text-white/45 text-lg max-w-lg leading-relaxed mb-10">
            Based in Berlin and open to computer vision, AI engineering, and applied machine learning opportunities. Reach out any time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <a href="mailto:O.jarosik@gmx.net" className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-colors">
              O.jarosik@gmx.net ↗
            </a>
            <div className="flex items-center gap-5">
              {[
                { label: "GitHub", href: "https://github.com/deweezy12" },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/oliver-jan-jarosik" },
              ].map((l) => (
                <a key={l.label} href={l.href} className="text-white/35 text-sm hover:text-white/80 transition-colors font-mono tracking-wide">{l.label}</a>
              ))}
            </div>
          </div>
        </RevealBlock>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="border-t border-white/6 px-8 md:px-24 py-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white/20 text-xs font-mono">
          <span>© {new Date().getFullYear()} Oliver Jan Jarosik</span>
          <span>Computer Vision Engineer &amp; AI Engineer</span>
        </div>
      </footer>
    </>
  );
}
