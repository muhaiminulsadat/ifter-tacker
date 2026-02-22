"use client";

export default function LandingStyles() {
  return (
    <style>{`
      @keyframes lantern-sway {
        0%, 100% { transform: rotate(-4deg) translateY(0px); }
        50%       { transform: rotate(4deg) translateY(-4px); }
      }
      @keyframes lantern-glow {
        0%, 100% { opacity: 0.55; filter: blur(6px); }
        50%       { opacity: 1;    filter: blur(3px); }
      }
      @keyframes lantern-sway-r {
        0%, 100% { transform: rotate(4deg) translateY(-2px); }
        50%       { transform: rotate(-4deg) translateY(2px); }
      }
      @keyframes particle-float {
        0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
        10%  { opacity: 1; }
        90%  { opacity: 0.6; }
        100% { transform: translateY(-120px) translateX(var(--drift, 20px)); opacity: 0; }
      }
      @keyframes arch-shimmer {
        0%   { background-position: -400% center; }
        100% { background-position:  400% center; }
      }
      @keyframes moon-rise {
        from { transform: translateY(40px) scale(0.85); opacity: 0; }
        to   { transform: translateY(0px)  scale(1);    opacity: 1; }
      }
      @keyframes geo-drift {
        0%   { transform: rotate(0deg) scale(1); }
        50%  { transform: rotate(180deg) scale(1.08); }
        100% { transform: rotate(360deg) scale(1); }
      }
      @keyframes border-flow {
        0%   { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      @keyframes float-up-fade {
        from { opacity: 0; transform: translateY(32px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes star-pulse {
        0%,100% { transform: scale(1);   opacity: 0.15; }
        50%     { transform: scale(1.6); opacity: 1; }
      }
      @keyframes crescent-orbit {
        0%,100% { transform: translateY(0px)   rotate(-5deg); }
        50%     { transform: translateY(-14px)  rotate(5deg); }
      }
      @keyframes text-reveal {
        from { clip-path: inset(0 100% 0 0); opacity: 0; }
        to   { clip-path: inset(0 0% 0 0);   opacity: 1; }
      }
      @keyframes counter-glow {
        0%,100% { text-shadow: 0 0 20px rgba(201,168,76,0.2); }
        50%     { text-shadow: 0 0 60px rgba(201,168,76,0.7), 0 0 100px rgba(201,168,76,0.3); }
      }
      @keyframes rope-sway {
        0%,100% { d: path("M 0 0 Q 5 8 10 0"); }
        50%     { d: path("M 0 0 Q 5 -8 10 0"); }
      }

      .lantern-l { animation: lantern-sway   3.8s ease-in-out infinite; transform-origin: top center; }
      .lantern-r { animation: lantern-sway-r 4.2s ease-in-out infinite; transform-origin: top center; }
      .lantern-glow-inner { animation: lantern-glow 2.5s ease-in-out infinite; }

      .particle {
        position: absolute;
        width: 3px; height: 3px;
        border-radius: 50%;
        background: #c9a84c;
        animation: particle-float var(--dur, 4s) ease-in var(--delay, 0s) infinite;
        pointer-events: none;
      }

      .moon-rise { animation: moon-rise 1.2s cubic-bezier(0.22, 1, 0.36, 1) both; }
      .geo-drift { animation: geo-drift 60s linear infinite; }
      .counter-glow { animation: counter-glow 3s ease-in-out infinite; }
      .crescent-orbit { animation: crescent-orbit 5s ease-in-out infinite; }

      .hero-text-1 { animation: float-up-fade 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both; }
      .hero-text-2 { animation: float-up-fade 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both; }
      .hero-text-3 { animation: float-up-fade 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both; }
      .hero-text-4 { animation: float-up-fade 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both; }
      .hero-text-5 { animation: float-up-fade 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.7s both; }

      .animated-border {
        position: relative;
      }
      .animated-border::before {
        content: '';
        position: absolute;
        inset: -1px;
        border-radius: inherit;
        padding: 1px;
        background: linear-gradient(90deg, #c9a84c, #f0d080, #a07830, #c9a84c);
        background-size: 200% 100%;
        animation: border-flow 3s linear infinite;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
      }

      .feature-card {
        position: relative;
        overflow: hidden;
        transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
      }
      .feature-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(201,168,76,0.08) 0%, transparent 65%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }
      .feature-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.2); }
      .feature-card:hover::before { opacity: 1; }

      .arch-clip {
        clip-path: ellipse(100% 85% at 50% 100%);
      }

      .step-line::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 100%;
        width: 1px;
        height: 48px;
        background: linear-gradient(to bottom, rgba(201,168,76,0.4), transparent);
        transform: translateX(-50%);
      }

      .quote-section {
        background:
          radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30,58,110,0.4) 0%, transparent 70%),
          radial-gradient(ellipse 40% 40% at 20% 80%, rgba(201,168,76,0.06) 0%, transparent 60%),
          #060d1f;
      }

      .marquee-track {
        display: flex;
        gap: 0;
        animation: marquee-scroll 25s linear infinite;
        width: max-content;
      }
      @keyframes marquee-scroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }

      .nav-blur {
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
      }

      .glow-text {
        text-shadow: 0 0 80px rgba(201,168,76,0.4), 0 0 160px rgba(201,168,76,0.15);
      }

      @media (max-width: 768px) {
        .lantern-l, .lantern-r { display: none; }
      }
    `}</style>
  );
}
