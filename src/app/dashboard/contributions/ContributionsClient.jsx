"use client";

import {useTransition} from "react";
import {Trash2, Loader2} from "lucide-react";
import {deleteContribution} from "@/actions/contribution";
import toast from "react-hot-toast";
import AddContributionModal from "./AddContributionModal";

export default function ContributionsClient({
  log,
  perMember,
  totalCollected,
  currentDay,
  isAdmin,
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id) => {
    startTransition(async () => {
      try {
        await deleteContribution(id);
        toast.success("Contribution removed.");
      } catch {
        toast.error("Failed to delete.");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base-content/40 text-sm mt-0.5">
            Total collected:{" "}
            <span className="text-primary font-bold text-base">
              ৳{totalCollected.toLocaleString()}
            </span>
          </p>
        </div>
        {isAdmin && (
          <AddContributionModal members={perMember} currentDay={currentDay} />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {perMember.map((m) => {
          const pct = Math.min((m.total / 600) * 100, 100);
          return (
            <div
              key={m.userId}
              className="card bg-base-200 border border-primary/15 shadow-md hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="card-body p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="avatar placeholder shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border flex justify-center items-center border-primary/20 text-center text-primary text-[11px] font-bold">
                      {m.avatar}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-base-content truncate">
                      {m.name}
                    </div>
                    <div className="text-[10px] text-base-content/40">
                      Room {m.room}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-2">
                  <span className="text-success font-bold text-lg">
                    ৳{m.total.toLocaleString()}
                  </span>
                  <span className="text-base-content/30 text-xs">
                    of ৳600 target
                  </span>
                </div>

                <progress
                  className={`progress w-full h-1.5 ${
                    m.total >= 600 ? "progress-success" : "progress-primary"
                  }`}
                  value={pct}
                  max={100}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="card bg-base-200 border border-primary/15 shadow-xl">
        <div className="card-body p-6">
          <h3 className="text-primary text-xs font-bold uppercase tracking-widest mb-4">
            Transaction Log
          </h3>

          {log.length === 0 ? (
            <div className="text-center py-10 text-base-content/30 text-sm">
              No contributions logged yet.
            </div>
          ) : (
            <div className="space-y-2">
              {log.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-content/5 hover:border-primary/15 transition-colors"
                >
                  <div className="avatar placeholder shrink-0">
                    <div className="w-9 flex justify-center items-center rounded-lg bg-success/10 border border-success/20 text-success text-[11px] font-bold">
                      <span>{c.avatar}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-base-content">
                      {c.name}
                    </div>
                    <div className="text-[10px] text-base-content/40">
                      Day {c.ramadanDay}
                      {c.note && (
                        <span className="ml-2 italic">
                          &ldquo;{c.note}&rdquo;
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-success font-bold text-sm shrink-0">
                    +৳{c.amount.toLocaleString()}
                  </span>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(c.id)}
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
