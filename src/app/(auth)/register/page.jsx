"use client";

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {
  Moon,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  User,
  Mail,
  Lock,
  Hash,
} from "lucide-react";
import {authClient} from "@/lib/auth-client";
import toast from "react-hot-toast";

const STARS = Array.from({length: 80}, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  dur: (Math.random() * 4 + 2).toFixed(1),
  delay: (Math.random() * 5).toFixed(1),
  opacity: Math.random() * 0.6 + 0.2,
}));

const PARTICLES = Array.from({length: 18}, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  startY: 70 + Math.random() * 30,
  size: Math.random() * 3 + 1,
  dur: (Math.random() * 8 + 6).toFixed(1),
  delay: (Math.random() * 8).toFixed(1),
  drift: (Math.random() * 60 - 30).toFixed(0),
}));

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    room: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function set(field) {
    return (e) => {
      setForm((p) => ({...p, [field]: e.target.value}));
      if (errors[field]) setErrors((p) => ({...p, [field]: ""}));
    };
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    else if (form.name.trim().split(" ").filter(Boolean).length < 2)
      errs.name = "Please enter your full name.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email.";
    if (!form.room.trim()) errs.room = "Room number is required.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "At least 6 characters.";
    if (!form.confirm) errs.confirm = "Please confirm your password.";
    else if (form.confirm !== form.password)
      errs.confirm = "Passwords don't match.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const {error} = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        room: form.room.trim(),
      });
      if (error) throw new Error(error.message ?? "Registration failed.");
      toast.success("Account created! Welcome to Noor 🌙");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  }

  const strengthLevel =
    form.password.length >= 16
      ? 3
      : form.password.length >= 12
        ? 2
        : form.password.length >= 8
          ? 1
          : 0;
  const strengthColor = [
    "rgba(30,58,110,0.4)",
    "#f87171",
    "#facc15",
    "#4ade80",
  ][strengthLevel];
  const strengthLabel = ["", "Weak", "Good", "Strong"][strengthLevel];

  return (
    <>
      <style>{`
        @keyframes star-twinkle {
          0%, 100% { opacity: var(--base-op, 0.3); transform: scale(1); }
          50%       { opacity: 1; transform: scale(1.5); }
        }
        @keyframes moon-float {
          0%, 100% { transform: translateY(0px) rotate(-4deg); }
          50%       { transform: translateY(-16px) rotate(4deg); }
        }
        @keyframes moon-glow {
          0%, 100% { filter: drop-shadow(0 0 18px rgba(201,168,76,0.5)) drop-shadow(0 0 50px rgba(201,168,76,0.15)); }
          50%       { filter: drop-shadow(0 0 35px rgba(201,168,76,0.85)) drop-shadow(0 0 90px rgba(201,168,76,0.35)); }
        }
        @keyframes particle-rise {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
          8%   { opacity: 0.9; }
          85%  { opacity: 0.4; }
          100% { transform: translateY(-180px) translateX(var(--drift, 0px)); opacity: 0; }
        }
        @keyframes card-appear {
          from { opacity: 0; transform: translateY(32px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer-text {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        @keyframes geo-spin   { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
        @keyframes geo-spin-r { from { transform: rotate(0deg); }   to { transform: rotate(-360deg); } }
        @keyframes lantern-sway   { 0%,100% { transform: rotate(-5deg) translateY(0px); }   50% { transform: rotate(5deg) translateY(-6px); } }
        @keyframes lantern-sway-r { 0%,100% { transform: rotate(5deg) translateY(-3px); }   50% { transform: rotate(-5deg) translateY(3px); } }
        @keyframes lantern-glow   { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes ring-pulse  { 0% { transform: scale(0.9); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes border-anim { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        @keyframes btn-pulse   { 0%,100% { box-shadow: 0 4px 24px rgba(201,168,76,0.3); } 50% { box-shadow: 0 8px 48px rgba(201,168,76,0.55), 0 0 30px rgba(201,168,76,0.15); } }
        @keyframes float-badge { 0%,100% { transform: translateY(0px) rotate(-1deg); } 50% { transform: translateY(-5px) rotate(1deg); } }
        @keyframes mosque-rise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes arch-glow   { 0%,100% { opacity: 0.04; } 50% { opacity: 0.09; } }
        @keyframes checkmark-pop { 0% { transform: scale(0) rotate(-15deg); opacity: 0; } 70% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }

        .star         { animation: star-twinkle var(--dur, 3s) ease-in-out infinite var(--delay, 0s); }
        .moon-float   { animation: moon-float 5s ease-in-out infinite, moon-glow 5s ease-in-out infinite; }
        .particle     { animation: particle-rise var(--dur, 8s) ease-in var(--delay, 0s) infinite; }
        .card-appear  { animation: card-appear 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .shimmer-gold {
          background: linear-gradient(90deg, #a07830, #c9a84c, #f0d080, #e8c060, #c9a84c, #a07830);
          background-size: 300% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-text 4s linear infinite;
        }
        .geo-outer    { animation: geo-spin   40s linear infinite; }
        .geo-inner    { animation: geo-spin-r 28s linear infinite; }
        .lantern-l    { animation: lantern-sway   4s ease-in-out infinite; transform-origin: top center; }
        .lantern-r    { animation: lantern-sway-r 4.5s ease-in-out infinite; transform-origin: top center; }
        .lantern-glow { animation: lantern-glow 2.5s ease-in-out infinite; }
        .ring-pulse   { animation: ring-pulse 2.8s ease-out infinite; }
        .float-badge  { animation: float-badge 4s ease-in-out infinite; }
        .mosque-appear { animation: mosque-rise 1.2s cubic-bezier(0.22,1,0.36,1) 0.4s both; }
        .arch-glow    { animation: arch-glow 4s ease-in-out infinite; }
        .checkmark-pop { animation: checkmark-pop 0.4s cubic-bezier(0.22,1,0.36,1) both; }

        .animated-border-btn {
          position: relative; z-index: 0;
          animation: btn-pulse 3s ease-in-out infinite;
        }
        .animated-border-btn::before {
          content: ''; position: absolute; inset: -1px;
          border-radius: inherit; padding: 1px;
          background: linear-gradient(90deg, #c9a84c, #f0d080, #a07830, #c9a84c);
          background-size: 200% 100%;
          animation: border-anim 3s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          pointer-events: none;
        }

        .input-wrap { position: relative; }
        .input-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%); pointer-events: none;
        }
        .input-field {
          width: 100%; background: rgba(13,26,53,0.8);
          border: 1px solid rgba(30,58,110,0.6);
          color: #e8d48b; border-radius: 12px;
          padding: 13px 16px 13px 40px; font-size: 14px;
          font-family: var(--font-nunito, Nunito), sans-serif;
          font-weight: 500; outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .input-field::placeholder { color: rgba(74,111,165,0.7); }
        .input-field:focus {
          background: rgba(13,26,53,0.95);
          border-color: #c9a84c;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.1), inset 0 1px 2px rgba(0,0,0,0.3);
        }
        .input-error   { border-color: rgba(248,113,113,0.5) !important; }
        .input-success { border-color: rgba(74,222,128,0.4) !important; }

        .geo-bg {
          background-image:
            repeating-linear-gradient( 45deg, rgba(201,168,76,0.04) 0, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 22px),
            repeating-linear-gradient(-45deg, rgba(201,168,76,0.04) 0, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 22px);
        }
        .glass-card {
          background: linear-gradient(135deg, rgba(13,26,53,0.95) 0%, rgba(9,19,42,0.98) 100%);
          border: 1px solid rgba(30,58,110,0.5);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(30,58,110,0.6), transparent);
        }
        .err-text { font-size: 11px; font-weight: 600; color: #f87171; margin-top: 4px; }

        @media (max-width: 640px) {
          .lantern-l, .lantern-r, .geo-ornament { display: none; }
        }
      `}</style>

      <div
        className="min-h-screen geo-bg flex flex-col overflow-hidden relative"
        style={{background: "#060d1f"}}
      >
        {/* Stars */}
        <div className="fixed inset-0 pointer-events-none">
          {STARS.map((s) => (
            <div
              key={s.id}
              className="star absolute rounded-full"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                background: s.id % 7 === 0 ? "#f0d080" : "#c9a84c",
                "--base-op": s.opacity,
                "--dur": `${s.dur}s`,
                "--delay": `${s.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Ambient glows */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            style={{
              position: "absolute",
              top: "5%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(30,58,110,0.18) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "25%",
              right: "15%",
              width: 280,
              height: 280,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 800,
              height: 300,
              background:
                "radial-gradient(ellipse, rgba(30,58,110,0.15) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="particle absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.startY}%`,
                width: p.size,
                height: p.size,
                background: "radial-gradient(circle, #f0d080, #c9a84c)",
                "--dur": `${p.dur}s`,
                "--delay": `${p.delay}s`,
                "--drift": `${p.drift}px`,
              }}
            />
          ))}
        </div>

        {/* Mosque silhouette */}
        <div
          className="mosque-appear fixed bottom-0 left-0 right-0 pointer-events-none"
          style={{zIndex: 1}}
        >
          <svg
            viewBox="0 0 1440 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMax slice"
          >
            <rect
              x="60"
              y="80"
              width="18"
              height="120"
              fill="rgba(13,26,53,0.9)"
            />
            <path d="M60 80 Q69 55 78 80Z" fill="rgba(13,26,53,0.9)" />
            <rect
              x="66"
              y="52"
              width="6"
              height="28"
              fill="rgba(201,168,76,0.3)"
            />
            <circle cx="69" cy="50" r="4" fill="rgba(201,168,76,0.5)" />
            <rect
              x="1362"
              y="80"
              width="18"
              height="120"
              fill="rgba(13,26,53,0.9)"
            />
            <path d="M1362 80 Q1371 55 1380 80Z" fill="rgba(13,26,53,0.9)" />
            <rect
              x="1368"
              y="52"
              width="6"
              height="28"
              fill="rgba(201,168,76,0.3)"
            />
            <circle cx="1371" cy="50" r="4" fill="rgba(201,168,76,0.5)" />
            <path
              d="M200 200 L200 130 Q200 100 230 100 L400 100 Q420 100 420 120 L420 200Z"
              fill="rgba(9,19,42,0.95)"
            />
            <path
              d="M310 100 Q310 60 350 60 Q390 60 390 100Z"
              fill="rgba(13,26,53,0.95)"
            />
            <path
              d="M580 200 L580 110 L600 110 Q600 60 720 55 Q840 60 840 110 L860 110 L860 200Z"
              fill="rgba(9,19,42,0.97)"
            />
            <path
              d="M720 55 Q720 20 740 15 Q760 20 760 55"
              fill="rgba(13,26,53,0.97)"
              stroke="rgba(201,168,76,0.15)"
              strokeWidth="1"
            />
            <circle cx="740" cy="12" r="5" fill="rgba(201,168,76,0.4)" />
            <path
              d="M1020 200 L1020 130 Q1020 100 1050 100 L1220 100 Q1240 100 1240 120 L1240 200Z"
              fill="rgba(9,19,42,0.95)"
            />
            <path
              d="M1110 100 Q1110 60 1150 60 Q1190 60 1190 100Z"
              fill="rgba(13,26,53,0.95)"
            />
            <ellipse
              cx="720"
              cy="140"
              rx="25"
              ry="35"
              fill="rgba(201,168,76,0.04)"
              className="arch-glow"
            />
            <rect
              x="0"
              y="198"
              width="1440"
              height="4"
              fill="rgba(201,168,76,0.08)"
            />
          </svg>
        </div>

        {/* Lanterns */}
        <div
          className="lantern-l fixed top-0 left-6 md:left-16 pointer-events-none"
          style={{zIndex: 2}}
        >
          <svg width="48" height="140" viewBox="0 0 48 140">
            <line
              x1="24"
              y1="0"
              x2="24"
              y2="20"
              stroke="rgba(201,168,76,0.4)"
              strokeWidth="1.5"
            />
            <path
              d="M16 20 Q24 17 32 20 L36 55 Q36 75 24 78 Q12 75 12 55Z"
              fill="rgba(9,19,42,0.95)"
              stroke="rgba(201,168,76,0.35)"
              strokeWidth="1"
            />
            <path
              d="M17 25 Q24 22 31 25 L34 52 Q34 68 24 70 Q14 68 14 52Z"
              fill="rgba(201,168,76,0.06)"
              className="lantern-glow"
            />
            <line
              x1="16"
              y1="35"
              x2="32"
              y2="35"
              stroke="rgba(201,168,76,0.25)"
              strokeWidth="0.8"
            />
            <line
              x1="14"
              y1="50"
              x2="34"
              y2="50"
              stroke="rgba(201,168,76,0.25)"
              strokeWidth="0.8"
            />
            <ellipse
              cx="24"
              cy="78"
              rx="6"
              ry="4"
              fill="rgba(9,19,42,0.9)"
              stroke="rgba(201,168,76,0.3)"
              strokeWidth="0.8"
            />
            <ellipse
              cx="24"
              cy="60"
              rx="8"
              ry="10"
              fill="rgba(201,168,76,0.08)"
              className="lantern-glow"
              style={{filter: "blur(4px)"}}
            />
          </svg>
        </div>
        <div
          className="lantern-r fixed top-0 right-6 md:right-16 pointer-events-none"
          style={{zIndex: 2}}
        >
          <svg width="48" height="140" viewBox="0 0 48 140">
            <line
              x1="24"
              y1="0"
              x2="24"
              y2="20"
              stroke="rgba(201,168,76,0.4)"
              strokeWidth="1.5"
            />
            <path
              d="M16 20 Q24 17 32 20 L36 55 Q36 75 24 78 Q12 75 12 55Z"
              fill="rgba(9,19,42,0.95)"
              stroke="rgba(201,168,76,0.35)"
              strokeWidth="1"
            />
            <path
              d="M17 25 Q24 22 31 25 L34 52 Q34 68 24 70 Q14 68 14 52Z"
              fill="rgba(201,168,76,0.07)"
              className="lantern-glow"
            />
            <line
              x1="16"
              y1="35"
              x2="32"
              y2="35"
              stroke="rgba(201,168,76,0.25)"
              strokeWidth="0.8"
            />
            <line
              x1="14"
              y1="50"
              x2="34"
              y2="50"
              stroke="rgba(201,168,76,0.25)"
              strokeWidth="0.8"
            />
            <ellipse
              cx="24"
              cy="78"
              rx="6"
              ry="4"
              fill="rgba(9,19,42,0.9)"
              stroke="rgba(201,168,76,0.3)"
              strokeWidth="0.8"
            />
            <ellipse
              cx="24"
              cy="60"
              rx="8"
              ry="10"
              fill="rgba(201,168,76,0.08)"
              className="lantern-glow"
              style={{filter: "blur(4px)"}}
            />
          </svg>
        </div>

        {/* Geometric ornaments */}
        <div
          className="geo-ornament fixed top-1/3 -left-24 pointer-events-none opacity-20"
          style={{zIndex: 1}}
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="geo-outer"
          >
            <polygon
              points="100,10 190,55 190,145 100,190 10,145 10,55"
              fill="none"
              stroke="rgba(201,168,76,0.4)"
              strokeWidth="0.8"
            />
            <polygon
              points="100,30 170,67 170,133 100,170 30,133 30,67"
              fill="none"
              stroke="rgba(201,168,76,0.3)"
              strokeWidth="0.6"
            />
            <polygon
              points="100,50 150,79 150,121 100,150 50,121 50,79"
              fill="none"
              stroke="rgba(201,168,76,0.2)"
              strokeWidth="0.5"
            />
          </svg>
        </div>
        <div
          className="geo-ornament fixed bottom-1/3 -right-24 pointer-events-none opacity-15"
          style={{zIndex: 1}}
        >
          <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            className="geo-inner"
          >
            <polygon
              points="90,8 172,53 172,127 90,172 8,127 8,53"
              fill="none"
              stroke="rgba(201,168,76,0.35)"
              strokeWidth="0.8"
            />
            <polygon
              points="90,28 152,65 152,115 90,152 28,115 28,65"
              fill="none"
              stroke="rgba(201,168,76,0.25)"
              strokeWidth="0.6"
            />
          </svg>
        </div>

        {/* ── Main content ── */}
        <div
          className="relative flex flex-col items-center justify-center min-h-screen px-4 py-16"
          style={{zIndex: 10}}
        >
          {/* Moon */}
          <div className="moon-float mb-5 relative flex items-center justify-center">
            <div className="relative">
              <div
                className="ring-pulse absolute inset-0 rounded-full border border-yellow-500/20"
                style={{animationDelay: "0s"}}
              />
              <div
                className="ring-pulse absolute inset-0 rounded-full border border-yellow-500/15"
                style={{animationDelay: "1.4s"}}
              />
              <svg width="64" height="64" viewBox="0 0 72 72" fill="none">
                <defs>
                  <radialGradient id="moonGrad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#f0d080" />
                    <stop offset="60%" stopColor="#c9a84c" />
                    <stop offset="100%" stopColor="#7a5c20" />
                  </radialGradient>
                </defs>
                <circle cx="36" cy="36" r="34" fill="rgba(201,168,76,0.06)" />
                <path
                  d="M36 6 A30 30 0 1 1 36 66 A22 22 0 1 0 36 6Z"
                  fill="url(#moonGrad)"
                />
                <path
                  d="M28 14 Q32 10 38 12 Q30 16 26 22 Q22 14 28 14Z"
                  fill="rgba(255,255,255,0.35)"
                />
                <circle cx="58" cy="18" r="1.5" fill="#f0d080" opacity="0.8" />
                <circle cx="14" cy="24" r="1" fill="#c9a84c" opacity="0.6" />
              </svg>
            </div>
          </div>

          {/* Arabic badge */}
          <div className="float-badge mb-3">
            <span
              className="font-amiri text-base tracking-widest px-4 py-1.5 rounded-full"
              style={{
                background: "rgba(30,58,110,0.4)",
                border: "1px solid rgba(201,168,76,0.2)",
                color: "rgba(232,212,139,0.7)",
                fontSize: "16px",
              }}
            >
              أَهْلاً وَسَهْلاً
            </span>
          </div>

          <h1
            className="font-amiri text-5xl md:text-6xl font-bold shimmer-gold mb-1 text-center"
            style={{letterSpacing: "4px"}}
          >
            Noor
          </h1>
          <p
            className="text-sm font-semibold mb-7 text-center"
            style={{
              color: "rgba(164,138,76,0.65)",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            نور &nbsp;·&nbsp; Join Your Iftar Group
          </p>

          {/* Card */}
          <div
            className="glass-card card-appear w-full rounded-3xl"
            style={{
              maxWidth: 440,
              padding: "36px 32px 32px",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.06)",
            }}
          >
            <div className="text-center mb-6">
              <h2
                className="text-xl font-bold mb-1"
                style={{
                  color: "#e8d48b",
                  fontFamily: "var(--font-nunito, Nunito), sans-serif",
                }}
              >
                Create your account
              </h2>
              <p className="text-sm" style={{color: "rgba(164,138,76,0.6)"}}>
                Join your hall's Iftar circle
              </p>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="divider-line" />
              <Sparkles size={12} color="rgba(201,168,76,0.4)" />
              <div className="divider-line" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name */}
              <div>
                <label
                  className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1.5"
                  style={{color: "rgba(201,168,76,0.55)"}}
                >
                  <User size={11} color="rgba(201,168,76,0.4)" /> Full Name
                </label>
                <div className="input-wrap">
                  <User
                    size={15}
                    color="rgba(74,111,165,0.5)"
                    className="input-icon"
                  />
                  <input
                    className={`input-field${errors.name ? " input-error" : ""}`}
                    type="text"
                    placeholder="Sadat Bhai"
                    value={form.name}
                    onChange={set("name")}
                    autoComplete="name"
                  />
                </div>
                {errors.name && <p className="err-text">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label
                  className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1.5"
                  style={{color: "rgba(201,168,76,0.55)"}}
                >
                  <Mail size={11} color="rgba(201,168,76,0.4)" /> Email Address
                </label>
                <div className="input-wrap">
                  <Mail
                    size={15}
                    color="rgba(74,111,165,0.5)"
                    className="input-icon"
                  />
                  <input
                    className={`input-field${errors.email ? " input-error" : ""}`}
                    type="email"
                    placeholder="sadat@handsome.com"
                    value={form.email}
                    onChange={set("email")}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="err-text">{errors.email}</p>}
              </div>

              {/* Room */}
              <div>
                <label
                  className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1.5"
                  style={{color: "rgba(201,168,76,0.55)"}}
                >
                  <Hash size={11} color="rgba(201,168,76,0.4)" /> Room Number
                </label>
                <div className="input-wrap">
                  <Hash
                    size={15}
                    color="rgba(74,111,165,0.5)"
                    className="input-icon"
                  />
                  <input
                    className={`input-field${errors.room ? " input-error" : ""}`}
                    type="text"
                    placeholder="e.g. 409"
                    value={form.room}
                    onChange={set("room")}
                  />
                </div>
                {errors.room && <p className="err-text">{errors.room}</p>}
              </div>

              {/* Password */}
              <div>
                <label
                  className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1.5"
                  style={{color: "rgba(201,168,76,0.55)"}}
                >
                  <Lock size={11} color="rgba(201,168,76,0.4)" /> Password
                </label>
                <div className="input-wrap">
                  <Lock
                    size={15}
                    color="rgba(74,111,165,0.5)"
                    className="input-icon"
                  />
                  <input
                    className={`input-field${errors.password ? " input-error" : ""}`}
                    style={{paddingRight: 44}}
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={set("password")}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{
                      color: "rgba(74,111,165,0.7)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="err-text">{errors.password}</p>
                )}
                {form.password.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3].map((lvl) => (
                      <div
                        key={lvl}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                          background:
                            strengthLevel >= lvl
                              ? strengthColor
                              : "rgba(30,58,110,0.4)",
                        }}
                      />
                    ))}
                    <span
                      className="text-xs font-bold w-10 text-right"
                      style={{color: strengthColor}}
                    >
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1.5"
                  style={{color: "rgba(201,168,76,0.55)"}}
                >
                  <Lock size={11} color="rgba(201,168,76,0.4)" /> Confirm
                  Password
                </label>
                <div className="input-wrap">
                  <Lock
                    size={15}
                    color="rgba(74,111,165,0.5)"
                    className="input-icon"
                  />
                  <input
                    className={`input-field${errors.confirm ? " input-error" : form.confirm && form.confirm === form.password ? " input-success" : ""}`}
                    style={{paddingRight: 44}}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={set("confirm")}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{
                      color: "rgba(74,111,165,0.7)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                    }}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {form.confirm && form.confirm === form.password && (
                    <div className="checkmark-pop absolute right-10 top-1/2 -translate-y-1/2">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M2.5 7 L5.5 10 L11.5 4"
                          stroke="#4ade80"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.confirm && <p className="err-text">{errors.confirm}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="animated-border-btn w-full font-bold rounded-2xl flex items-center justify-center gap-2.5 mt-2 transition-all duration-200 disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, #c9a84c 0%, #a07830 50%, #c9a84c 100%)",
                  backgroundSize: "200% 100%",
                  color: "#060d1f",
                  padding: "13px 24px",
                  fontSize: 15,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "0.3px",
                }}
                onMouseEnter={(e) =>
                  !loading &&
                  (e.currentTarget.style.backgroundPosition = "100% 0")
                }
                onMouseLeave={(e) =>
                  !loading &&
                  (e.currentTarget.style.backgroundPosition = "0% 0")
                }
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="rgba(6,13,31,0.3)"
                        strokeWidth="3"
                      />
                      <path
                        d="M12 2 A10 10 0 0 1 22 12"
                        stroke="#060d1f"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Creating account…
                  </>
                ) : (
                  <>
                    Join Noor
                    <Moon size={15} fill="#060d1f" color="#060d1f" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="divider-line" />
              <span
                className="text-xs font-semibold"
                style={{color: "rgba(74,111,165,0.6)", whiteSpace: "nowrap"}}
              >
                Already have an account?
              </span>
              <div className="divider-line" />
            </div>

            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 rounded-2xl font-bold text-sm transition-all duration-200"
              style={{
                padding: "12px 24px",
                background: "rgba(30,58,110,0.25)",
                border: "1px solid rgba(30,58,110,0.5)",
                color: "rgba(232,212,139,0.75)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(30,58,110,0.4)";
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
                e.currentTarget.style.color = "#e8d48b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(30,58,110,0.25)";
                e.currentTarget.style.borderColor = "rgba(30,58,110,0.5)";
                e.currentTarget.style.color = "rgba(232,212,139,0.75)";
              }}
            >
              <ArrowRight size={14} color="#c9a84c" />
              Sign in instead
            </Link>

            <p
              className="text-center text-xs mt-4"
              style={{color: "rgba(74,111,165,0.45)"}}
            >
              BUET Hall · Ramadan Iftar Tracker
            </p>
          </div>

          <div
            className="mt-8 h-px w-48"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)",
            }}
          />
          <p
            className="mt-3 text-xs font-semibold tracking-widest"
            style={{color: "rgba(201,168,76,0.2)", textTransform: "uppercase"}}
          >
            ✦ &nbsp; Ramadan Mubarak &nbsp; ✦
          </p>
        </div>
      </div>
    </>
  );
}
