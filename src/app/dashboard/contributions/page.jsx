import {getContributions} from "@/actions/contribution";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import ContributionsClient from "./ContributionsClient";
import {getRamadanDay} from "@/utils/ramadan";

export default async function ContributionsPage() {
  const session = await auth.api.getSession({headers: await headers()});
  const {log, perMember, totalCollected} = await getContributions();

  const TODAY_RAMADAN_DAY = getRamadanDay();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-base-content font-bold text-xl mb-1">
          Contributions
        </h1>
        <p className="text-base-content/40 text-sm">
          Track money collected from each member
        </p>
      </div>

      <ContributionsClient
        log={log}
        perMember={perMember}
        totalCollected={totalCollected}
        currentDay={TODAY_RAMADAN_DAY}
        isAdmin={session.user.role === "admin"}
      />
    </div>
  );
}
