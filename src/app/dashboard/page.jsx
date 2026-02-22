import {getDashboard} from "@/actions/dashboard";
import Link from "next/link";
import {
  Wallet,
  ShoppingCart,
  Scale,
  Users,
  CalendarCheck,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Megaphone,
  Pin,
  Moon,
} from "lucide-react";

const CURRENT_RAMADAN_DAY = 1;

export const metadata = {
  title: "Dashboard · Noor",
};

function Avatar({label, size = "md"}) {
  const dim =
    size === "sm"
      ? "w-7 h-7 text-xs"
      : size === "lg"
        ? "w-11 h-11 text-base"
        : "w-9 h-9 text-sm";
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-bold shrink-0`}
      style={{
        background: "linear-gradient(135deg, #1e3a6e, #0d1a35)",
        border: "1px solid rgba(201,168,76,0.25)",
        color: "#c9a84c",
      }}
    >
      {label}
    </div>
  );
}

function SectionHeader({icon, title, href, linkLabel}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-bold text-base text-base-content">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors font-semibold"
        >
          {linkLabel ?? "View all"}
          <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}

function Card({children, className = ""}) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{background: "#0d1a35", border: "1px solid #1e3a6e"}}
    >
      {children}
    </div>
  );
}

export default async function DashboardPage() {
  const {
    user,
    stats,
    todayAttendanceList,
    recentContributions,
    recentExpenses,
    pendingTransactions,
    currentUserBalance,
    announcements,
  } = await getDashboard(CURRENT_RAMADAN_DAY);

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-4 md:p-8 fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Moon
              size={18}
              color="#c9a84c"
              fill="#c9a84c"
              className="crescent"
            />
            <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">
              Day {CURRENT_RAMADAN_DAY} of Ramadan
            </span>
          </div>
          <h1 className="font-amiri text-3xl font-bold">
            Assalamu Alaikum, {user.name.split(" ")[0]} 🌙
          </h1>
          <p className="text-base-content/40 text-sm mt-0.5">
            Here&apos;s how the iftar group is doing today
          </p>
        </div>
        {user.role === "admin" && (
          <span className="tag-admin self-start sm:self-center">Admin</span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <StatCard
          label="Collected"
          value={`৳${stats.totalContributed.toLocaleString()}`}
          icon={<Wallet size={14} color="#4ade80" />}
          color="text-success"
          bg="bg-success/8 border-success/20"
        />
        <StatCard
          label="Spent"
          value={`৳${stats.totalSpent.toLocaleString()}`}
          icon={<ShoppingCart size={14} color="#c9a84c" />}
          color="text-primary"
          bg="bg-primary/8 border-primary/20"
        />
        <StatCard
          label={stats.surplus >= 0 ? "Surplus" : "Deficit"}
          value={`৳${Math.abs(stats.surplus).toLocaleString()}`}
          icon={
            <Scale
              size={14}
              color={stats.surplus >= 0 ? "#4ade80" : "#f87171"}
            />
          }
          color={stats.surplus >= 0 ? "text-success" : "text-error"}
          bg={
            stats.surplus >= 0
              ? "bg-success/8 border-success/20"
              : "bg-error/8 border-error/20"
          }
        />
        <StatCard
          label="Members"
          value={stats.totalMembers}
          icon={<Users size={14} color="#60a5fa" />}
          color="text-info"
          bg="bg-info/8 border-info/20"
        />
        <StatCard
          label="Today"
          value={`${stats.attendingToday} attending`}
          icon={<CalendarCheck size={14} color="#c084fc" />}
          color="text-purple-400"
          bg="bg-purple-500/8 border-purple-500/20"
        />
        <StatCard
          label="Settlements"
          value={
            stats.pendingSettlements === 0
              ? "All clear"
              : `${stats.pendingSettlements} pending`
          }
          icon={
            <Scale
              size={14}
              color={stats.pendingSettlements === 0 ? "#4ade80" : "#facc15"}
            />
          }
          color={
            stats.pendingSettlements === 0 ? "text-success" : "text-warning"
          }
          bg={
            stats.pendingSettlements === 0
              ? "bg-success/8 border-success/20"
              : "bg-warning/8 border-warning/20"
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <MyBalanceCard balance={currentUserBalance} />

        <Card className="lg:col-span-2">
          <SectionHeader
            icon={<CalendarCheck size={15} color="#c084fc" />}
            title={`Today's Attendance — Day ${CURRENT_RAMADAN_DAY}`}
            href="/dashboard/attendance"
          />
          <div className="flex flex-wrap gap-2">
            {todayAttendanceList.map((m) => (
              <div key={m.userId} className="flex items-center gap-1.5">
                <Avatar label={m.avatar} size="sm" />
                <span
                  className={`text-xs font-semibold ${
                    m.status === "absent"
                      ? "text-error/70"
                      : "text-base-content/70"
                  }`}
                >
                  {m.name.split(" ")[0]}
                </span>
                <span
                  className={
                    m.status === "absent" ? "tag-absent" : "tag-attending"
                  }
                  style={{fontSize: 9, padding: "2px 6px"}}
                >
                  {m.status === "absent" ? "out" : "in"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <Card>
          <SectionHeader
            icon={<Wallet size={15} color="#4ade80" />}
            title="Recent Contributions"
            href="/dashboard/contributions"
          />
          <div className="flex flex-col gap-3">
            {recentContributions.length === 0 ? (
              <p className="text-base-content/30 text-sm">
                No contributions yet
              </p>
            ) : (
              recentContributions.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 row-hover p-1 rounded-xl"
                >
                  <Avatar label={c.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-base-content truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-base-content/35">
                      Day {c.ramadanDay}
                    </p>
                  </div>
                  <span className="text-success font-bold text-sm shrink-0">
                    +৳{c.amount.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <SectionHeader
            icon={<ShoppingCart size={15} color="#c9a84c" />}
            title="Recent Expenses"
            href="/dashboard/expenses"
          />
          <div className="flex flex-col gap-3">
            {recentExpenses.length === 0 ? (
              <p className="text-base-content/30 text-sm">No expenses yet</p>
            ) : (
              recentExpenses.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-3 row-hover p-1 rounded-xl"
                >
                  <Avatar label={e.paidByAvatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-base-content truncate">
                      {e.title}
                    </p>
                    <p className="text-xs text-base-content/35 capitalize">
                      {e.category} · Day {e.ramadanDay}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-primary font-bold text-sm">
                      ৳{e.amount.toLocaleString()}
                    </p>
                    <p className="text-base-content/35 text-xs">
                      ৳{e.perHead}/head
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <SectionHeader
            icon={<Scale size={15} color="#f0d080" />}
            title="Settlement Snapshot"
            href="/dashboard/settlement"
          />
          {pendingTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(74,222,128,0.1)",
                  border: "1px solid rgba(74,222,128,0.2)",
                }}
              >
                <Scale size={18} color="#4ade80" />
              </div>
              <p className="text-success font-bold text-sm">All settled up!</p>
              <p className="text-base-content/35 text-xs">No payments needed</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingTransactions.slice(0, 4).map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 row-hover p-1 rounded-xl"
                >
                  <Avatar label={t.fromAvatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-base-content truncate">
                      {t.fromName}
                    </p>
                    <p className="text-xs text-base-content/35 truncate">
                      → {t.toName}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold shrink-0"
                    style={{color: "#f0d080"}}
                  >
                    ৳{t.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              {pendingTransactions.length > 4 && (
                <Link
                  href="/dashboard/settlement"
                  className="text-xs text-primary/60 hover:text-primary text-center pt-1"
                >
                  +{pendingTransactions.length - 4} more transactions
                </Link>
              )}
            </div>
          )}
        </Card>
      </div>

      {announcements.length > 0 && (
        <Card>
          <SectionHeader
            icon={<Megaphone size={15} color="#fb923c" />}
            title="Announcements"
            href="/dashboard/announcements"
          />
          <div className="flex flex-col gap-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="rounded-xl p-4"
                style={{
                  background: a.pinned
                    ? "rgba(201,168,76,0.06)"
                    : "rgba(30,58,110,0.3)",
                  border: a.pinned
                    ? "1px solid rgba(201,168,76,0.2)"
                    : "1px solid rgba(30,58,110,0.6)",
                }}
              >
                <div className="flex items-start gap-2 mb-1">
                  {a.pinned && (
                    <Pin
                      size={12}
                      color="#c9a84c"
                      className="mt-0.5 shrink-0"
                    />
                  )}
                  <p className="text-sm font-bold text-base-content">
                    {a.title}
                  </p>
                </div>
                <p className="text-xs text-base-content/50 leading-relaxed">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function StatCard({label, value, icon, color, bg}) {
  return (
    <div className={`rounded-2xl p-4 border flex flex-col gap-1.5 ${bg}`}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs text-base-content/45 font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className={`font-amiri font-bold text-xl leading-tight ${color}`}>
        {value}
      </p>
    </div>
  );
}

function MyBalanceCard({balance}) {
  if (!balance) return null;

  const isPositive = balance.balance > 0;
  const isNeutral = balance.balance === 0;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: isNeutral
          ? "#0d1a35"
          : isPositive
            ? "linear-gradient(135deg, rgba(74,222,128,0.08), #0d1a35)"
            : "linear-gradient(135deg, rgba(248,113,113,0.08), #0d1a35)",
        border: isNeutral
          ? "1px solid #1e3a6e"
          : isPositive
            ? "1px solid rgba(74,222,128,0.25)"
            : "1px solid rgba(248,113,113,0.25)",
      }}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-base-content/40 mb-3">
        Your Balance
      </p>

      <div className="flex items-center gap-3 mb-4">
        <Avatar label={balance.avatar} size="lg" />
        <div>
          <p className="font-bold text-base-content">{balance.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            {isNeutral ? (
              <Minus size={14} color="rgba(232,212,139,0.4)" />
            ) : isPositive ? (
              <TrendingUp size={14} color="#4ade80" />
            ) : (
              <TrendingDown size={14} color="#f87171" />
            )}
            <span
              className="font-amiri font-bold text-2xl"
              style={{
                color: isNeutral
                  ? "rgba(232,212,139,0.4)"
                  : isPositive
                    ? "#4ade80"
                    : "#f87171",
              }}
            >
              {isPositive ? "+" : ""}৳{balance.balance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-base-content/35 leading-relaxed">
        {isNeutral
          ? "You're perfectly even — nothing to pay or collect."
          : isPositive
            ? "You've overpaid. You're owed a refund at settlement."
            : "You've underpaid. You'll need to transfer at settlement."}
      </p>
    </div>
  );
}
