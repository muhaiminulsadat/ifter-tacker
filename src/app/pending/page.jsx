import Link from "next/link";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

export default async function PendingPage() {
  const session = await auth.api.getSession({headers: await headers()});
  if (!session) redirect("/login");
  if (session.user.isApproved) redirect("/dashboard");

  return (
    <>
      <style>{`
        @keyframes star-twinkle {
          0%, 100% { opacity: var(--op, 0.3); transform: scale(1); }
          50%       { opacity: 1; transform: scale(1.6); }
        }
        @keyframes moon-ascend {
          0%   { transform: translateY(60px) scale(0.7) rotate(-8deg); opacity: 0; filter: blur(8px); }
          60%  { filter: blur(0px); }
          100% { transform: translateY(0px) scale(1) rotate(-4deg); opacity: 1; }
        }
        @keyframes moon-drift {
          0%, 100% { transform: translateY(0px) rotate(-4deg); }
          50%       { transform: translateY(-18px) rotate(4deg); }
        }
        @keyframes moon-glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(201,168,76,0.55)) drop-shadow(0 0 60px rgba(201,168,76,0.18)); }
          50%       { filter: drop-shadow(0 0 45px rgba(201,168,76,0.9)) drop-shadow(0 0 110px rgba(201,168,76,0.35)); }
        }
        @keyframes card-rise {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer-text {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        @keyframes ring-expand {
          0%   { transform: scale(0.85); opacity: 0.7; }
          100% { transform: scale(2.4);  opacity: 0; }
        }
        @keyframes dot-pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40%            { transform: scale(1.2); opacity: 1; }
        }
        @keyframes particle-float {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          8%   { opacity: 1; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(-200px) translateX(var(--dx, 20px)); opacity: 0; }
        }
        @keyframes geo-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes geo-rotate-r {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes lantern-sway {
          0%, 100% { transform: rotate(-6deg) translateY(0); }
          50%       { transform: rotate(6deg) translateY(-8px); }
        }
        @keyframes lantern-sway-r {
          0%, 100% { transform: rotate(6deg) translateY(-4px); }
          50%       { transform: rotate(-6deg) translateY(4px); }
        }
        @keyframes lantern-flicker {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 0.9; }
        }
        @keyframes mosque-appear {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes arch-breathe {
          0%, 100% { opacity: 0.03; }
          50%       { opacity: 0.08; }
        }
        @keyframes badge-float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50%       { transform: translateY(-6px) rotate(1deg); }
        }
        @keyframes border-flow {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes text-reveal {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hourglass-drip {
          0%, 100% { height: 0%; opacity: 0.4; }
          50%       { height: 100%; opacity: 1; }
        }

        .star         { animation: star-twinkle var(--dur, 3s) ease-in-out infinite var(--delay, 0s); }
        .moon-enter   { animation: moon-ascend 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both; }
        .moon-drift   { animation: moon-drift 6s ease-in-out infinite, moon-glow-pulse 6s ease-in-out infinite; }
        .card-rise    { animation: card-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both; }
        .badge-float  { animation: badge-float 5s ease-in-out infinite; }
        .particle     { animation: particle-float var(--dur, 9s) ease-in var(--delay, 0s) infinite; }
        .geo-cw       { animation: geo-rotate   50s linear infinite; }
        .geo-ccw      { animation: geo-rotate-r 35s linear infinite; }
        .lantern-l    { animation: lantern-sway   4.2s ease-in-out infinite; transform-origin: top center; }
        .lantern-r    { animation: lantern-sway-r 4.8s ease-in-out infinite; transform-origin: top center; }
        .lantern-glow { animation: lantern-flicker 2.8s ease-in-out infinite; }
        .mosque-rise  { animation: mosque-appear 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both; }
        .arch-glow    { animation: arch-breathe 4s ease-in-out infinite; }

        .shimmer-gold {
          background: linear-gradient(90deg, #7a5c20, #c9a84c, #f0d080, #e8c060, #c9a84c, #7a5c20);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-text 4s linear infinite;
        }

        .dot1 { animation: dot-pulse 1.6s ease-in-out infinite 0s; }
        .dot2 { animation: dot-pulse 1.6s ease-in-out infinite 0.3s; }
        .dot3 { animation: dot-pulse 1.6s ease-in-out infinite 0.6s; }

        .ring { animation: ring-expand 3s ease-out infinite; }
        .ring2 { animation: ring-expand 3s ease-out infinite 1.5s; }

        .text-1 { animation: text-reveal 0.7s cubic-bezier(0.22,1,0.36,1) 0.9s both; }
        .text-2 { animation: text-reveal 0.7s cubic-bezier(0.22,1,0.36,1) 1.1s both; }
        .text-3 { animation: text-reveal 0.7s cubic-bezier(0.22,1,0.36,1) 1.3s both; }
        .text-4 { animation: text-reveal 0.7s cubic-bezier(0.22,1,0.36,1) 1.5s both; }

        .animated-border-btn {
          position: relative; z-index: 0;
        }
        .animated-border-btn::before {
          content: ''; position: absolute; inset: -1px;
          border-radius: inherit; padding: 1px;
          background: linear-gradient(90deg, #c9a84c, #f0d080, #a07830, #c9a84c);
          background-size: 200% 100%;
          animation: border-flow 3s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          pointer-events: none;
        }

        .glass-card {
          background: linear-gradient(145deg, rgba(13,26,53,0.97) 0%, rgba(9,19,42,0.99) 100%);
          border: 1px solid rgba(30,58,110,0.55);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
        }
        .geo-bg {
          background-image:
            repeating-linear-gradient( 45deg, rgba(201,168,76,0.035) 0, rgba(201,168,76,0.035) 1px, transparent 1px, transparent 22px),
            repeating-linear-gradient(-45deg, rgba(201,168,76,0.035) 0, rgba(201,168,76,0.035) 1px, transparent 1px, transparent 22px);
        }
        .divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(30,58,110,0.5), transparent);
        }

        @media (max-width: 640px) {
          .lantern-l, .lantern-r, .geo-ornament { display: none; }
        }
      `}</style>

      <div
        className="min-h-screen geo-bg flex flex-col overflow-hidden relative"
        style={{background: "#060d1f"}}
      >
        {/* ── Star field ── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[
            [12, 8, 1.8, 3.2, 0.8, 0],
            [25, 22, 1.2, 4.1, 1.2, 0],
            [38, 5, 2.1, 2.8, 0.6, 0],
            [54, 18, 1.5, 3.6, 0.3, 0],
            [67, 11, 0.9, 5.0, 1.8, 0],
            [78, 25, 1.7, 2.5, 0.5, 0],
            [89, 7, 1.3, 4.4, 1.1, 0],
            [6, 35, 2.0, 3.0, 0.7, 0],
            [18, 42, 1.1, 4.8, 1.5, 0],
            [32, 30, 1.6, 2.9, 0.2, 0],
            [47, 48, 0.8, 5.2, 1.9, 0],
            [61, 38, 1.9, 3.3, 0.4, 0],
            [73, 55, 1.4, 4.0, 1.3, 0],
            [84, 43, 2.2, 2.6, 0.9, 0],
            [93, 60, 1.0, 4.6, 1.6, 0],
            [9, 65, 1.8, 3.1, 0.1, 0],
            [22, 72, 1.3, 4.7, 1.4, 0],
            [35, 80, 0.9, 5.3, 0.6, 0],
            [48, 68, 2.0, 2.7, 1.0, 0],
            [59, 85, 1.5, 3.8, 0.3, 0],
            [72, 75, 1.1, 4.2, 1.7, 0],
            [85, 90, 1.7, 3.0, 0.8, 0],
            [96, 82, 1.2, 4.5, 1.2, 0],
            [14, 92, 2.1, 2.8, 0.5, 0],
            [27, 88, 0.8, 5.1, 1.9, 0],
            [41, 95, 1.6, 3.4, 0.2, 0],
            [55, 78, 1.4, 4.3, 1.5, 0],
            [68, 93, 1.9, 2.9, 0.7, 0],
            [81, 70, 1.0, 4.9, 1.3, 0],
            [4, 55, 1.5, 3.7, 0.4, 0],
            [91, 45, 1.2, 4.1, 1.0, 0],
            [44, 14, 2.0, 2.6, 0.9, 0],
            [57, 3, 1.7, 3.5, 0.6, 0],
            [70, 28, 0.9, 4.8, 1.8, 0],
            [82, 15, 1.4, 3.2, 0.3, 0],
            [3, 20, 1.8, 4.0, 1.1, 0],
            [16, 50, 1.1, 5.0, 0.8, 0],
            [29, 62, 2.2, 2.7, 1.4, 0],
            [43, 58, 1.3, 4.4, 0.2, 0],
            [64, 32, 1.6, 3.6, 1.6, 0],
            [76, 47, 0.8, 5.2, 0.5, 0],
            [88, 38, 1.9, 3.0, 1.2, 0],
          ].map(([x, y, sz, dur, delay], i) => (
            <div
              key={i}
              className="star absolute rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: sz,
                height: sz,
                background: i % 5 === 0 ? "#f0d080" : "#c9a84c",
                "--op": 0.2 + (i % 5) * 0.12,
                "--dur": `${dur}s`,
                "--delay": `${delay}s`,
              }}
            />
          ))}
        </div>

        {/* ── Ambient glow layers ── */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            style={{
              position: "absolute",
              top: "8%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 700,
              height: 700,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(30,58,110,0.16) 0%, transparent 68%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "25%",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "25%",
              right: "20%",
              width: 260,
              height: 260,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 900,
              height: 350,
              background:
                "radial-gradient(ellipse, rgba(30,58,110,0.14) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* ── Rising particles ── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[
            [8, 85, 2.5, 9, 0, "-25px"],
            [18, 92, 1.8, 11, 2, "30px"],
            [30, 78, 3, 8, 1, "-40px"],
            [42, 88, 2, 12, 4, "20px"],
            [55, 95, 2.8, 10, 1.5, "-35px"],
            [67, 82, 1.5, 13, 3, "45px"],
            [78, 90, 2.2, 9, 0.5, "-20px"],
            [88, 87, 3, 11, 2.5, "30px"],
            [22, 75, 1.8, 10, 3.5, "-50px"],
            [48, 80, 2.5, 12, 1, "40px"],
            [62, 93, 2, 8, 4.5, "-30px"],
            [95, 85, 1.5, 11, 0, "-45px"],
          ].map(([x, y, sz, dur, delay, dx], i) => (
            <div
              key={i}
              className="particle absolute rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: sz,
                height: sz,
                background: "radial-gradient(circle, #f0d080, #c9a84c)",
                "--dur": `${dur}s`,
                "--delay": `${delay}s`,
                "--dx": dx,
              }}
            />
          ))}
        </div>

        {/* ── Mosque silhouette ── */}
        <div
          className="mosque-rise fixed bottom-0 left-0 right-0 pointer-events-none"
          style={{zIndex: 1}}
        >
          <svg
            viewBox="0 0 1440 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMax slice"
          >
            {/* Left minaret */}
            <rect
              x="50"
              y="70"
              width="20"
              height="150"
              fill="rgba(9,19,42,0.95)"
            />
            <path d="M50 70 Q60 42 70 70Z" fill="rgba(9,19,42,0.95)" />
            <rect
              x="57"
              y="40"
              width="6"
              height="32"
              fill="rgba(201,168,76,0.35)"
            />
            <circle cx="60" cy="38" r="5" fill="rgba(201,168,76,0.55)" />
            <rect
              x="45"
              y="100"
              width="30"
              height="3"
              fill="rgba(201,168,76,0.1)"
            />
            <rect
              x="45"
              y="130"
              width="30"
              height="3"
              fill="rgba(201,168,76,0.1)"
            />
            {/* Far left minaret */}
            <rect
              x="130"
              y="100"
              width="14"
              height="120"
              fill="rgba(9,19,42,0.88)"
            />
            <path d="M130 100 Q137 78 144 100Z" fill="rgba(9,19,42,0.88)" />
            <rect
              x="134"
              y="75"
              width="5"
              height="25"
              fill="rgba(201,168,76,0.25)"
            />
            <circle cx="136" cy="73" r="3.5" fill="rgba(201,168,76,0.4)" />
            {/* Right minaret */}
            <rect
              x="1370"
              y="70"
              width="20"
              height="150"
              fill="rgba(9,19,42,0.95)"
            />
            <path d="M1370 70 Q1380 42 1390 70Z" fill="rgba(9,19,42,0.95)" />
            <rect
              x="1377"
              y="40"
              width="6"
              height="32"
              fill="rgba(201,168,76,0.35)"
            />
            <circle cx="1380" cy="38" r="5" fill="rgba(201,168,76,0.55)" />
            <rect
              x="1365"
              y="100"
              width="30"
              height="3"
              fill="rgba(201,168,76,0.1)"
            />
            <rect
              x="1365"
              y="130"
              width="30"
              height="3"
              fill="rgba(201,168,76,0.1)"
            />
            {/* Far right minaret */}
            <rect
              x="1296"
              y="100"
              width="14"
              height="120"
              fill="rgba(9,19,42,0.88)"
            />
            <path d="M1296 100 Q1303 78 1310 100Z" fill="rgba(9,19,42,0.88)" />
            <rect
              x="1300"
              y="75"
              width="5"
              height="25"
              fill="rgba(201,168,76,0.25)"
            />
            <circle cx="1303" cy="73" r="3.5" fill="rgba(201,168,76,0.4)" />
            {/* Left wing */}
            <path
              d="M190 220 L190 140 Q190 108 222 108 L420 108 Q448 108 448 130 L448 220Z"
              fill="rgba(9,19,42,0.96)"
            />
            <path
              d="M305 108 Q305 65 345 62 Q385 65 385 108Z"
              fill="rgba(13,26,53,0.96)"
            />
            <path
              d="M240 108 Q240 88 258 86 Q276 88 276 108Z"
              fill="rgba(13,26,53,0.92)"
            />
            {/* Main dome */}
            <path
              d="M570 220 L570 118 L594 118 Q594 58 720 52 Q846 58 846 118 L870 118 L870 220Z"
              fill="rgba(7,17,31,0.98)"
            />
            <path
              d="M720 52 Q720 16 742 10 Q764 16 764 52"
              fill="rgba(9,19,42,0.98)"
              stroke="rgba(201,168,76,0.18)"
              strokeWidth="1"
            />
            <circle cx="742" cy="8" r="6" fill="rgba(201,168,76,0.5)" />
            {/* Dome decorations */}
            <ellipse
              cx="720"
              cy="145"
              rx="28"
              ry="38"
              fill="rgba(201,168,76,0.04)"
              className="arch-glow"
            />
            <ellipse
              cx="648"
              cy="160"
              rx="16"
              ry="24"
              fill="rgba(201,168,76,0.03)"
              className="arch-glow"
            />
            <ellipse
              cx="792"
              cy="160"
              rx="16"
              ry="24"
              fill="rgba(201,168,76,0.03)"
              className="arch-glow"
            />
            {/* Right wing */}
            <path
              d="M992 220 L992 140 Q992 108 1018 108 L1218 108 Q1250 108 1250 130 L1250 220Z"
              fill="rgba(9,19,42,0.96)"
            />
            <path
              d="M1105 108 Q1105 65 1145 62 Q1185 65 1185 108Z"
              fill="rgba(13,26,53,0.96)"
            />
            <path
              d="M1164 108 Q1164 88 1182 86 Q1200 88 1200 108Z"
              fill="rgba(13,26,53,0.92)"
            />
            {/* Ground glow line */}
            <rect
              x="0"
              y="218"
              width="1440"
              height="4"
              fill="rgba(201,168,76,0.07)"
            />
            <rect
              x="540"
              y="216"
              width="360"
              height="2"
              fill="rgba(201,168,76,0.15)"
            />
          </svg>
        </div>

        {/* ── Lanterns ── */}
        <div
          className="lantern-l fixed top-0 left-8 md:left-20 pointer-events-none"
          style={{zIndex: 2}}
        >
          <svg width="52" height="160" viewBox="0 0 52 160">
            <line
              x1="26"
              y1="0"
              x2="26"
              y2="22"
              stroke="rgba(201,168,76,0.45)"
              strokeWidth="1.5"
            />
            <path
              d="M17 22 Q26 18 35 22 L40 62 Q40 85 26 88 Q12 85 12 62Z"
              fill="rgba(7,17,31,0.96)"
              stroke="rgba(201,168,76,0.4)"
              strokeWidth="1"
            />
            <path
              d="M18 28 Q26 24 34 28 L37 58 Q37 76 26 78 Q15 76 15 58Z"
              fill="rgba(201,168,76,0.07)"
              className="lantern-glow"
            />
            <line
              x1="17"
              y1="38"
              x2="35"
              y2="38"
              stroke="rgba(201,168,76,0.28)"
              strokeWidth="0.8"
            />
            <line
              x1="15"
              y1="55"
              x2="37"
              y2="55"
              stroke="rgba(201,168,76,0.28)"
              strokeWidth="0.8"
            />
            <path
              d="M17 35 Q26 40 35 35"
              fill="none"
              stroke="rgba(201,168,76,0.15)"
              strokeWidth="0.6"
            />
            <ellipse
              cx="26"
              cy="88"
              rx="7"
              ry="4.5"
              fill="rgba(7,17,31,0.95)"
              stroke="rgba(201,168,76,0.35)"
              strokeWidth="0.8"
            />
            <line
              x1="22"
              y1="92"
              x2="26"
              y2="102"
              stroke="rgba(201,168,76,0.3)"
              strokeWidth="0.8"
            />
            <line
              x1="26"
              y1="92"
              x2="26"
              y2="102"
              stroke="rgba(201,168,76,0.3)"
              strokeWidth="0.8"
            />
            <line
              x1="30"
              y1="92"
              x2="26"
              y2="102"
              stroke="rgba(201,168,76,0.3)"
              strokeWidth="0.8"
            />
            <ellipse
              cx="26"
              cy="68"
              rx="10"
              ry="12"
              fill="rgba(201,168,76,0.09)"
              className="lantern-glow"
              style={{filter: "blur(5px)"}}
            />
          </svg>
        </div>
        <div
          className="lantern-r fixed top-0 right-8 md:right-20 pointer-events-none"
          style={{zIndex: 2}}
        >
          <svg width="52" height="160" viewBox="0 0 52 160">
            <line
              x1="26"
              y1="0"
              x2="26"
              y2="22"
              stroke="rgba(201,168,76,0.45)"
              strokeWidth="1.5"
            />
            <path
              d="M17 22 Q26 18 35 22 L40 62 Q40 85 26 88 Q12 85 12 62Z"
              fill="rgba(7,17,31,0.96)"
              stroke="rgba(201,168,76,0.4)"
              strokeWidth="1"
            />
            <path
              d="M18 28 Q26 24 34 28 L37 58 Q37 76 26 78 Q15 76 15 58Z"
              fill="rgba(201,168,76,0.08)"
              className="lantern-glow"
            />
            <line
              x1="17"
              y1="38"
              x2="35"
              y2="38"
              stroke="rgba(201,168,76,0.28)"
              strokeWidth="0.8"
            />
            <line
              x1="15"
              y1="55"
              x2="37"
              y2="55"
              stroke="rgba(201,168,76,0.28)"
              strokeWidth="0.8"
            />
            <ellipse
              cx="26"
              cy="88"
              rx="7"
              ry="4.5"
              fill="rgba(7,17,31,0.95)"
              stroke="rgba(201,168,76,0.35)"
              strokeWidth="0.8"
            />
            <line
              x1="22"
              y1="92"
              x2="26"
              y2="102"
              stroke="rgba(201,168,76,0.3)"
              strokeWidth="0.8"
            />
            <line
              x1="26"
              y1="92"
              x2="26"
              y2="102"
              stroke="rgba(201,168,76,0.3)"
              strokeWidth="0.8"
            />
            <line
              x1="30"
              y1="92"
              x2="26"
              y2="102"
              stroke="rgba(201,168,76,0.3)"
              strokeWidth="0.8"
            />
            <ellipse
              cx="26"
              cy="68"
              rx="10"
              ry="12"
              fill="rgba(201,168,76,0.09)"
              className="lantern-glow"
              style={{filter: "blur(5px)"}}
            />
          </svg>
        </div>

        {/* ── Geometric ornaments ── */}
        <div
          className="geo-ornament fixed top-1/4 -left-28 pointer-events-none opacity-[0.18]"
          style={{zIndex: 1}}
        >
          <svg
            width="220"
            height="220"
            viewBox="0 0 220 220"
            className="geo-cw"
          >
            <polygon
              points="110,8 208,62 208,158 110,212 12,158 12,62"
              fill="none"
              stroke="rgba(201,168,76,0.5)"
              strokeWidth="0.8"
            />
            <polygon
              points="110,28 188,75 188,145 110,192 32,145 32,75"
              fill="none"
              stroke="rgba(201,168,76,0.35)"
              strokeWidth="0.6"
            />
            <polygon
              points="110,50 165,82 165,138 110,170 55,138 55,82"
              fill="none"
              stroke="rgba(201,168,76,0.2)"
              strokeWidth="0.5"
            />
            <circle
              cx="110"
              cy="110"
              r="8"
              fill="none"
              stroke="rgba(201,168,76,0.3)"
              strokeWidth="0.5"
            />
          </svg>
        </div>
        <div
          className="geo-ornament fixed bottom-1/4 -right-28 pointer-events-none opacity-[0.15]"
          style={{zIndex: 1}}
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="geo-ccw"
          >
            <polygon
              points="100,6 194,56 194,144 100,194 6,144 6,56"
              fill="none"
              stroke="rgba(201,168,76,0.45)"
              strokeWidth="0.8"
            />
            <polygon
              points="100,26 174,69 174,131 100,174 26,131 26,69"
              fill="none"
              stroke="rgba(201,168,76,0.3)"
              strokeWidth="0.6"
            />
          </svg>
        </div>

        {/* ── Main content ── */}
        <div
          className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20"
          style={{zIndex: 10}}
        >
          {/* Moon */}
          <div
            className="moon-enter mb-8 relative"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="moon-drift relative">
              {/* Pulse rings */}
              <div
                className="ring absolute inset-0 rounded-full"
                style={{border: "1px solid rgba(201,168,76,0.25)"}}
              />
              <div
                className="ring2 absolute inset-0 rounded-full"
                style={{border: "1px solid rgba(201,168,76,0.15)"}}
              />

              <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                <defs>
                  <radialGradient id="mg" cx="32%" cy="30%" r="68%">
                    <stop offset="0%" stopColor="#f5e4a0" />
                    <stop offset="45%" stopColor="#c9a84c" />
                    <stop offset="100%" stopColor="#6b4e18" />
                  </radialGradient>
                  <radialGradient id="glowBg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(201,168,76,0.12)" />
                    <stop offset="100%" stopColor="rgba(201,168,76,0)" />
                  </radialGradient>
                </defs>
                <circle cx="45" cy="45" r="43" fill="url(#glowBg)" />
                <path
                  d="M45 7 A38 38 0 1 1 45 83 A28 28 0 1 0 45 7Z"
                  fill="url(#mg)"
                />
                {/* Craters */}
                <circle cx="35" cy="32" r="4" fill="rgba(0,0,0,0.08)" />
                <circle cx="55" cy="50" r="2.5" fill="rgba(0,0,0,0.06)" />
                <circle cx="42" cy="58" r="3" fill="rgba(0,0,0,0.05)" />
                {/* Highlight */}
                <path
                  d="M34 16 Q40 11 48 14 Q38 19 32 27 Q27 16 34 16Z"
                  fill="rgba(255,255,255,0.4)"
                />
                {/* Stars near moon */}
                <circle cx="74" cy="20" r="2" fill="#f0d080" opacity="0.9" />
                <circle cx="16" cy="28" r="1.5" fill="#c9a84c" opacity="0.7" />
                <circle cx="76" cy="62" r="1.2" fill="#f0d080" opacity="0.6" />
              </svg>
            </div>
          </div>

          {/* Arabic welcome badge */}
          <div className="badge-float mb-4">
            <span
              className="font-amiri px-5 py-2 rounded-full"
              style={{
                background: "rgba(30,58,110,0.35)",
                border: "1px solid rgba(201,168,76,0.22)",
                color: "rgba(232,212,139,0.75)",
                fontSize: "18px",
                letterSpacing: "2px",
              }}
            >
              بِانْتِظَارِ الْمَوَافَقَة
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-amiri shimmer-gold text-center mb-1 text-1"
            style={{
              fontSize: "clamp(42px, 7vw, 72px)",
              fontWeight: 700,
              letterSpacing: "3px",
              lineHeight: 1.1,
            }}
          >
            Noor
          </h1>
          <p
            className="text-2 text-center font-bold mb-8"
            style={{
              color: "rgba(164,138,76,0.6)",
              letterSpacing: "4px",
              fontSize: "12px",
              textTransform: "uppercase",
            }}
          >
            نور &nbsp;·&nbsp; Ramadan Iftar Manager
          </p>

          {/* ── Main card ── */}
          <div
            className="card-rise glass-card w-full rounded-3xl"
            style={{
              maxWidth: 460,
              padding: "40px 36px 36px",
              boxShadow:
                "0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.07), inset 0 1px 0 rgba(201,168,76,0.07)",
            }}
          >
            {/* Hourglass / waiting icon */}
            <div className="flex justify-center mb-6">
              <div
                className="relative flex items-center justify-center"
                style={{width: 64, height: 64}}
              >
                {/* Outer ring */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: "1px solid rgba(201,168,76,0.2)",
                    background: "rgba(201,168,76,0.04)",
                  }}
                />
                {/* Waiting dots */}
                <div className="flex items-center gap-1.5">
                  <div
                    className="dot1 rounded-full"
                    style={{width: 7, height: 7, background: "#c9a84c"}}
                  />
                  <div
                    className="dot2 rounded-full"
                    style={{width: 7, height: 7, background: "#c9a84c"}}
                  />
                  <div
                    className="dot3 rounded-full"
                    style={{width: 7, height: 7, background: "#c9a84c"}}
                  />
                </div>
              </div>
            </div>

            {/* Card title */}
            <div className="text-center mb-2 text-3">
              <h2
                className="font-bold mb-1.5"
                style={{
                  color: "#e8d48b",
                  fontFamily: "var(--font-nunito, Nunito), sans-serif",
                  fontSize: "22px",
                  letterSpacing: "0.3px",
                }}
              >
                Pending Approval
              </h2>
            </div>

            {/* Gold divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="divider-line" />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1 L9.5 6 L15 6 L10.5 9.5 L12 14.5 L8 11 L4 14.5 L5.5 9.5 L1 6 L6.5 6Z"
                  fill="none"
                  stroke="rgba(201,168,76,0.4)"
                  strokeWidth="0.8"
                />
              </svg>
              <div className="divider-line" />
            </div>

            {/* Message */}
            <div className="text-center mb-6 text-4">
              <p
                className="text-sm leading-relaxed mb-3"
                style={{
                  color: "rgba(232,212,139,0.55)",
                  fontFamily: "var(--font-nunito, Nunito), sans-serif",
                }}
              >
                Your account has been created successfully. The group admin
                needs to approve your membership before you can access the
                dashboard.
              </p>
              <p className="text-xs" style={{color: "rgba(74,111,165,0.6)"}}>
                You'll be notified once your access is granted.
              </p>
            </div>

            {/* Status steps */}
            <div
              className="rounded-2xl p-4 mb-6"
              style={{
                background: "rgba(9,19,42,0.6)",
                border: "1px solid rgba(30,58,110,0.4)",
              }}
            >
              {[
                {label: "Account created", done: true},
                {label: "Admin review", done: false, active: true},
                {label: "Access granted", done: false},
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3"
                  style={{marginBottom: i < 2 ? 12 : 0}}
                >
                  {/* Icon */}
                  <div
                    className="shrink-0 flex items-center justify-center rounded-full"
                    style={{
                      width: 24,
                      height: 24,
                      background: step.done
                        ? "rgba(74,222,128,0.15)"
                        : step.active
                          ? "rgba(201,168,76,0.15)"
                          : "rgba(30,58,110,0.3)",
                      border: `1px solid ${step.done ? "rgba(74,222,128,0.4)" : step.active ? "rgba(201,168,76,0.4)" : "rgba(30,58,110,0.5)"}`,
                    }}
                  >
                    {step.done ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6 L5 9 L10 3"
                          stroke="#4ade80"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : step.active ? (
                      <div
                        className="dot1 rounded-full"
                        style={{width: 6, height: 6, background: "#c9a84c"}}
                      />
                    ) : (
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "rgba(74,111,165,0.3)",
                        }}
                      />
                    )}
                  </div>

                  {/* Connector + label */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-bold"
                        style={{
                          color: step.done
                            ? "rgba(74,222,128,0.8)"
                            : step.active
                              ? "rgba(201,168,76,0.85)"
                              : "rgba(74,111,165,0.45)",
                        }}
                      >
                        {step.label}
                      </span>
                      {step.done && (
                        <span
                          className="text-[10px] font-bold"
                          style={{color: "rgba(74,222,128,0.5)"}}
                        >
                          Done
                        </span>
                      )}
                      {step.active && (
                        <span
                          className="text-[10px] font-bold"
                          style={{color: "rgba(201,168,76,0.6)"}}
                        >
                          In progress
                        </span>
                      )}
                    </div>
                    {i < 2 && (
                      <div
                        style={{
                          height: 1,
                          background: step.done
                            ? "rgba(74,222,128,0.15)"
                            : "rgba(30,58,110,0.3)",
                          marginTop: 6,
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="animated-border-btn w-full flex items-center justify-center gap-2 rounded-2xl font-bold text-sm transition-all duration-200"
                style={{
                  padding: "13px 24px",
                  background:
                    "linear-gradient(135deg, #c9a84c 0%, #a07830 50%, #c9a84c 100%)",
                  backgroundSize: "200% 100%",
                  color: "#060d1f",
                  textDecoration: "none",
                  fontSize: 14,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1 L1 7 L7 13 M1 7 L13 7"
                    stroke="#060d1f"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back to Home
              </Link>
            </div>

            <p
              className="text-center text-[11px] mt-5"
              style={{color: "rgba(74,111,165,0.35)"}}
            >
              BUET Hall · Ramadan Iftar Tracker
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center gap-2">
            <div
              style={{
                width: 180,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(201,168,76,0.28), transparent)",
              }}
            />
            <p
              style={{
                color: "rgba(201,168,76,0.18)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "4px",
                textTransform: "uppercase",
              }}
            >
              ✦ &nbsp; Ramadan Mubarak &nbsp; ✦
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
