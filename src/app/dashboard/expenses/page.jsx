import {getExpenses} from "@/actions/expense";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import ExpensesClient from "./ExpensesClient";

const TODAY_RAMADAN_DAY = 17;

export default async function ExpensesPage() {
  const session = await auth.api.getSession({headers: await headers()});
  const {log, totalSpent, members} = await getExpenses();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-base-content font-bold text-xl mb-1">Expenses</h1>
        <p className="text-base-content/40 text-sm">
          Track what was bought each day and per-head cost
        </p>
      </div>

      <ExpensesClient
        log={log}
        totalSpent={totalSpent}
        members={members}
        currentDay={TODAY_RAMADAN_DAY}
        isAdmin={session.user.role === "admin"}
      />
    </div>
  );
}
