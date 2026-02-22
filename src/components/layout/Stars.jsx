"use client";

const STARS = Array.from({length: 35}, (_, i) => ({
  id: i,
  left: `${(i * 37.7 + 11) % 100}%`,
  top: `${(i * 53.3 + 7) % 100}%`,
  size: (i % 3) + 1,
  dur: `${(i % 4) + 2}s`,
  delay: `${(i % 5) * 0.8}s`,
}));

export default function Stars() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {STARS.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            position: "absolute",
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#e8d48b",
            "--dur": s.dur,
            "--delay": s.delay,
          }}
        />
      ))}
    </div>
  );
}
