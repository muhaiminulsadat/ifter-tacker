import {getReports} from "@/actions/reports";
import {
  DailyOverviewChart,
  CategoryChart,
  MemberContributionChart,
  DailyAttendanceChart,
  AttendanceRateList,
} from "@/components/reports/ReportsCharts";
import {
  BarChart2,
  TrendingUp,
  ShoppingCart,
  Users,
  CalendarCheck,
  Wallet,
  Scale,
  Star,
} from "lucide-react";

export const metadata = {
  title: "Reports · Noor",
};

export default async function ReportsPage() {
  const {
    dailyOverview,
    categoryBreakdown,
    memberContributions,
    memberAttendance,
    dailyAttendance,
    stats,
  } = await getReports();

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-4 md:p-8 fade-up">
      {/* ── Page header ── */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(96,165,250,0.10)",
            border: "1px solid rgba(96,165,250,0.20)",
          }}
        >
          <BarChart2 size={20} color="#60a5fa" />
        </div>
        <div>
          <h1 className="font-amiri text-2xl font-bold text-base-content">
            Reports
          </h1>
          <p className="text-base-content/45 text-sm">
            Full Ramadan summary — contributions, expenses & attendance
          </p>
        </div>
      </div>

      {/* ── Top-line stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <StatCard
          icon={<Wallet size={15} color="#4ade80" />}
          label="Collected"
          value={`৳${stats.totalContributed.toLocaleString()}`}
          color="text-success"
          bg="bg-success/8 border-success/20"
        />
        <StatCard
          icon={<ShoppingCart size={15} color="#c9a84c" />}
          label="Spent"
          value={`৳${stats.totalSpent.toLocaleString()}`}
          color="text-primary"
          bg="bg-primary/8 border-primary/20"
        />
        <StatCard
          icon={
            <Scale
              size={15}
              color={stats.surplus >= 0 ? "#4ade80" : "#f87171"}
            />
          }
          label="Surplus"
          value={`৳${Math.abs(stats.surplus).toLocaleString()}`}
          color={stats.surplus >= 0 ? "text-success" : "text-error"}
          bg={
            stats.surplus >= 0
              ? "bg-success/8 border-success/20"
              : "bg-error/8 border-error/20"
          }
        />
        <StatCard
          icon={<TrendingUp size={15} color="#f0d080" />}
          label="Avg/Day"
          value={`৳${stats.avgDailySpend.toLocaleString()}`}
          color="text-accent"
          bg="bg-accent/8 border-accent/20"
        />
        <StatCard
          icon={<Star size={15} color="#fb923c" />}
          label="Expenses"
          value={stats.totalExpenseCount}
          color="text-orange-400"
          bg="bg-orange-500/8 border-orange-500/20"
        />
        <StatCard
          icon={<CalendarCheck size={15} color="#c084fc" />}
          label="Days Tracked"
          value={stats.daysTracked}
          color="text-purple-400"
          bg="bg-purple-500/8 border-purple-500/20"
        />
      </div>

      {/* ── Charts grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard
          className="lg:col-span-3"
          icon={<TrendingUp size={16} color="#4ade80" />}
          title="Daily Contributions vs Expenses"
          subtitle="Taka collected and spent per Ramadan day"
        >
          <DailyOverviewChart data={dailyOverview} />
        </ChartCard>

        {/* Category Breakdown */}
        <ChartCard
          icon={<ShoppingCart size={16} color="#c9a84c" />}
          title="Expense Categories"
          subtitle="Where the money went"
        >
          <CategoryChart data={categoryBreakdown} />
        </ChartCard>

        {/* Member Contributions */}
        <ChartCard
          icon={<Wallet size={16} color="#f0d080" />}
          title="Contributions by Member"
          subtitle="Total taka contributed per person"
        >
          <MemberContributionChart data={memberContributions} />
        </ChartCard>

        {/* Attendance Rates */}
        <ChartCard
          icon={<Users size={16} color="#60a5fa" />}
          title="Attendance Rate"
          subtitle="How often each member attended"
        >
          <AttendanceRateList data={memberAttendance} />
        </ChartCard>

        {/* Daily Attendance — full width */}
        <ChartCard
          className="lg:col-span-3"
          icon={<CalendarCheck size={16} color="#c084fc" />}
          title="Daily Attendance"
          subtitle="Attending vs absent count per day"
        >
          <DailyAttendanceChart data={dailyAttendance} />
        </ChartCard>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function StatCard({icon, label, value, color, bg}) {
  return (
    <div className={`rounded-2xl p-4 border flex flex-col gap-1.5 ${bg}`}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs text-base-content/45 font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className={`font-amiri font-bold text-2xl leading-none ${color}`}>
        {value}
      </p>
    </div>
  );
}

function ChartCard({icon, title, subtitle, children, className = ""}) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{background: "#0d1a35", border: "1px solid #1e3a6e"}}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h3 className="font-bold text-sm text-base-content">{title}</h3>
      </div>
      <p className="text-xs text-base-content/35 mb-5">{subtitle}</p>
      {children}
    </div>
  );
}
