"use client";

import {useState, useEffect, useTransition} from "react";
import {CalendarDays, ChevronDown, Loader2} from "lucide-react";
import {getAttendanceForDay} from "@/actions/attendance";
import AttendanceClient from "./AttendanceClient";

const RAMADAN_DAYS = Array.from({length: 30}, (_, i) => i + 1);

export default function AttendanceShell({todayDay, currentUserId, isAdmin}) {
  const [selectedDay, setSelectedDay] = useState(todayDay);
  const [members, setMembers] = useState([]);
  const [isPending, startTransition] = useTransition();

  const fetchMembers = (day) => {
    startTransition(async () => {
      const data = await getAttendanceForDay(day);
      setMembers(data);
    });
  };

  // Fetch on day change
  useEffect(() => {
    fetchMembers(selectedDay);
  }, [selectedDay]);

  // Poll every 15s for real-time updates from others
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMembers(selectedDay);
    }, 15000);
    return () => clearInterval(interval);
  }, [selectedDay]);

  const isToday = selectedDay === todayDay;

  return (
    <>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-base-content font-bold text-xl mb-1">
            Attendance
          </h1>
          <p className="text-base-content/60 text-sm">
            {isToday
              ? `Day ${selectedDay} (today) — absent only if explicitly marked`
              : `Day ${selectedDay} — viewing past record`}
          </p>
        </div>

        <div className="relative flex items-center gap-2 px-3 py-2 rounded-xl border border-primary/25 bg-base-200">
          <CalendarDays size={15} className="text-primary shrink-0" />
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            className="bg-transparent text-sm font-semibold text-base-content appearance-none outline-none pr-4 cursor-pointer"
          >
            {RAMADAN_DAYS.map((d) => (
              <option key={d} value={d}>
                Day {d} {d === todayDay ? "(today)" : ""}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="text-base-content/40 shrink-0 pointer-events-none absolute right-3"
          />
        </div>
      </div>

      {isPending && members.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-base-content/50 py-10">
          <Loader2 size={15} className="animate-spin text-primary" />
          Loading Day {selectedDay} attendance…
        </div>
      ) : (
        <AttendanceClient
          members={members}
          ramadanDay={selectedDay}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          onRefresh={() => fetchMembers(selectedDay)}
        />
      )}
    </>
  );
}
