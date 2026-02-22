"use client";

import {ShoppingCart, Users, UserX} from "lucide-react";

export default function ShoppersView({members, ramadanDay}) {
  const attending = members.filter((m) => m.status === "attending");
  const absent = members.filter((m) => m.status === "absent");
  const estimatedBudget = attending.length * 150;

  return (
    <div className="card bg-base-200 border border-primary/20 shadow-xl overflow-hidden">
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, #c9a84c, #f0d080, #c9a84c, transparent)",
        }}
      />

      <div className="card-body p-6">
        <div className="flex items-center gap-2 mb-5">
          <ShoppingCart size={16} className="text-primary" />
          <h3 className="text-primary text-xs font-bold uppercase tracking-widest">
            Shopper&apos;s View — Day {ramadanDay}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl p-4 text-center bg-success/8 border border-success/20">
            <div className="font-amiri text-3xl font-bold text-success leading-none mb-1">
              {attending.length}
            </div>
            <div className="text-success text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-1">
              <Users size={9} /> Attending
            </div>
          </div>

          <div className="rounded-xl p-4 text-center bg-error/8 border border-error/20">
            <div className="font-amiri text-3xl font-bold text-error leading-none mb-1">
              {absent.length}
            </div>
            <div className="text-error text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-1">
              <UserX size={9} /> Absent
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-4 mb-4 border border-primary/20"
          style={{background: "rgba(201,168,76,0.06)"}}
        >
          <div className="text-primary text-xs font-bold mb-1">Shop for</div>
          <div className="font-amiri text-4xl font-bold text-primary leading-none">
            {attending.length} persons
          </div>
          <div className="text-base-content/30 text-xs mt-1.5">
            Est. budget ৳{estimatedBudget}
          </div>
        </div>

        {attending.length > 0 && (
          <div>
            <div className="text-base-content/30 text-[10px] font-bold uppercase tracking-widest mb-2">
              Confirmed
            </div>
            <div className="flex flex-wrap gap-1.5">
              {attending.map((m) => (
                <span key={m.userId} className="tag-attending">
                  {m.name.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>
        )}

        {absent.length > 0 && (
          <div className="mt-3">
            <div className="text-base-content/30 text-[10px] font-bold uppercase tracking-widest mb-2">
              Absent
            </div>
            <div className="flex flex-wrap gap-1.5">
              {absent.map((m) => (
                <span key={m.userId} className="tag-absent">
                  {m.name.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
