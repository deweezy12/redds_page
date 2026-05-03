import { Fragment, lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "wouter";

import { StitchBackground } from "../components/StitchBackground";
import { githubContributionSnapshot } from "../generated/githubContributionSnapshot";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          obs.disconnect();
        }
      },
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

const SECTIONS = [
  { id: "hello", label: "Hello" },
  { id: "intro", label: "Intro" },
  { id: "research", label: "Projects" },
  { id: "references", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const INTRO_TAGS = ["Python", "C++", "GitHub", "OpenCV", "Azure", "AWS"] as const;
const CAREER_SPLAT_URL = "/splats/resized.ply";
const GaussianSplatTile = lazy(() =>
  import("../components/GaussianSplatTile").then((module) => ({ default: module.GaussianSplatTile }))
);

type ProjectEntry = {
  year: string;
  subYear: string;
  title: string;
  venue: string;
  tags: string[];
  desc: string;
  href?: string;
  previewBadge?: string;
  tryHref?: string;
};

const PROJECTS: ProjectEntry[] = [
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
    href: "/pdf/CAREER_Paper___Relative_Pose_Estimation.pdf",
    previewBadge: "PDF",
    tryHref: "/career-splat",
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
    href: "/pdf/MARF.pdf",
    previewBadge: "PDF",
  },
  {
    year: "2023",
    subYear: "",
    title: "Automatic Texture Extraction on Synthetic Images using 6D Pose Estimation",
    venue: "Bachelor Thesis",
    tags: ["Blender", "Synthetic Dataset", "6D Pose Estimation", "Homography"],
    desc: "Bachelor thesis project on automatic texture extraction on synthetic images using 6D pose estimation.",
    href: "/pdf/Bachelor-Thesis.pdf",
    previewBadge: "PDF",
  },
];

type GitHubContributionCell = {
  date: string;
  intensity: number;
  color: string;
};

type GitHubContributionChart = {
  weeks: Array<Array<GitHubContributionCell | null>>;
  monthLabels: string[];
  activeDays: number;
  snapshotLabel: string;
};

const GITHUB_DARK_SCALE = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"] as const;
const GITHUB_Y_AXIS_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""] as const;

function parseUtcDate(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

function formatChartMonth(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(parseUtcDate(date));
}

function formatChartDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseUtcDate(date));
}

function formatSnapshotDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function getGitHubDarkColor(intensity: number) {
  return GITHUB_DARK_SCALE[Math.min(Math.max(intensity, 0), GITHUB_DARK_SCALE.length - 1)];
}

function buildGitHubContributionChart() {
  const cutoff = new Date(githubContributionSnapshot.fetchedAt);
  cutoff.setUTCHours(0, 0, 0, 0);

  const chartStart = new Date(cutoff);
  chartStart.setUTCDate(chartStart.getUTCDate() - 364);
  chartStart.setUTCDate(chartStart.getUTCDate() - chartStart.getUTCDay());

  const dayLookup = new Map<string, { date: string; intensity: number; parsedDate: Date }>(
    githubContributionSnapshot.payload.contributions
      .filter((day) => Boolean(day.date))
      .map((day) => {
        const intensity = Number.parseInt(day.intensity, 10);
        return [
          day.date,
          {
            date: day.date,
            intensity: Number.isNaN(intensity) ? 0 : intensity,
            parsedDate: parseUtcDate(day.date),
          },
        ] as const;
      })
  );

  const paddedDays: Array<GitHubContributionCell | null> = [];
  const cursor = new Date(chartStart);

  while (cursor.getTime() <= cutoff.getTime()) {
    const isoDate = cursor.toISOString().slice(0, 10);
    const day = dayLookup.get(isoDate);

    paddedDays.push(
      day
        ? {
            date: day.date,
            intensity: day.intensity,
            color: getGitHubDarkColor(day.intensity),
          }
        : {
            date: isoDate,
            intensity: 0,
            color: getGitHubDarkColor(0),
          }
    );

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const visibleDays = paddedDays.filter((day): day is GitHubContributionCell => day !== null);

  if (!visibleDays.length) {
    return null;
  }

  const lastVisibleDate = parseUtcDate(visibleDays[visibleDays.length - 1].date);
  const trailingPadding = 6 - lastVisibleDate.getUTCDay();

  for (let index = 0; index < trailingPadding; index += 1) {
    paddedDays.push(null);
  }

  const weeks = Array.from({ length: Math.ceil(paddedDays.length / 7) }, (_, index) => paddedDays.slice(index * 7, index * 7 + 7));
  let lastLabeledMonth: number | null = null;
  const monthLabels = weeks.map((week, index) => {
    const firstRealCell = week.find((cell): cell is GitHubContributionCell => cell !== null);
    if (!firstRealCell) return "";

    const weekMonth = parseUtcDate(firstRealCell.date).getUTCMonth();
    if (index === 0) {
      lastLabeledMonth = weekMonth;
      return formatChartMonth(firstRealCell.date);
    }

    const monthStart = week.find((cell) => cell && parseUtcDate(cell.date).getUTCDate() <= 7);
    if (!monthStart) {
      return "";
    }

    const monthStartMonth = parseUtcDate(monthStart.date).getUTCMonth();
    if (monthStartMonth === lastLabeledMonth) {
      return "";
    }

    lastLabeledMonth = monthStartMonth;
    return formatChartMonth(monthStart.date);
  });

  return {
    weeks,
    monthLabels,
    activeDays: visibleDays.filter((day) => day.intensity > 0).length,
    snapshotLabel: formatSnapshotDate(githubContributionSnapshot.fetchedAt),
  } satisfies GitHubContributionChart;
}

function formatContributionTooltip(cell: GitHubContributionCell) {
  const levelLabels = [
    "No visible activity",
    "Low activity",
    "Light activity",
    "Medium activity",
    "High activity",
  ] as const;

  return `${formatChartDate(cell.date)}: ${levelLabels[cell.intensity]}`;
}

const githubContributionChart = buildGitHubContributionChart();

function PdfPreviewTile({ title, badge = "PDF" }: { title: string; badge?: string }) {
  return (
    <div className="pdf-preview shrink-0" aria-hidden="true">
      <div className="pdf-preview-page">
        <span className="pdf-preview-fold" />
        <span className="pdf-preview-badge">{badge}</span>
        <p className="pdf-preview-title">{title}</p>
        <span className="pdf-preview-line pdf-preview-line-strong" />
        <span className="pdf-preview-line" />
        <span className="pdf-preview-line pdf-preview-line-short" />
      </div>
    </div>
  );
}

function SplatPreviewPanel({ title }: { title: string }) {
  return (
    <div className="card-hover relative aspect-[4/3] min-h-[15rem] w-full overflow-hidden rounded-2xl border border-white/8 bg-black/60">
      <Suspense fallback={null}>
        <GaussianSplatTile url={CAREER_SPLAT_URL} title={`${title} Gaussian splat preview`} />
      </Suspense>
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectEntry }) {
  const isExternal = Boolean(project.href?.startsWith("http"));
  const content = (
    <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-6">
      <div className="flex items-start gap-4 md:block md:w-24 shrink-0">
        <span className="block text-white/20 font-mono text-xs mt-1 tabular-nums leading-relaxed">
          <span className="block">{project.year}</span>
          {project.subYear ? <span className="block">{project.subYear}</span> : null}
        </span>
        {project.previewBadge ? <PdfPreviewTile title={project.title} badge={project.previewBadge} /> : null}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-white text-lg font-semibold leading-snug">{project.title}</h3>
          <span className="text-white/20 text-lg shrink-0 group-hover:text-white/60 transition-colors">↗</span>
        </div>
        <p className="text-white/30 text-xs font-mono tracking-wider mt-1 mb-3">{project.venue}</p>
        <p className="text-white/45 text-sm leading-relaxed mb-4">{project.desc}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => <span key={tag} className="pill-tag">{tag}</span>)}
        </div>
      </div>
    </div>
  );

  if (project.href) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        className="block card-hover border border-white/8 rounded-2xl p-7 group"
        style={{ background: "rgba(255,255,255,0.02)" }}
        aria-label={`${project.title}${isExternal ? " external link" : " PDF"}`}
      >
        {content}
      </a>
    );
  }

  return (
    <div className="card-hover border border-white/8 rounded-2xl p-7 group" style={{ background: "rgba(255,255,255,0.02)" }}>
      {content}
    </div>
  );
}

function ContactCard({
  label,
  title,
  href,
  children,
}: {
  label: string;
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="contact-card block border border-white/8 rounded-3xl p-6 group"
      style={{ background: "rgba(255,255,255,0.02)" }}
      aria-label={`${title} external link`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-white/25 text-[11px] font-mono tracking-[0.28em] uppercase mb-2">{label}</p>
          <h3 className="text-white text-xl font-semibold leading-tight">{title}</h3>
        </div>
        <span className="text-white/20 text-lg shrink-0 group-hover:text-white/60 transition-colors">↗</span>
      </div>
      {children}
    </a>
  );
}

function ContactDetailRow({
  href,
  label,
  icon,
}: {
  href?: string;
  label: string;
  icon?: React.ReactNode;
}) {
  const content = (
    <div className="contact-detail-row">
      <span className={`contact-detail-icon${icon ? "" : " contact-detail-icon-empty"}`} aria-hidden="true">
        {icon}
      </span>
      <span className="contact-detail-text">{label}</span>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className="contact-detail-link">
      {content}
    </a>
  );
}

function GitHubContributionCard() {
  const username = githubContributionSnapshot.username;
  const profileHref = `https://github.com/${username}`;
  const activeDaysText = githubContributionChart
    ? `${githubContributionChart.activeDays} active ${githubContributionChart.activeDays === 1 ? "day" : "days"}`
    : null;

  return (
    <ContactCard label="GitHub" title="@deweezy12" href={profileHref}>
      <div className="flex items-center gap-4 mb-5">
        <img
          src={`${profileHref}.png?size=96`}
          alt="GitHub avatar for deweezy12"
          className="w-14 h-14 rounded-2xl object-cover border border-white/10"
        />
        <div>
          <p className="text-white/55 text-sm leading-relaxed">
            Open source profile, project history, and contribution activity.
          </p>
          <p className="text-white/30 text-xs font-mono tracking-wide mt-2">github.com/deweezy12</p>
        </div>
      </div>

      <div className="contribution-panel rounded-2xl border border-white/8 overflow-hidden">
        {githubContributionChart ? (
          <div className="github-chart-frame">
            <div className="github-chart-meta">
              <p className="text-white/34 text-[11px] font-mono tracking-[0.18em] uppercase">Last Year</p>
              <p className="text-white/28 text-[11px] font-mono tracking-wide">Updated {githubContributionChart.snapshotLabel}</p>
            </div>

            <div className="github-chart-shell">
              <div className="github-chart-yaxis" aria-hidden="true">
                {GITHUB_Y_AXIS_LABELS.map((label, index) => (
                  <span key={`${label}-${index}`}>{label}</span>
                ))}
              </div>

              <div className="github-chart-scroll">
                <div className="github-chart-months" aria-hidden="true">
                  {githubContributionChart.monthLabels.map((label, index) => (
                    <span key={`${label || "blank"}-${index}`} className="github-chart-month">
                      {label}
                    </span>
                  ))}
                </div>

                <div className="github-chart-grid" role="img" aria-label={`GitHub contribution chart for ${username}`}>
                  {githubContributionChart.weeks.map((week, weekIndex) => (
                    <div key={`week-${weekIndex}`} className="github-chart-week">
                      {week.map((cell, dayIndex) => (
                        <span
                          key={`cell-${weekIndex}-${dayIndex}`}
                          className={`github-chart-cell${cell ? "" : " github-chart-cell-empty"}`}
                          style={cell ? { backgroundColor: cell.color } : undefined}
                          title={cell ? formatContributionTooltip(cell) : undefined}
                          aria-hidden={cell ? undefined : true}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="github-chart-footer">
              <p className="text-white/26 text-[11px] leading-relaxed">{activeDaysText} in the last 12 months.</p>
              <div className="github-chart-legend" aria-hidden="true">
                <span className="text-white/24 text-[11px]">Less</span>
                {GITHUB_DARK_SCALE.map((color) => (
                  <span key={color} className="github-chart-legend-cell" style={{ backgroundColor: color }} />
                ))}
                <span className="text-white/24 text-[11px]">More</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 py-5 text-white/45 text-sm leading-relaxed">
            Contribution graph unavailable right now. Open the GitHub profile to view the latest activity.
          </div>
        )}
      </div>
    </ContactCard>
  );
}

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
                width: isActive ? 12 : 10,
                height: isActive ? 12 : 10,
                background: isActive ? "#fff" : "transparent",
                border: isActive ? "none" : "1.5px solid rgba(255,255,255,0.4)",
                boxShadow: isActive ? "0 0 0 3px rgba(255,255,255,0.12)" : "none",
                transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            />
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

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [active, setActive] = useState("hello");
  const [pastHero, setPastHero] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      setScrollY(sy);

      const heroH = heroRef.current?.offsetHeight ?? window.innerHeight;
      setPastHero(sy > heroH * 0.6);

      const current = SECTIONS.slice().reverse().find((section) => {
        const el = document.getElementById(section.id);
        if (!el) return false;
        return el.getBoundingClientRect().top <= window.innerHeight * 0.4;
      });

      if (current) setActive(current.id);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroH = typeof window !== "undefined" ? window.innerHeight : 800;
  const parallaxY = scrollY * 0.45;
  const start = heroH * 0.15;
  const end = heroH * 0.8;
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

        .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

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

        .contact-card {
          transition: background 0.25s, border-color 0.25s, transform 0.25s;
        }

        .contact-card:hover {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(255,255,255,0.14) !important;
          transform: translateY(-2px);
        }

        .contact-detail-link {
          display: block;
        }

        .contact-detail-row {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.72);
          transition: color 0.2s ease, border-color 0.2s ease;
        }

        .contact-detail-row:hover,
        .contact-detail-link:hover .contact-detail-row {
          color: rgba(255,255,255,0.96);
          border-color: rgba(255,255,255,0.14);
        }

        .contact-detail-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.35rem;
          height: 1.35rem;
          flex-shrink: 0;
          color: rgba(255,255,255,0.48);
          transition: color 0.2s ease;
        }

        .contact-detail-icon-empty {
          opacity: 0;
        }

        .contact-detail-row:hover .contact-detail-icon,
        .contact-detail-link:hover .contact-detail-icon {
          color: #f7c4ff;
        }

        .contact-detail-text {
          font-size: 1.08rem;
          line-height: 1.5;
        }

        .contribution-panel {
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.05), transparent 38%),
            linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
        }

        .github-chart-frame {
          padding: 0.85rem 0.9rem 0.8rem;
        }

        .github-chart-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.55rem;
        }

        .github-chart-shell {
          --gh-cell: 0.62rem;
          --gh-gap: 0.18rem;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 0.35rem;
          align-items: start;
        }

        .github-chart-yaxis {
          display: grid;
          grid-template-rows: repeat(7, var(--gh-cell));
          gap: var(--gh-gap);
          padding-top: 0.95rem;
          color: rgba(255,255,255,0.2);
          font-size: 10px;
          line-height: var(--gh-cell);
          font-family: monospace;
          letter-spacing: 0.02em;
        }

        .github-chart-scroll {
          min-width: 0;
          overflow-x: auto;
          padding-bottom: 0.08rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.18) rgba(255,255,255,0.05);
        }

        .github-chart-scroll::-webkit-scrollbar {
          height: 8px;
        }

        .github-chart-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 999px;
        }

        .github-chart-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.18);
          border-radius: 999px;
        }

        .github-chart-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.26);
        }

        .github-chart-months,
        .github-chart-grid {
          display: flex;
          gap: var(--gh-gap, 0.18rem);
          min-width: max-content;
        }

        .github-chart-months {
          margin-bottom: var(--gh-gap, 0.18rem);
        }

        .github-chart-month {
          width: var(--gh-cell, 0.62rem);
          color: rgba(255,255,255,0.2);
          font-size: 10px;
          line-height: 1;
          font-family: monospace;
        }

        .github-chart-week {
          display: grid;
          grid-template-rows: repeat(7, var(--gh-cell, 0.62rem));
          gap: var(--gh-gap, 0.18rem);
        }

        .github-chart-cell {
          width: var(--gh-cell, 0.62rem);
          height: var(--gh-cell, 0.62rem);
          border-radius: 2px;
          box-shadow: inset 0 0 0 1px rgba(27,31,35,0.08);
          background: #161b22;
          transition: transform 0.16s ease, box-shadow 0.16s ease, filter 0.16s ease;
        }

        .github-chart-cell-empty {
          background: transparent;
          box-shadow: none;
        }

        .group:hover .github-chart-cell:not(.github-chart-cell-empty) {
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);
          filter: saturate(1.04);
        }

        .github-chart-cell:not(.github-chart-cell-empty):hover {
          transform: scale(1.08);
        }

        .github-chart-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-top: 0.55rem;
        }

        .github-chart-legend {
          display: inline-flex;
          align-items: center;
          gap: 0.22rem;
        }

        .github-chart-legend-cell {
          width: var(--gh-cell, 0.62rem);
          height: var(--gh-cell, 0.62rem);
          border-radius: 2px;
          box-shadow: inset 0 0 0 1px rgba(27,31,35,0.08);
        }

        @media (max-width: 640px) {
          .github-chart-frame {
            padding: 0.8rem;
          }

          .github-chart-meta,
          .github-chart-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.35rem;
          }

          .github-chart-yaxis {
            --gh-cell: 0.56rem;
            --gh-gap: 0.14rem;
            padding-top: 0.9rem;
          }
        }

        .pdf-preview {
          width: 4.9rem;
          margin-top: 0.9rem;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), filter 0.4s cubic-bezier(0.16,1,0.3,1);
          transform-origin: 30% 100%;
        }

        .group:hover .pdf-preview {
          transform: translateY(-3px) rotate(-2deg) scale(1.02);
          filter: drop-shadow(0 14px 24px rgba(0,0,0,0.28));
        }

        .pdf-preview-page {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.28rem;
          min-height: 6.4rem;
          padding: 0.6rem 0.55rem 0.55rem;
          border-radius: 0.95rem;
          border: 1px solid rgba(255,255,255,0.14);
          background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(233,236,241,0.96) 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.45), 0 8px 18px rgba(0,0,0,0.2);
          overflow: hidden;
        }

        .pdf-preview-page::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 26%),
            linear-gradient(135deg, rgba(8,8,8,0.08), transparent 55%);
          pointer-events: none;
        }

        .pdf-preview-fold {
          position: absolute;
          top: 0;
          right: 0;
          width: 1rem;
          height: 1rem;
          background: linear-gradient(135deg, rgba(217,222,229,0.95), rgba(255,255,255,0.5));
          clip-path: polygon(0 0, 100% 0, 100% 100%);
          opacity: 0.95;
        }

        .pdf-preview-badge {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-self: flex-start;
          padding: 0.18rem 0.42rem;
          border-radius: 999px;
          background: #b91c1c;
          color: rgba(255,255,255,0.95);
          font-size: 0.52rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          font-family: monospace;
        }

        .pdf-preview-title {
          position: relative;
          z-index: 1;
          margin: 0.05rem 0 0.2rem;
          color: rgba(24,24,27,0.9);
          font-size: 0.54rem;
          line-height: 1.3;
          font-weight: 700;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          text-wrap: balance;
        }

        .pdf-preview-line {
          position: relative;
          z-index: 1;
          display: block;
          height: 0.22rem;
          border-radius: 999px;
          background: rgba(50,55,64,0.18);
        }

        .pdf-preview-line-strong {
          width: 85%;
          background: rgba(50,55,64,0.28);
        }

        .pdf-preview-line-short {
          width: 62%;
        }

        section + section { border-top: 1px solid rgba(255,255,255,0.06); }

        @media (max-width: 767px) {
          .pdf-preview {
            margin-top: 0;
          }

          .experience-card {
            padding-right: 6.75rem;
          }

          .experience-card .card-logo {
            top: 1.5rem !important;
            right: 1.5rem !important;
            bottom: auto !important;
            left: auto !important;
            width: 5.5rem !important;
            max-width: 32% !important;
            height: 2.25rem !important;
            object-fit: contain;
            object-position: right center;
            opacity: 0.08 !important;
          }
        }
      `}</style>

      <SideDots active={active} pastHero={pastHero} />

      <section
        ref={heroRef}
        id="hello"
        className="relative w-full overflow-hidden"
        style={{ height: "100svh" }}
      >
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

        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: "#0a0a0a", opacity: fadeOpacity }}
        />

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

        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce"
          style={{ opacity: Math.max(0, 0.5 - fadeOpacity * 2) }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

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
                I&apos;m Oliver Jan Jarosik, a Berlin-based Computer Vision and AI Engineer: I work at Media Impact, building AI systems for real-world applications, while completing my M.Sc. in Computer Science at TU Berlin.
              </p>
              <p>
                My focus is on computer vision and applied AI, with work spanning trajectory tracking, 3D reconstruction, production-ready systems, and Microsoft Teams chatbots.
              </p>
              <p>
                What drives me is solving problems that don&apos;t have obvious answers: breaking them down, experimenting, and finding practical ways to make them work.
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

      <section id="research" className="py-32 px-8 md:px-24 max-w-7xl mx-auto w-full">
        <RevealBlock>
          <SectionLabel n="02" label="Projects" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-14">Selected Work</h2>
        </RevealBlock>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
          {PROJECTS.map((project, i) => (
            <Fragment key={i}>
              <RevealBlock className="xl:col-start-1">
                <ProjectCard project={project} />
              </RevealBlock>
              {project.tryHref ? (
                <RevealBlock className="xl:col-start-2 xl:row-start-3">
                  <SplatPreviewPanel title={project.title} />
                </RevealBlock>
              ) : null}
            </Fragment>
          ))}
        </div>
      </section>

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
              org: "Charité - Universitätsmedizin",
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
              <div className="experience-card card-hover relative overflow-hidden border border-white/8 rounded-2xl p-6 flex flex-col md:flex-row md:items-start gap-6" style={{ background: "rgba(255,255,255,0.02)" }}>
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

      <section id="contact" className="py-32 px-8 md:px-24 max-w-6xl mx-auto w-full">
        <RevealBlock>
          <SectionLabel n="05" label="Contact" />
          <h2 className="text-4xl md:text-[3.9rem] font-bold text-white leading-tight mb-6">
            Let&apos;s work on
            <br />
            something useful.
          </h2>
          <p className="hidden text-white/45 text-lg max-w-lg leading-relaxed mb-10">
            Based in Berlin and open to computer vision, AI engineering, and applied machine learning opportunities. Reach out any time.
          </p>
          <div className="hidden flex-col sm:flex-row gap-4 items-start sm:items-center">
            <a href="mailto:O.jarosik@gmx.net" className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-colors">
              O.jarosik@gmx.net ↗
            </a>
            <div className="flex items-center gap-5">
              {[
                { label: "GitHub", href: "https://github.com/deweezy12" },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/oliver-jan-jarosik" },
              ].map((l) => (
                <a key={l.label} href={l.href} className="text-white/35 text-sm hover:text-white/80 transition-colors font-mono tracking-wide">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <div className="max-w-2xl mb-10">
            <ContactDetailRow
              label="Based in Berlin"
              icon={(
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s6-5.33 6-11a6 6 0 1 0-12 0c0 5.67 6 11 6 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              )}
            />
            <ContactDetailRow
              href="mailto:O.Jarosik@gmx.net"
              label="O.Jarosik@gmx.net"
              icon={(
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
              )}
            />
            <ContactDetailRow
              href="https://www.linkedin.com/in/oliver-jan-jarosik"
              label="linkedin.com/in/oliver-jan-jarosik"
              icon={(
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2.02 2.02 0 0 0 3.2 5.02c0 1.11.9 2 2.02 2a2 2 0 1 0 .03-4.01ZM20.8 12.9c0-3.47-1.85-5.08-4.32-5.08-1.99 0-2.88 1.1-3.38 1.87V8.5H9.72c.04.79 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.12-.93.27-.68.88-1.39 1.9-1.39 1.34 0 1.88 1.03 1.88 2.54V20H20.8v-7.1Z" />
                </svg>
              )}
            />
            <ContactDetailRow
              href="https://www.instagram.com/reddsoligarch/"
              label="@reddsoligarch"
              icon={(
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              )}
            />
            <ContactDetailRow
              href="/pdf/Awesome_CV__1_%20(3).pdf"
              label="Curriculum Vitae (PDF)"
              icon={(
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v5h5" />
                  <path d="M9 13h6" />
                  <path d="M9 17h6" />
                </svg>
              )}
            />
          </div>
          <div className="mt-8 w-full max-w-[50rem]">
            <RevealBlock>
              <GitHubContributionCard />
            </RevealBlock>
          </div>
        </RevealBlock>
      </section>

      <footer className="border-t border-white/6 px-8 md:px-24 py-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white/20 text-xs font-mono">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>&copy; {new Date().getFullYear()} Oliver Jan Jarosik</span>
            <span className="hidden sm:inline text-white/10">|</span>
            <Link href="/impressum" className="transition-colors hover:text-white/75">
              Impressum
            </Link>
            <span className="hidden sm:inline text-white/10">|</span>
            <Link href="/datenschutz" className="transition-colors hover:text-white/75">
              Datenschutz
            </Link>
          </div>
          <span>Computer Vision Engineer &amp; AI Engineer</span>
        </div>
      </footer>
    </>
  );
}
