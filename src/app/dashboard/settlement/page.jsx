import {getSettlement} from "@/actions/settlement";
import {
  Scale,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  CircleCheck,
} from "lucide-react";

export const metadata = {
  title: "Settlement · Noor",
};

function Avatar({label, size = "md"}) {
  const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
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

function BalanceBadge({balance}) {
  if (balance > 0)
    return (
      <span className="flex items-center gap-1 text-success font-bold text-sm">
        <TrendingUp size={14} />
        +৳{balance}
      </span>
    );
  if (balance < 0)
    return (
      <span className="flex items-center gap-1 text-error font-bold text-sm">
        <TrendingDown size={14} />
        -৳{Math.abs(balance)}
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-base-content/40 font-bold text-sm">
      <Minus size={14} />
      ৳0
    </span>
  );
}

export default async function SettlementPage() {
  const {summary, transactions, totalContributed, totalExpenses, surplus} =
    await getSettlement();

  const isSettled = transactions.length === 0;

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-4 md:p-8 fade-up">
      {/* ── Page header ── */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(240,208,128,0.10)",
            border: "1px solid rgba(240,208,128,0.20)",
          }}
        >
          <Scale size={20} color="#f0d080" />
        </div>
        <div>
          <h1 className="font-amiri text-2xl font-bold text-base-content">
            Settlement
          </h1>
          <p className="text-base-content/45 text-sm">
            Who owes whom — calculated automatically
          </p>
        </div>
      </div>

      {/* ── Pool summary cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SummaryCard
          label="Total Collected"
          value={`৳${totalContributed.toLocaleString()}`}
          color="text-success"
          bg="bg-success/8 border-success/20"
        />
        <SummaryCard
          label="Total Spent"
          value={`৳${totalExpenses.toLocaleString()}`}
          color="text-error"
          bg="bg-error/8 border-error/20"
        />
        <SummaryCard
          label={surplus >= 0 ? "Surplus" : "Deficit"}
          value={`৳${Math.abs(surplus).toLocaleString()}`}
          color={surplus >= 0 ? "text-primary" : "text-warning"}
          bg={
            surplus >= 0
              ? "bg-primary/8 border-primary/20"
              : "bg-warning/8 border-warning/20"
          }
        />
      </div>

      {/* ── Transactions ── */}
      <div className="mb-8">
        <h2 className="font-bold text-base-content text-base mb-4 flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{background: "#c9a84c"}}
          />
          Required Payments
        </h2>

        {isSettled ? (
          <div
            className="rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3"
            style={{
              background: "#0d1a35",
              border: "1px solid rgba(74,222,128,0.25)",
            }}
          >
            <CircleCheck size={40} color="#4ade80" strokeWidth={1.5} />
            <p className="font-bold text-success text-lg">All settled up!</p>
            <p className="text-base-content/45 text-sm">
              Everyone's contributions match their expense shares perfectly.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.map((t, i) => (
              <TransactionCard key={i} transaction={t} />
            ))}
          </div>
        )}
      </div>

      {/* ── Per-member breakdown ── */}
      <div>
        <h2 className="font-bold text-base-content text-base mb-4 flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{background: "#1e3a6e"}}
          />
          Member Breakdown
        </h2>

        <div
          className="rounded-2xl overflow-hidden"
          style={{background: "#0d1a35", border: "1px solid #1e3a6e"}}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-4 px-4 py-3 text-xs font-bold text-base-content/40 uppercase tracking-wider"
            style={{borderBottom: "1px solid #1e3a6e"}}
          >
            <span>Member</span>
            <span className="text-right">Contributed</span>
            <span className="text-right">Share</span>
            <span className="text-right">Balance</span>
          </div>

          {summary.length === 0 ? (
            <div className="p-8 text-center text-base-content/30 text-sm">
              No data yet
            </div>
          ) : (
            summary
              .sort((a, b) => b.balance - a.balance)
              .map((m, i) => (
                <MemberRow
                  key={m.userId}
                  member={m}
                  isLast={i === summary.length - 1}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function SummaryCard({label, value, color, bg}) {
  return (
    <div
      className={`rounded-2xl p-5 border ${bg}`}
      style={{background: "transparent"}}
    >
      <p className="text-base-content/45 text-xs font-semibold uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`font-amiri font-bold text-3xl ${color}`}>{value}</p>
    </div>
  );
}

function TransactionCard({transaction}) {
  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-4"
      style={{background: "#0d1a35", border: "1px solid #1e3a6e"}}
    >
      {/* From */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <Avatar label={transaction.fromAvatar} />
        <div className="min-w-0">
          <p className="font-bold text-sm text-base-content truncate">
            {transaction.fromName}
          </p>
          <p className="text-error text-xs font-semibold">pays</p>
        </div>
      </div>

      {/* Amount pill */}
      <div
        className="shrink-0 px-4 py-2 rounded-xl flex items-center gap-2"
        style={{
          background:
            "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.06))",
          border: "1px solid rgba(201,168,76,0.3)",
        }}
      >
        <ArrowRight size={14} color="#c9a84c" />
        <span className="font-amiri font-bold text-primary text-base">
          ৳{transaction.amount.toLocaleString()}
        </span>
      </div>

      {/* To */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
        <div className="min-w-0 text-right">
          <p className="font-bold text-sm text-base-content truncate">
            {transaction.toName}
          </p>
          <p className="text-success text-xs font-semibold">receives</p>
        </div>
        <Avatar label={transaction.toAvatar} />
      </div>
    </div>
  );
}

function MemberRow({member, isLast}) {
  const {name, room, avatar, contributed, expenseShare, balance} = member;

  return (
    <div
      className="row-hover grid grid-cols-4 items-center px-4 py-3.5"
      style={!isLast ? {borderBottom: "1px solid rgba(30,58,110,0.5)"} : {}}
    >
      {/* Member info */}
      <div className="flex items-center gap-3 min-w-0">
        <Avatar label={avatar} size="sm" />
        <div className="min-w-0">
          <p className="font-semibold text-sm text-base-content truncate">
            {name}
          </p>
          {room ? <p className="text-base-content/35 text-xs">{room}</p> : null}
        </div>
      </div>

      {/* Contributed */}
      <p className="text-right font-semibold text-sm text-success">
        ৳{contributed.toLocaleString()}
      </p>

      {/* Expense share */}
      <p className="text-right font-semibold text-sm text-base-content/60">
        ৳{expenseShare.toLocaleString()}
      </p>

      {/* Balance */}
      <div className="flex justify-end">
        <BalanceBadge balance={balance} />
      </div>
    </div>
  );
}
