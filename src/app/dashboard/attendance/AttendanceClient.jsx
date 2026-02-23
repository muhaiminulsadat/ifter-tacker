"use client";

import {useState, useTransition} from "react";
import {CheckCircle, XCircle, Loader2} from "lucide-react";
import {markAttendance, markMyAttendance} from "@/actions/attendance";
import toast from "react-hot-toast";
import ShoppersView from "./ShoppersView";

const STATUS_BADGE = {
  attending: "badge-success",
  absent: "badge-error",
};

export default function AttendanceClient({
  members,
  ramadanDay,
  currentUserId,
  isAdmin,
  onRefresh,
}) {
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState(null);
  const [reason, setReason] = useState("");
  const [showReasonFor, setShowReasonFor] = useState(null);

  const handleMark = (userId, status, reasonText = "") => {
    setLoadingId(userId);
    startTransition(async () => {
      try {
        if (userId === currentUserId) {
          await markMyAttendance(ramadanDay, status, reasonText);
        } else {
          await markAttendance(userId, ramadanDay, status, reasonText);
        }
        toast.success(
          status === "attending" ? "Marked as attending ✓" : "Marked as absent",
        );
        onRefresh?.();
      } catch {
        toast.error("Failed to update. Try again.");
      } finally {
        setLoadingId(null);
        setShowReasonFor(null);
        setReason("");
      }
    });
  };

  const myRecord = members.find((m) => m.userId === currentUserId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {myRecord && (
            <div className="card bg-base-200 border border-primary/20 shadow-xl">
              <div className="card-body p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <h3 className="text-primary text-xs font-bold uppercase tracking-widest">
                    Your Attendance — Day {ramadanDay}
                  </h3>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleMark(currentUserId, "attending")}
                    disabled={isPending && loadingId === currentUserId}
                    className={`btn flex-1 gap-2 rounded-xl font-bold ${
                      myRecord.status === "attending"
                        ? "btn-success"
                        : "btn-outline border-success/30 text-success hover:btn-success"
                    }`}
                  >
                    {isPending && loadingId === currentUserId ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <CheckCircle size={15} />
                    )}
                    I&apos;m Attending
                  </button>

                  <button
                    onClick={() => setShowReasonFor(currentUserId)}
                    disabled={isPending && loadingId === currentUserId}
                    className={`btn flex-1 gap-2 rounded-xl font-bold hover:text-blue-950 ${
                      myRecord.status === "absent"
                        ? "btn-error"
                        : "btn-outline border-error/30 text-error hover:btn-error"
                    }`}
                  >
                    <XCircle size={15} />
                    I&apos;m Absent
                  </button>
                </div>

                {showReasonFor === currentUserId && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Reason (optional, max 200 chars)"
                      maxLength={200}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="input input-bordered input-sm flex-1 bg-base-300/60 border-secondary/40 focus:border-primary/50 text-sm"
                    />
                    <button
                      onClick={() =>
                        handleMark(currentUserId, "absent", reason)
                      }
                      className="btn btn-error btn-sm rounded-xl"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setShowReasonFor(null);
                        setReason("");
                      }}
                      className="btn btn-ghost btn-sm rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="card bg-base-200 border border-primary/15 shadow-xl">
            <div className="card-body p-6">
              <h3 className="text-primary text-xs font-bold uppercase tracking-widest mb-4">
                All Members — Day {ramadanDay}
              </h3>

              <div className="space-y-2">
                {members.map((m) => (
                  <div key={m.userId}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-content/5 hover:border-primary/15 transition-colors">
                      <div className="avatar placeholder shrink-0">
                        <div className="w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold">
                          <span>{m.avatar}</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-base-content truncate">
                          {m.name}
                        </div>
                        <div className="text-[10px] text-base-content/40">
                          Room {m.room}
                          {m.reason && (
                            <span className="ml-2 italic">
                              &ldquo;{m.reason}&rdquo;
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        className={`badge badge-sm font-bold ${STATUS_BADGE[m.status]}`}
                      >
                        {m.status}
                      </div>

                      {isAdmin && m.userId !== currentUserId && (
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => handleMark(m.userId, "attending")}
                            disabled={isPending && loadingId === m.userId}
                            className="btn btn-xs btn-ghost btn-circle text-success hover:bg-success/15"
                            title="Mark attending"
                          >
                            {isPending && loadingId === m.userId ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <CheckCircle size={20} />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setShowReasonFor(m.userId);
                              setReason("");
                            }}
                            disabled={isPending && loadingId === m.userId}
                            className="btn btn-xs btn-ghost btn-circle text-error hover:bg-error/15"
                            title="Mark absent"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      )}
                    </div>

                    {showReasonFor === m.userId &&
                      m.userId !== currentUserId && (
                        <div className="mt-1 mb-1 flex gap-2 px-2">
                          <input
                            type="text"
                            placeholder="Reason (optional, max 200 chars)"
                            maxLength={200}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="input input-bordered input-sm flex-1 bg-base-300/60 border-secondary/40 text-sm"
                          />
                          <button
                            onClick={() =>
                              handleMark(m.userId, "absent", reason)
                            }
                            className="btn btn-error btn-sm rounded-xl"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => {
                              setShowReasonFor(null);
                              setReason("");
                            }}
                            className="btn btn-ghost btn-sm rounded-xl"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <ShoppersView members={members} ramadanDay={ramadanDay} />
        </div>
      </div>
    </div>
  );
}
