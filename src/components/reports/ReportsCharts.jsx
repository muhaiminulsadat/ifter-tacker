"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const GOLD = "#c9a84c";
const GOLD_LIGHT = "#f0d080";
const BLUE = "#1e3a6e";
const BLUE_LIGHT = "#4a6fa5";
const SUCCESS = "#4ade80";
const ERROR = "#f87171";
const INFO = "#60a5fa";
const PURPLE = "#c084fc";
const ORANGE = "#fb923c";

const CATEGORY_COLORS = [
  GOLD,
  INFO,
  SUCCESS,
  PURPLE,
  ORANGE,
  ERROR,
  BLUE_LIGHT,
];

const TOOLTIP_STYLE = {
  backgroundColor: "#0d1a35",
  border: "1px solid #1e3a6e",
  borderRadius: "10px",
  color: "#e8d48b",
  fontSize: 12,
  fontFamily: "Nunito, sans-serif",
};

const TICK_STYLE = {
  fill: "rgba(232,212,139,0.4)",
  fontSize: 11,
  fontFamily: "Nunito, sans-serif",
};

// ── Custom tooltip ─────────────────────────────────────────────
function CustomTooltip({active, payload, label, prefix = "৳"}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE} className="px-3 py-2 shadow-xl">
      <p className="font-bold text-primary text-xs mb-1">Day {label}</p>
      {payload.map((p) => (
        <p
          key={p.dataKey}
          style={{color: p.color}}
          className="text-xs font-semibold"
        >
          {p.name}: {prefix}
          {p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

function PieTooltip({active, payload}) {
  if (!active || !payload?.length) return null;
  const {name, value} = payload[0];
  return (
    <div style={TOOLTIP_STYLE} className="px-3 py-2 shadow-xl">
      <p className="font-bold text-primary text-xs">{name}</p>
      <p className="text-xs text-base-content font-semibold">
        ৳{value?.toLocaleString()}
      </p>
    </div>
  );
}

// ── 1. Daily Contributions vs Expenses (Area chart) ────────────
export function DailyOverviewChart({data}) {
  if (!data?.length) return <EmptyChart message="No daily data yet" />;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
        data={data}
        margin={{top: 10, right: 10, left: -10, bottom: 0}}
      >
        <defs>
          <linearGradient id="gradContrib" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={SUCCESS} stopOpacity={0.25} />
            <stop offset="95%" stopColor={SUCCESS} stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="gradSpent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={GOLD} stopOpacity={0.25} />
            <stop offset="95%" stopColor={GOLD} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(30,58,110,0.5)"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={TICK_STYLE}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `D${v}`}
        />
        <YAxis
          tick={TICK_STYLE}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
          width={45}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{
            fontSize: 11,
            color: "rgba(232,212,139,0.6)",
            fontFamily: "Nunito",
          }}
        />
        <Area
          type="monotone"
          dataKey="contributed"
          name="Contributed"
          stroke={SUCCESS}
          strokeWidth={2}
          fill="url(#gradContrib)"
          dot={false}
          activeDot={{r: 4, fill: SUCCESS}}
        />
        <Area
          type="monotone"
          dataKey="spent"
          name="Spent"
          stroke={GOLD}
          strokeWidth={2}
          fill="url(#gradSpent)"
          dot={false}
          activeDot={{r: 4, fill: GOLD}}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── 2. Category Breakdown (Donut) ──────────────────────────────
export function CategoryChart({data}) {
  if (!data?.length) return <EmptyChart message="No expenses yet" />;

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<PieTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {data.map((d, i) => {
          const pct = ((d.value / total) * 100).toFixed(2);
          return (
            <div key={d.name} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  background: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                }}
              />
              <span className="text-xs text-base-content/60 flex-1 truncate capitalize">
                {d.name}
              </span>
              <span className="text-xs font-bold text-base-content shrink-0">
                {pct}%
              </span>
              <span className="text-xs text-base-content/40 shrink-0">
                ৳{d.value.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 3. Per-member contributions (Horizontal bar) ───────────────
export function MemberContributionChart({data}) {
  if (!data?.length) return <EmptyChart message="No contributions yet" />;

  return (
    <ResponsiveContainer width="100%" height={Math.max(data.length * 44, 120)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{top: 4, right: 16, left: 4, bottom: 4}}
        barCategoryGap="30%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(30,58,110,0.5)"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={TICK_STYLE}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={TICK_STYLE}
          tickLine={false}
          axisLine={false}
          width={68}
        />
        <Tooltip
          content={({active, payload}) => {
            if (!active || !payload?.length) return null;
            return (
              <div style={TOOLTIP_STYLE} className="px-3 py-2">
                <p className="text-xs font-bold text-primary">
                  {payload[0]?.payload?.name}
                </p>
                <p className="text-xs text-success font-semibold">
                  ৳{payload[0]?.value?.toLocaleString()}
                </p>
              </div>
            );
          }}
        />
        <Bar
          dataKey="total"
          name="Contributed"
          radius={[0, 6, 6, 0]}
          maxBarSize={20}
        >
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={
                i === 0 ? GOLD : i === 1 ? GOLD_LIGHT : "rgba(201,168,76,0.45)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── 4. Daily attendance (Stacked bar) ─────────────────────────
export function DailyAttendanceChart({data}) {
  if (!data?.length) return <EmptyChart message="No attendance data yet" />;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        margin={{top: 10, right: 10, left: -10, bottom: 0}}
        barSize={14}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(30,58,110,0.5)"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={TICK_STYLE}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `D${v}`}
        />
        <YAxis
          tick={TICK_STYLE}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          content={({active, payload, label}) => {
            if (!active || !payload?.length) return null;
            return (
              <div style={TOOLTIP_STYLE} className="px-3 py-2">
                <p className="font-bold text-primary text-xs mb-1">
                  Day {label}
                </p>
                {payload.map((p) => (
                  <p
                    key={p.dataKey}
                    style={{color: p.color}}
                    className="text-xs font-semibold"
                  >
                    {p.name}: {p.value}
                  </p>
                ))}
              </div>
            );
          }}
        />
        <Legend
          wrapperStyle={{
            fontSize: 11,
            color: "rgba(232,212,139,0.6)",
            fontFamily: "Nunito",
          }}
        />
        <Bar
          dataKey="attending"
          name="Attending"
          stackId="a"
          fill={SUCCESS}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="absent"
          name="Absent"
          stackId="a"
          fill={ERROR}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Attendance rate list (not a chart, inline component) ───────
export function AttendanceRateList({data}) {
  if (!data?.length) return <EmptyChart message="No attendance data yet" />;

  return (
    <div className="flex flex-col gap-3">
      {data.map((m) => (
        <div key={m.name} className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              background: "linear-gradient(135deg, #1e3a6e, #0d1a35)",
              border: "1px solid rgba(201,168,76,0.25)",
              color: "#c9a84c",
            }}
          >
            {m.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-base-content truncate">
                {m.name}
              </span>
              <span
                className="text-xs font-bold ml-2 shrink-0"
                style={{
                  color: m.rate >= 80 ? SUCCESS : m.rate >= 50 ? GOLD : ERROR,
                }}
              >
                {m.rate}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className={
                  m.rate >= 80
                    ? "progress-green"
                    : m.rate >= 50
                      ? "progress-gold"
                      : "progress-red"
                }
                style={{width: `${m.rate}%`}}
              />
            </div>
          </div>
          <span className="text-xs text-base-content/35 shrink-0 w-16 text-right">
            {m.attended}d / {m.absent}d off
          </span>
        </div>
      ))}
    </div>
  );
}

function EmptyChart({message}) {
  return (
    <div className="flex items-center justify-center h-32 text-base-content/30 text-sm">
      {message}
    </div>
  );
}
