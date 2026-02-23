const RAMADAN_START = new Date("2026-02-19T00:00:00+06:00");

export function getRamadanDay() {
  const now = new Date();
  const diffMs = now - RAMADAN_START;
  if (diffMs < 0) return 1;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(diffDays, 30);
}

export function isRamadanActive() {
  const now = new Date();
  return now >= RAMADAN_START && getRamadanDay() <= 30;
}

const DHAKA_IFTAR_TIMES = [
  "6:09 PM",
  "6:10 PM",
  "6:10 PM",
  "6:11 PM",
  "6:11 PM",
  "6:12 PM",
  "6:12 PM",
  "6:13 PM",
  "6:13 PM",
  "6:14 PM",
  "6:14 PM",
  "6:15 PM",
  "6:15 PM",
  "6:16 PM",
  "6:16 PM",
  "6:17 PM",
  "6:17 PM",
  "6:18 PM",
  "6:18 PM",
  "6:19 PM",
  "6:19 PM",
  "6:20 PM",
  "6:20 PM",
  "6:21 PM",
  "6:21 PM",
  "6:22 PM",
  "6:22 PM",
  "6:23 PM",
  "6:23 PM",
  "6:24 PM",
];

export function getIftarTime(day) {
  const idx = Math.min(Math.max(day, 1), 30) - 1;
  return DHAKA_IFTAR_TIMES[idx];
}
