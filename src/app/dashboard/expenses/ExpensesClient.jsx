"use client";

import {useTransition, useState} from "react";
import {Trash2, Loader2, Filter} from "lucide-react";
import {deleteExpense} from "@/actions/expense";

import toast from "react-hot-toast";
import AddExpenseModal from "./AddExpenseModal";
import {EXPENSE_CATEGORIES} from "@/utils/constants";

const CATEGORY_COLORS = {
  Dates: "badge-warning",
  "Juice/Drinks": "badge-info",
  "Main Course": "badge-success",
  Fruits: "badge-success",
  Snacks: "badge-warning",
  Extras: "badge-ghost",
};

export default function ExpensesClient({
  log,
  totalSpent,
  members,
  currentDay,
  isAdmin,
}) {
  const [isPending, startTransition] = useTransition();
  const [filterDay, setFilterDay] = useState("all");
  const [filterCat, setFilterCat] = useState("all");

  const days = [...new Set(log.map((e) => e.ramadanDay))].sort((a, b) => b - a);

  const filtered = log.filter((e) => {
    const dayMatch = filterDay === "all" || e.ramadanDay === Number(filterDay);
    const catMatch = filterCat === "all" || e.category === filterCat;
    return dayMatch && catMatch;
  });

  const filteredTotal = filtered.reduce((s, e) => s + e.amount, 0);

  const handleDelete = (id) => {
    startTransition(async () => {
      try {
        await deleteExpense(id);
        toast.success("Expense removed.");
      } catch {
        toast.error("Failed to delete.");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <p className="text-base-content/40 text-sm">
          Total spent:{" "}
          <span className="text-primary font-bold text-base">
            ৳{totalSpent.toLocaleString()}
          </span>
        </p>
        {isAdmin && (
          <AddExpenseModal members={members} currentDay={currentDay} />
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {EXPENSE_CATEGORIES.map((cat) => {
          const catTotal = log
            .filter((e) => e.category === cat)
            .reduce((s, e) => s + e.amount, 0);
          return (
            <div
              key={cat}
              className="card bg-base-200 border border-primary/10 shadow cursor-pointer hover:-translate-y-1 transition-transform duration-200"
              onClick={() => setFilterCat(filterCat === cat ? "all" : cat)}
              style={
                filterCat === cat ? {borderColor: "rgba(201,168,76,0.4)"} : {}
              }
            >
              <div className="card-body p-4 text-center">
                <div className="text-primary font-bold text-lg">
                  ৳{catTotal.toLocaleString()}
                </div>
                <div className="text-base-content/40 text-[10px] font-bold uppercase tracking-wide">
                  {cat}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card bg-base-200 border border-primary/15 shadow-xl">
        <div className="card-body p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h3 className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Filter size={12} />
              Expense Log
              {(filterDay !== "all" || filterCat !== "all") && (
                <span className="text-base-content/40 normal-case font-normal text-xs">
                  — ৳{filteredTotal.toLocaleString()} showing
                </span>
              )}
            </h3>

            <div className="flex gap-2">
              <select
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                className="select select-bordered select-xs bg-base-300/60 border-secondary/40 text-xs"
              >
                <option value="all">All days</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    Day {d}
                  </option>
                ))}
              </select>

              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="select select-bordered select-xs bg-base-300/60 border-secondary/40 text-xs"
              >
                <option value="all">All categories</option>
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-10 text-base-content/30 text-sm">
              No expenses found.
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-content/5 hover:border-primary/15 transition-colors"
                >
                  <div className="avatar placeholder shrink-0">
                    <div className="w-9 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold">
                      <span>{e.paidByAvatar}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-base-content truncate">
                        {e.title}
                      </span>
                      <span
                        className={`badge badge-xs font-bold ${CATEGORY_COLORS[e.category] ?? "badge-ghost"}`}
                      >
                        {e.category}
                      </span>
                    </div>
                    <div className="text-[10px] text-base-content/40 mt-0.5">
                      Day {e.ramadanDay} · paid by {e.paidByName} ·{" "}
                      {e.attendeeCount} people · ৳{e.perHead}/head
                      {e.note && (
                        <span className="ml-1 italic">
                          &ldquo;{e.note}&rdquo;
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-error font-bold text-sm shrink-0">
                    ৳{e.amount.toLocaleString()}
                  </span>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(e.id)}
                      disabled={isPending}
                      className="btn btn-ghost btn-xs btn-circle text-error/50 hover:text-error hover:bg-error/10 shrink-0"
                      title="Delete"
                    >
                      {isPending ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
