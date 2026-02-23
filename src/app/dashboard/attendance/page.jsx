// import {getAttendanceForDay} from "@/actions/attendance";
// import {auth} from "@/lib/auth";
// import {headers} from "next/headers";
// import AttendanceClient from "./AttendanceClient";
// import {getRamadanDay} from "@/utils/ramadan";

// const TODAY_RAMADAN_DAY = getRamadanDay();

// export default async function AttendancePage() {
//   const session = await auth.api.getSession({headers: await headers()});
//   const members = await getAttendanceForDay(TODAY_RAMADAN_DAY);

//   return (
//     <div className="space-y-6 max-w-7xl mx-auto">
//       <div>
//         <h1 className="text-base-content font-bold text-xl mb-1">Attendance</h1>
//         <p className="text-base-content/80 text-sm">
//           Day {TODAY_RAMADAN_DAY} — absent only if explicitly marked
//         </p>
//       </div>

//       <AttendanceClient
//         members={members}
//         ramadanDay={TODAY_RAMADAN_DAY}
//         currentUserId={session.user.id}
//         isAdmin={session.user.role === "admin"}
//       />
//     </div>
//   );
// }


import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {getRamadanDay} from "@/utils/ramadan";
import AttendanceShell from "./AttendanceShell";

export default async function AttendancePage() {
  const session = await auth.api.getSession({headers: await headers()});
  const todayDay = getRamadanDay();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AttendanceShell
        todayDay={todayDay}
        currentUserId={session.user.id}
        isAdmin={session.user.role === "admin"}
      />
    </div>
  );
}