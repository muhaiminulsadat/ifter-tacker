"use client";

import {useRef, useState, useTransition} from "react";
import {X, Loader2, Plus} from "lucide-react";
import {addContribution} from "@/actions/contribution";
import toast from "react-hot-toast";

const RAMADAN_DAYS = Array.from({length: 30}, (_, i) => i + 1);

export default function AddContributionModal({members, currentDay}) {
  const dialogRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState("");
  const [selectedDay, setSelectedDay] = useState(currentDay);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    startTransition(async () => {
      try {
        await addContribution(formData);
        toast.success("Contribution logged ✓");
        e.target.reset();
        setAmount("");
        setSelectedDay(currentDay);
        close();
      } catch (err) {
        toast.error(err.message ?? "Failed to log contribution.");
      }
    });
  };

  return (
    <>
      <button
        onClick={open}
        className="btn btn-primary btn-sm gap-2 rounded-xl font-bold"
      >
        <Plus size={15} /> Add Contribution
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
            <h3 className="font-bold text-base-content text-lg">
              Log Contribution
            </h3>
            <button onClick={close} className="btn btn-ghost btn-xs btn-circle">
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <fieldset className="fieldset gap-1.5">
              <legend className="fieldset-legend text-base-content/50 text-[11px] font-bold tracking-[0.18em] uppercase">
                Member
              </legend>
              <select
                name="userId"
                required
                className="select select-bordered w-full bg-base-300/60 border-secondary/40 focus:border-primary/50 text-sm space-y-2"
              >
                <option
                  value=""
                  disabled
                  className="bg-base-100 border border-primary"
                >
                  Select member
                </option>
                {members.map((m) => (
                  <option
                    key={m.userId}
                    value={m.userId}
                    className="bg-base-100 border border-primary hover:bg-primary hover:text-base-100"
                  >
                    {m.name} — Room {m.room}
                  </option>
                ))}
              </select>
            </fieldset>

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
                className="select select-bordered w-full bg-base-300/60 border-secondary/40 focus:border-primary/50 text-sm "
              >
                {RAMADAN_DAYS.map((d) => (
                  <option
                    key={d}
                    value={d}
                    className="bg-base-100 border border-primary hover:bg-primary hover:text-base-100"
                  >
                    Day {d} {d === currentDay ? "(today)" : ""}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset gap-1.5">
              <legend className="fieldset-legend text-base-content/50 text-[11px] font-bold tracking-[0.18em] uppercase">
                Note (optional)
              </legend>
              <input
                type="text"
                name="note"
                maxLength={200}
                placeholder="e.g. Advance for Day 15-20"
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
                disabled={isPending}
                className="btn btn-primary flex-1 rounded-xl font-bold gap-2"
              >
                {isPending && <Loader2 size={15} className="animate-spin" />}
                {isPending ? "Logging..." : "Log Contribution"}
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
