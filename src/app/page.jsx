import Link from "next/link";
import {Moon, ArrowRight, ChevronRight, Check} from "lucide-react";
import LandingStyles from "@/components/LandingStyles";
import Navbar from "@/components/Navbar";

const FEATURES = [
  {
    icon: "🕌",
    title: "Attendance Tracking",
    desc: "Mark who's attending before the shopper leaves. Real-time headcount — no more over-buying.",
    color: "#60a5fa",
    border: "rgba(96,165,250,0.2)",
    glow: "rgba(96,165,250,0.06)",
  },
  {
    icon: "💰",
    title: "Contribution Log",
    desc: "Every taka tracked with a full history. Know exactly who paid what, when.",
    color: "#4ade80",
    border: "rgba(74,222,128,0.2)",
    glow: "rgba(74,222,128,0.06)",
  },
  {
    icon: "🛒",
    title: "Expense Manager",
    desc: "Log purchases and auto-calculate per-head cost based on confirmed attendees.",
    color: "#c9a84c",
    border: "rgba(201,168,76,0.2)",
    glow: "rgba(201,168,76,0.06)",
  },
  {
    icon: "⚖️",
    title: "Auto Settlement",
    desc: "See exactly who overpaid and who owes. Minimal transactions, zero confusion.",
    color: "#f0d080",
    border: "rgba(240,208,128,0.2)",
    glow: "rgba(240,208,128,0.06)",
  },
  {
    icon: "📊",
    title: "Reports & Charts",
    desc: "Full Ramadan summary — spending trends, attendance rates, and category breakdowns.",
    color: "#c084fc",
    border: "rgba(192,132,252,0.2)",
    glow: "rgba(192,132,252,0.06)",
  },
  {
    icon: "📢",
    title: "Announcements",
    desc: "Admin posts notices — today's shopper, menu changes, collection reminders.",
    color: "#fb923c",
    border: "rgba(251,146,60,0.2)",
    glow: "rgba(251,146,60,0.06)",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Create your group",
    desc: "Admin sets up, members join with their room number.",
  },
  {
    n: "02",
    title: "Mark attendance daily",
    desc: "Everyone updates before Asr — attending or absent.",
  },
  {
    n: "03",
    title: "Shopper checks the count",
    desc: "One screen shows exactly how many to shop for.",
  },
  {
    n: "04",
    title: "Log the expenses",
    desc: "Add what was bought — per-head cost is automatic.",
  },
  {
    n: "05",
    title: "Settle at month end",
    desc: "Noor shows who gets a refund and who pays up.",
  },
];

const MARQUEE_ITEMS = [
  "Attendance",
  "Contributions",
  "Expenses",
  "Settlement",
  "Reports",
  "Announcements",
  "Ramadan",
  "Iftar",
  "BUET Hall",
  "نور",
  "Attendance",
  "Contributions",
  "Expenses",
  "Settlement",
  "Reports",
  "Announcements",
  "Ramadan",
  "Iftar",
  "BUET Hall",
  "نور",
];

function IslamicPattern() {
  return (
    <svg
      width="0"
      height="0"
      style={{position: "absolute"}}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="geo-pattern"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <g stroke="rgba(201,168,76,0.07)" strokeWidth="0.5" fill="none">
            <polygon points="40,4 52,12 52,28 40,36 28,28 28,12" />
            <polygon points="40,44 52,52 52,68 40,76 28,68 28,52" />
            <polygon points="0,4 12,12 12,28 0,36" />
            <polygon points="80,4 80,36 68,28 68,12" />
            <polygon points="0,44 12,52 12,68 0,76" />
            <polygon points="80,44 80,76 68,68 68,52" />
            <line x1="40" y1="36" x2="40" y2="44" />
            <line x1="52" y1="28" x2="68" y2="28" />
            <line x1="28" y1="28" x2="12" y2="28" />
            <line x1="52" y1="52" x2="68" y2="52" />
            <line x1="28" y1="52" x2="12" y2="52" />
            <circle cx="40" cy="40" r="3" fill="rgba(201,168,76,0.05)" />
            <circle cx="0" cy="40" r="2" fill="rgba(201,168,76,0.04)" />
            <circle cx="80" cy="40" r="2" fill="rgba(201,168,76,0.04)" />
            <circle cx="40" cy="0" r="2" fill="rgba(201,168,76,0.04)" />
            <circle cx="40" cy="80" r="2" fill="rgba(201,168,76,0.04)" />
          </g>
        </pattern>
      </defs>
    </svg>
  );
}

function Lantern({side}) {
  const sway = side === "left" ? "lantern-l" : "lantern-r";
  const rotate = side === "left" ? "-4deg" : "4deg";
  return (
    <div
      className={`${sway} absolute top-0 pointer-events-none`}
      style={{
        [side]: side === "left" ? "clamp(20px, 6vw, 100px)" : undefined,
        right: side === "right" ? "clamp(20px, 6vw, 100px)" : undefined,
        transformOrigin: "top center",
      }}
    >
      <svg
        width="72"
        height="200"
        viewBox="0 0 72 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="36"
          y1="0"
          x2="36"
          y2="18"
          stroke="#c9a84c"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="28"
          y1="18"
          x2="44"
          y2="18"
          stroke="#c9a84c"
          strokeWidth="1.5"
        />
        <line
          x1="32"
          y1="18"
          x2="32"
          y2="26"
          stroke="#c9a84c"
          strokeWidth="1"
        />
        <line
          x1="36"
          y1="18"
          x2="36"
          y2="26"
          stroke="#c9a84c"
          strokeWidth="1"
        />
        <line
          x1="40"
          y1="18"
          x2="40"
          y2="26"
          stroke="#c9a84c"
          strokeWidth="1"
        />
        <path
          d="M 20 26 L 16 54 L 18 90 L 36 98 L 54 90 L 56 54 L 52 26 Z"
          fill="rgba(201,168,76,0.08)"
          stroke="#c9a84c"
          strokeWidth="1.2"
        />
        <path d="M 20 26 L 52 26" stroke="#c9a84c" strokeWidth="1" />
        <path
          d="M 16 54 L 56 54"
          stroke="#c9a84c"
          strokeWidth="0.8"
          strokeDasharray="3 2"
        />
        <path
          d="M 18 72 L 54 72"
          stroke="#c9a84c"
          strokeWidth="0.8"
          strokeDasharray="3 2"
        />
        <path d="M 18 90 L 54 90" stroke="#c9a84c" strokeWidth="1" />
        <line
          x1="24"
          y1="26"
          x2="20"
          y2="98"
          stroke="#c9a84c"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />
        <line
          x1="48"
          y1="26"
          x2="52"
          y2="98"
          stroke="#c9a84c"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />
        <ellipse
          cx="36"
          cy="62"
          rx="14"
          ry="22"
          fill="rgba(240,208,128,0.18)"
          className="lantern-glow-inner"
        />
        <ellipse
          cx="36"
          cy="62"
          rx="8"
          ry="14"
          fill="rgba(255,220,100,0.22)"
          className="lantern-glow-inner"
        />
        <path
          d="M 26 26 L 26 22 L 46 22 L 46 26"
          stroke="#c9a84c"
          strokeWidth="1"
          fill="rgba(201,168,76,0.15)"
        />
        <path
          d="M 28 98 L 24 112 L 36 108 L 48 112 L 44 98"
          fill="rgba(201,168,76,0.12)"
          stroke="#c9a84c"
          strokeWidth="1"
        />
        <line
          x1="36"
          y1="112"
          x2="36"
          y2="126"
          stroke="#c9a84c"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <circle cx="36" cy="129" r="3.5" fill="#c9a84c" opacity="0.8" />
        <path
          d="M 28 26 L 36 38 L 44 26"
          stroke="#c9a84c"
          strokeWidth="0.6"
          strokeOpacity="0.4"
          fill="none"
        />
        <path
          d="M 24 54 L 36 46 L 48 54"
          stroke="#c9a84c"
          strokeWidth="0.6"
          strokeOpacity="0.4"
          fill="none"
        />
      </svg>
    </div>
  );
}

function Particle({style}) {
  return <div className="particle" style={style} />;
}

function StarField() {
  const stars = [
    {size: 1.5, top: "8%", left: "12%", delay: "0s", dur: "2.8s"},
    {size: 2, top: "14%", left: "78%", delay: "0.4s", dur: "3.2s"},
    {size: 1, top: "6%", left: "45%", delay: "1.1s", dur: "2.5s"},
    {size: 2.5, top: "22%", left: "90%", delay: "0.7s", dur: "3.8s"},
    {size: 1.5, top: "18%", left: "30%", delay: "1.5s", dur: "2.9s"},
    {size: 1, top: "32%", left: "5%", delay: "0.2s", dur: "3.5s"},
    {size: 2, top: "10%", left: "62%", delay: "2.1s", dur: "2.7s"},
    {size: 1.5, top: "38%", left: "92%", delay: "0.9s", dur: "3.1s"},
    {size: 1, top: "25%", left: "18%", delay: "1.8s", dur: "2.6s"},
    {size: 2, top: "42%", left: "55%", delay: "0.3s", dur: "4s"},
    {size: 1.5, top: "5%", left: "85%", delay: "1.3s", dur: "2.4s"},
    {size: 1, top: "28%", left: "70%", delay: "2.5s", dur: "3.3s"},
  ];

  return (
    <>
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: s.size,
            height: s.size,
            top: s.top,
            left: s.left,
            background: "#f0d080",
            animation: `star-pulse ${s.dur} ease-in-out ${s.delay} infinite`,
            boxShadow: `0 0 ${s.size * 3}px #c9a84c`,
          }}
        />
      ))}
    </>
  );
}

export default function LandingPage() {
  const year = new Date().getFullYear();

  const particles = [
    {
      bottom: "10%",
      left: "20%",
      "--dur": "5s",
      "--delay": "0s",
      "--drift": "30px",
    },
    {
      bottom: "8%",
      left: "40%",
      "--dur": "6s",
      "--delay": "1s",
      "--drift": "-20px",
    },
    {
      bottom: "12%",
      left: "60%",
      "--dur": "4.5s",
      "--delay": "2s",
      "--drift": "15px",
    },
    {
      bottom: "6%",
      left: "75%",
      "--dur": "7s",
      "--delay": "0.5s",
      "--drift": "-35px",
    },
    {
      bottom: "15%",
      left: "85%",
      "--dur": "5.5s",
      "--delay": "1.5s",
      "--drift": "25px",
    },
    {
      bottom: "9%",
      left: "10%",
      "--dur": "6.5s",
      "--delay": "3s",
      "--drift": "-15px",
    },
  ];

  return (
    <div
      data-theme="noor"
      className="min-h-screen bg-base-100 text-base-content font-nunito relative overflow-x-hidden"
    >
      <LandingStyles />
      <IslamicPattern />

      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -5%, rgba(30,58,110,0.35) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 85% 95%, rgba(201,168,76,0.07) 0%, transparent 55%), radial-gradient(ellipse 40% 30% at 10% 70%, rgba(30,58,110,0.12) 0%, transparent 50%)",
        }}
      />

      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-100"
        style={{background: "url(#geo-pattern)"}}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="url(#geo-pattern)" />
        </svg>
      </div>

      {/* ══════════════════════ NAVBAR ══════════════════════ */}
      <Navbar />

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-10 pb-24 overflow-hidden">
        <StarField />
        {particles.map((p, i) => (
          <Particle key={i} style={p} />
        ))}

        <Lantern side="left" />
        <Lantern side="right" />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(201,168,76,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="moon-rise relative inline-flex items-center justify-center mb-8">
            <div className="pulse-ring" />
            <div className="pulse-ring" style={{animationDelay: "0.9s"}} />
            <div className="pulse-ring" style={{animationDelay: "1.8s"}} />
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center crescent-orbit"
              style={{
                background:
                  "radial-gradient(circle at 35% 35%, rgba(201,168,76,0.18) 0%, transparent 65%), radial-gradient(circle at 65% 65%, rgba(30,58,110,0.3) 0%, transparent 60%), #060d1f",
                border: "1px solid rgba(201,168,76,0.15)",
                boxShadow:
                  "0 0 80px rgba(201,168,76,0.12), inset 0 0 50px rgba(201,168,76,0.05), 0 0 0 1px rgba(201,168,76,0.08)",
              }}
            >
              <Moon size={64} color="#c9a84c" fill="#c9a84c" />
            </div>
          </div>

          <div
            className="hero-text-1 inline-flex items-center gap-2.5 mb-6 px-5 py-2 rounded-full text-xs font-bold tracking-[0.2em] uppercase"
            style={{
              background: "rgba(30,58,110,0.4)",
              border: "1px solid rgba(201,168,76,0.2)",
              color: "rgba(201,168,76,0.85)",
            }}
          >
            <span style={{color: "#c9a84c"}}>✦</span>
            Ramadan {year} · BUET Hall
            <span style={{color: "#c9a84c"}}>✦</span>
          </div>

          <h1
            className="hero-text-2 font-amiri font-bold leading-none mb-2 glow-text"
            style={{fontSize: "clamp(90px, 18vw, 160px)"}}
          >
            <span className="gold-shimmer">Noor</span>
          </h1>

          <p
            className="hero-text-3 font-amiri mb-5"
            style={{
              fontSize: "clamp(22px, 4vw, 36px)",
              color: "rgba(232,212,139,0.4)",
              letterSpacing: "0.12em",
            }}
          >
            نور — Light of Ramadan
          </p>

          <p
            className="hero-text-4 text-base md:text-xl max-w-xl mb-10 leading-relaxed"
            style={{color: "rgba(232,212,139,0.5)", fontWeight: 300}}
          >
            The smart iftar manager for BUET hall residents. Track
            contributions, split expenses, and settle up — without a single
            WhatsApp argument.
          </p>

          <div className="hero-text-5 flex flex-col sm:flex-row gap-3 items-center">
            <Link
              href="/register"
              className="btn btn-lg font-bold px-10 gap-2 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, #c9a84c 0%, #f0d080 50%, #a07830 100%)",
                color: "#060d1f",
                boxShadow:
                  "0 8px 40px rgba(201,168,76,0.35), 0 0 0 1px rgba(201,168,76,0.3)",
                animation: "btn-glow 3s ease-in-out infinite",
              }}
            >
              Start for free
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="btn btn-lg font-bold px-10 rounded-2xl"
              style={{
                background: "rgba(30,58,110,0.3)",
                border: "1px solid rgba(30,58,110,0.6)",
                color: "rgba(232,212,139,0.7)",
              }}
            >
              Sign in
            </Link>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, #060d1f 30%, rgba(6,13,31,0.5) 70%, transparent)",
          }}
        />
      </section>

      {/* ══════════════════════ MARQUEE ══════════════════════ */}
      <div
        className="relative py-4 overflow-hidden border-y"
        style={{
          borderColor: "rgba(201,168,76,0.1)",
          background: "rgba(13,26,53,0.5)",
        }}
      >
        <div className="marquee-track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={i}
              className="font-amiri font-bold text-sm px-8 shrink-0"
              style={{
                color: i % 5 === 4 ? "#c9a84c" : "rgba(201,168,76,0.3)",
                letterSpacing: "0.1em",
              }}
            >
              {item}
              <span className="ml-8" style={{color: "rgba(201,168,76,0.15)"}}>
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════ STATS ══════════════════════ */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #09132a 0%, #0d1a35 50%, #09132a 100%)",
              border: "1px solid rgba(201,168,76,0.12)",
              boxShadow:
                "0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,168,76,0.08)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                {
                  value: "৳0",
                  label: "Wasted on food",
                  sub: "perfect portions every time",
                },
                {
                  value: "30",
                  label: "Ramadan days covered",
                  sub: "every single iftar",
                },
                {
                  value: "∞",
                  label: "Headaches saved",
                  sub: "no more WhatsApp math",
                },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center py-12 px-8 text-center"
                  style={{
                    borderRight:
                      i < 2 ? "1px solid rgba(201,168,76,0.08)" : "none",
                    borderBottom: "none",
                  }}
                >
                  <p
                    className="font-amiri font-bold gold-shimmer counter-glow mb-2"
                    style={{fontSize: "clamp(48px, 6vw, 72px)", lineHeight: 1}}
                  >
                    {s.value}
                  </p>
                  <p className="font-semibold text-sm text-base-content/70 mb-1">
                    {s.label}
                  </p>
                  <p className="text-xs text-base-content/30">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ FEATURES ══════════════════════ */}
      <section id="features" className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-xs font-bold tracking-[0.25em] uppercase mb-5"
              style={{color: "rgba(201,168,76,0.5)"}}
            >
              ✦ &nbsp;Features&nbsp; ✦
            </p>
            <h2
              className="font-amiri font-bold text-base-content mb-4"
              style={{fontSize: "clamp(36px, 6vw, 60px)"}}
            >
              Everything your group needs
            </h2>
            <p className="text-base-content/40 text-lg max-w-md mx-auto">
              No spreadsheets. No confusing threads. Just Noor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="feature-card rounded-2xl p-6 cursor-default"
                style={{
                  background: `radial-gradient(ellipse 80% 60% at 30% 20%, ${f.glow} 0%, #0d1a35 60%)`,
                  border: `1px solid ${f.border}`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                  style={{
                    background: `${f.glow.replace("0.06", "0.1")}`,
                    border: `1px solid ${f.border}`,
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-sm mb-2" style={{color: f.color}}>
                  {f.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{color: "rgba(232,212,139,0.45)"}}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section id="how-it-works" className="relative z-10 py-24 px-4">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(30,58,110,0.15) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-lg mx-auto relative">
          <div className="text-center mb-16">
            <p
              className="text-xs font-bold tracking-[0.25em] uppercase mb-5"
              style={{color: "rgba(201,168,76,0.5)"}}
            >
              ✦ &nbsp;How it works&nbsp; ✦
            </p>
            <h2
              className="font-amiri font-bold text-base-content"
              style={{fontSize: "clamp(36px, 6vw, 60px)"}}
            >
              Simple as iftar itself
            </h2>
          </div>

          <div className="relative flex flex-col gap-0">
            <div
              className="absolute left-6 top-6 bottom-6 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(201,168,76,0.3) 10%, rgba(201,168,76,0.3) 90%, transparent)",
              }}
            />

            {STEPS.map((s, i) => (
              <div key={s.n} className="relative flex gap-5 pb-10 last:pb-0">
                <div className="relative shrink-0 flex flex-col items-center z-10">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-amiri font-bold text-sm"
                    style={{
                      background:
                        "linear-gradient(135deg, #c9a84c, #f0d080, #a07830)",
                      color: "#060d1f",
                      boxShadow: "0 0 24px rgba(201,168,76,0.4)",
                    }}
                  >
                    {s.n}
                  </div>
                </div>

                <div
                  className="flex-1 rounded-2xl p-5 mt-1"
                  style={{
                    background: "rgba(13,26,53,0.7)",
                    border: "1px solid rgba(30,58,110,0.5)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <p className="font-bold text-base-content text-sm mb-1">
                    {s.title}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{color: "rgba(232,212,139,0.4)"}}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ SETTLEMENT HIGHLIGHT ══════════════════════ */}
      <section id="settlement" className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0b1530 0%, #09132a 100%)",
              border: "1px solid rgba(201,168,76,0.15)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <p
                  className="text-xs font-bold tracking-[0.22em] uppercase mb-6"
                  style={{color: "rgba(201,168,76,0.5)"}}
                >
                  ✦ &nbsp;Key Feature
                </p>
                <h2
                  className="font-amiri font-bold text-base-content mb-4 leading-tight"
                  style={{fontSize: "clamp(30px, 4vw, 48px)"}}
                >
                  Zero-math Settlement
                </h2>
                <p className="text-base-content/45 text-base leading-relaxed mb-8">
                  At month end, Noor calculates every contribution and expense
                  share, then finds the fewest possible transfers to balance
                  everything out. No spreadsheets. No arguments.
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    "Contribution vs expense share per member",
                    "Minimum transactions to settle all debts",
                    "Instant clarity — who pays whom and how much",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: "rgba(74,222,128,0.15)",
                          border: "1px solid rgba(74,222,128,0.3)",
                        }}
                      >
                        <Check size={11} color="#4ade80" strokeWidth={3} />
                      </div>
                      <span className="text-sm text-base-content/60">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="p-8 flex items-center justify-center"
                style={{borderLeft: "1px solid rgba(201,168,76,0.08)"}}
              >
                <div
                  className="w-full max-w-xs rounded-2xl p-5"
                  style={{
                    background: "#060d1f",
                    border: "1px solid rgba(30,58,110,0.7)",
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="font-bold text-sm"
                      style={{color: "#c9a84c"}}
                    >
                      ⚖️ Settlement
                    </span>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(74,222,128,0.1)",
                        border: "1px solid rgba(74,222,128,0.25)",
                        color: "#4ade80",
                      }}
                    >
                      Day 30
                    </span>
                  </div>

                  {[
                    {
                      from: "RA",
                      fromName: "Riad",
                      to: "SH",
                      toName: "Sadat",
                      amount: 420,
                    },
                    {
                      from: "NB",
                      fromName: "Nobel",
                      to: "FA",
                      toName: "Fahim",
                      amount: 185,
                    },
                    {
                      from: "AT",
                      fromName: "Athens",
                      to: "SH",
                      toName: "Sadat",
                      amount: 310,
                    },
                  ].map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 mb-3 last:mb-0 p-3 rounded-xl"
                      style={{
                        background: "rgba(13,26,53,0.8)",
                        border: "1px solid rgba(30,58,110,0.5)",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          background: "rgba(30,58,110,0.8)",
                          color: "#c9a84c",
                        }}
                      >
                        {t.from}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-base-content truncate">
                          {t.fromName}
                        </p>
                        <p
                          className="text-xs"
                          style={{color: "rgba(232,212,139,0.3)"}}
                        >
                          → {t.toName}
                        </p>
                      </div>
                      <span
                        className="font-amiri font-bold text-sm shrink-0"
                        style={{color: "#f0d080"}}
                      >
                        ৳{t.amount}
                      </span>
                    </div>
                  ))}

                  <div
                    className="mt-4 p-3 rounded-xl text-center"
                    style={{
                      background: "rgba(74,222,128,0.06)",
                      border: "1px solid rgba(74,222,128,0.15)",
                    }}
                  >
                    <p className="text-xs font-bold" style={{color: "#4ade80"}}>
                      3 transfers clears all debts ✓
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ QUOTE ══════════════════════ */}
      <section className="quote-section relative z-10 py-28 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div
            className="font-amiri text-5xl md:text-7xl mb-6"
            style={{color: "rgba(201,168,76,0.15)", lineHeight: 1}}
          >
            ❝
          </div>
          <p
            className="font-amiri text-2xl md:text-3xl mb-4 leading-relaxed"
            style={{color: "rgba(232,212,139,0.65)"}}
          >
            رمضان المبارك
          </p>
          <p className="text-base-content/30 text-sm mb-12 tracking-widest uppercase font-semibold">
            Ramadan Mubarak — Blessed Month
          </p>
          <Link
            href="/register"
            className="btn btn-lg font-bold px-14 gap-2 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, #c9a84c 0%, #f0d080 50%, #a07830 100%)",
              color: "#060d1f",
              boxShadow: "0 8px 40px rgba(201,168,76,0.3)",
            }}
          >
            Get started — it&apos;s free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer
        className="relative z-10 border-t py-10 px-6"
        style={{
          borderColor: "rgba(30,58,110,0.3)",
          background: "rgba(9,19,42,0.6)",
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Moon
              size={18}
              color="#c9a84c"
              fill="#c9a84c"
              className="crescent"
            />
            <span className="gold-shimmer font-amiri text-xl font-bold">
              Noor
            </span>
            <span className="text-base-content/20 text-sm">
              · BUET Hall · Ramadan {year}
            </span>
          </div>
          <p className="text-xs text-base-content/25">
            Built with ☪️ for the hall iftar family
          </p>
        </div>
      </footer>
    </div>
  );
}
