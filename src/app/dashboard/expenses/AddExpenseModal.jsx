"use client";

import {useRef, useState, useTransition, useEffect} from "react";
import {X, Loader2, Plus, Users} from "lucide-react";
import {addExpense, getAttendeeCountForDay} from "@/actions/expense";

import toast from "react-hot-toast";
import {EXPENSE_CATEGORIES} from "@/utils/constants";

const RAMADAN_DAYS = Array.from({length: 30}, (_, i) => i + 1);

export default function AddExpenseModal({members, currentDay}) {
  const dialogRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [attendeeCount, setAttendeeCount] = useState(null);
  const [loadingCount, setLoadingCount] = useState(false);
  const [amount, setAmount] = useState("");
  const [isUniversal, setIsUniversal] = useState(false);

  // When universal: split by all members. When not: split by attending only.
  const splitCount = isUniversal ? members.length : attendeeCount;
  const perHead = amount && splitCount ? Number(amount) / splitCount : 0;

  const open = () => dialogRef.current?.showModal();
  const close = () => {
    dialogRef.current?.close();
    setAmount("");
    setIsUniversal(false);
  };

  useEffect(() => {
    let cancelled = false;
    setLoadingCount(true);
    getAttendeeCountForDay(selectedDay).then((count) => {
      if (!cancelled) {
        setAttendeeCount(count);
        setLoadingCount(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedDay]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set(
      "attendeeCount",
      String(isUniversal ? members.length : attendeeCount),
    );

    startTransition(async () => {
      try {
        await addExpense(formData);
        toast.success("Expense logged ✓");
        e.target.reset();
        setAmount("");
        close();
      } catch (err) {
        toast.error(err.message ?? "Failed to log expense.");
      }
    });
  };

  return (
    <>
      <button
        onClick={open}
        className="btn btn-primary btn-sm gap-2 rounded-xl font-bold"
      >
        <Plus size={15} /> Add Expense
      </button>

      <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-200 border border-primary/20 p-7 max-w-md relative overflow-hidden">
          <div
            className="absolute top-0 left-[10%] right-[10%] h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, #c9a84c, #f0d080, #c9a84c, transparent)",
            }}
          />

          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-base-content text-lg">Log Expense</h3>
            <button onClick={close} className="btn btn-ghost btn-xs btn-circle">
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <fieldset className="fieldset gap-1.5">
              <legend className="fieldset-legend text-base-content/50 text-[11px] font-bold tracking-[0.18em] uppercase">
                Item Title
              </legend>
              <input
                type="text"
                name="title"
                maxLength={100}
                placeholder="e.g. Chicken Biryani"
                required
                className="input input-bordered w-full bg-base-300/60 border-secondary/40 focus:border-primary/50 text-sm"
              />
            </fieldset>

            <div className="grid grid-cols-2 gap-3">
              <fieldset className="fieldset gap-1.5">
                <legend className="fieldset-legend text-base-content/50 text-[11px] font-bold tracking-[0.18em] uppercase">
                  Amount (৳)
                </legend>
                <label className="input input-bordered w-full bg-base-300/60 border-secondary/40 focus-within:border-primary/50 focus-within:shadow-[0_0_0_3px_rgba(201,168,76,0.1)] transition-all gap-2">
                  <span className="text-base-content/40 font-bold">৳</span>
                  <input
                    type="number"
                    name="amount"
                    min={1}
                    placeholder="500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="grow bg-transparent text-sm text-base-content placeholder:text-base-content/25 outline-none"
                  />
                </label>
              </fieldset>

              <fieldset className="fieldset gap-1.5">
                <legend className="fieldset-legend text-base-content/50 text-[11px] font-bold tracking-[0.18em] uppercase">
                  Ramadan Day
                </legend>
                <select
                  name="ramadanDay"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                  className="select select-bordered w-full bg-base-300/60 border-secondary/40 focus:border-primary/50 text-sm"
                >
                  {RAMADAN_DAYS.map((d) => (
                    <option key={d} value={d}>
                      Day {d} {d === currentDay ? "(today)" : ""}
                    </option>
                  ))}
                </select>
              </fieldset>
            </div>

            <fieldset className="fieldset gap-1.5">
              <legend className="fieldset-legend text-base-content/50 text-[11px] font-bold tracking-[0.18em] uppercase">
                Category
              </legend>
              <select
                name="category"
                required
                className="select select-bordered w-full bg-base-300/60 border-secondary/40 focus:border-primary/50 text-sm"
              >
                <option value="">Select category</option>
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset gap-1.5">
              <legend className="fieldset-legend text-base-content/50 text-[11px] font-bold tracking-[0.18em] uppercase">
                Paid By
              </legend>
              <select
                name="paidByUserId"
                required
                className="select select-bordered w-full bg-base-300/60 border-secondary/40 focus:border-primary/50 text-sm"
              >
                <option value="">Select member</option>
                {members.map((m) => (
                  <option key={m._id.toString()} value={m._id.toString()}>
                    {m.name}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* Attendance / split preview */}
            <div
              className="rounded-xl p-3 border border-primary/15 flex items-center gap-3"
              style={{background: "rgba(201,168,76,0.05)"}}
            >
              <Users size={14} className="text-primary shrink-0" />
              <div className="flex-1 text-sm text-base-content/70">
                {loadingCount ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin" /> Fetching
                    attendance…
                  </span>
                ) : isUniversal ? (
                  <>
                    Split among{" "}
                    <span className="text-primary font-bold">
                      all {members.length} members
                    </span>
                    {perHead > 0 && (
                      <span className="ml-2 text-base-content/40">
                        → ৳{perHead.toFixed(2)}/head
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-primary font-bold">
                      {attendeeCount}
                    </span>{" "}
                    attending on Day {selectedDay}
                    {perHead > 0 && (
                      <span className="ml-2 text-base-content/40">
                        → ৳{perHead}/head
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Universal toggle */}
            <div
              className="rounded-xl p-3 border border-secondary/30 flex items-center justify-between gap-3"
              style={{background: "rgba(13,26,53,0.4)"}}
            >
              <div>
                <p className="text-sm font-bold text-base-content">
                  Universal Item
                </p>
                <p className="text-[11px] text-base-content/40 mt-0.5">
                  Split among <strong>all members</strong> regardless of
                  attendance (e.g. dates, water)
                </p>
              </div>
              <input
                type="hidden"
                name="universal"
                value={isUniversal ? "true" : "false"}
              />
              <input
                type="checkbox"
                className="toggle toggle-primary toggle-sm"
                checked={isUniversal}
                onChange={(e) => setIsUniversal(e.target.checked)}
              />
            </div>

            <fieldset className="fieldset gap-1.5">
              <legend className="fieldset-legend text-base-content/50 text-[11px] font-bold tracking-[0.18em] uppercase">
                Note (optional)
              </legend>
              <input
                type="text"
                name="note"
                maxLength={300}
                placeholder="Any extra detail"
                className="input input-bordered w-full bg-base-300/60 border-secondary/40 focus:border-primary/50 text-sm"
              />
            </fieldset>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={close}
                className="btn btn-ghost flex-1 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isPending || loadingCount || (!isUniversal && !attendeeCount)
                }
                className="btn btn-primary flex-1 rounded-xl font-bold gap-2"
              >
                {isPending && <Loader2 size={15} className="animate-spin" />}
                {isPending ? "Logging..." : "Log Expense"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
