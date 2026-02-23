"use server";

import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import connectDB from "@/lib/db";
import User from "@/model/user.model";
import Contribution from "@/model/contribution.model";
import Expense from "@/model/expense.model";
import Attendance from "@/model/attendence.model";

async function getSession() {
  const session = await auth.api.getSession({headers: await headers()});
  if (!session) throw new Error("Not authenticated");
  return session;
}

function simplifyDebts(balances) {
  let creditors = balances
    .filter((b) => b.balance > 0.5)
    .map((b) => ({...b}))
    .sort((a, b) => b.balance - a.balance);

  let debtors = balances
    .filter((b) => b.balance < -0.5)
    .map((b) => ({...b, balance: Math.abs(b.balance)}))
    .sort((a, b) => b.balance - a.balance);

  const transactions = [];

  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const credit = creditors[ci];
    const debt = debtors[di];

    const amount = Math.min(credit.balance, debt.balance);

    if (amount > 0.5) {
      transactions.push({
        from: debt.userId,
        fromName: debt.name,
        fromAvatar: debt.avatar,
        to: credit.userId,
        toName: credit.name,
        toAvatar: credit.avatar,
        amount: amount,
      });
    }

    credit.balance -= amount;
    debt.balance -= amount;

    if (credit.balance < 0.5) ci++;
    if (debt.balance < 0.5) di++;
  }

  return transactions;
}

export async function getSettlement() {
  await connectDB();
  const session = await getSession();

  const members = await User.find(
    {groupId: session.user.groupId, isApproved: true},
    "_id name room avatar",
  ).lean();

  if (!members.length)
    return {
      summary: [],
      transactions: [],
      totalContributed: 0,
      totalExpenses: 0,
      surplus: 0,
    };

  const userIds = members.map((m) => m._id);
  const memberMap = {};
  members.forEach((m) => {
    memberMap[m._id.toString()] = m;
  });

  const contributions = await Contribution.find({
    userId: {$in: userIds},
  }).lean();

  const contributed = {};
  members.forEach((m) => {
    contributed[m._id.toString()] = 0;
  });
  contributions.forEach((c) => {
    contributed[c.userId.toString()] += c.amount;
  });

  const expenses = await Expense.find({
    paidByUserId: {$in: userIds},
  }).lean();

  const attendanceRecords = await Attendance.find({
    userId: {$in: userIds},
  }).lean();

  const absentByDay = {};
  attendanceRecords.forEach((a) => {
    if (a.status === "absent") {
      if (!absentByDay[a.ramadanDay]) absentByDay[a.ramadanDay] = new Set();
      absentByDay[a.ramadanDay].add(a.userId.toString());
    }
  });

  const owed = {};
  members.forEach((m) => {
    owed[m._id.toString()] = 0;
  });

  expenses.forEach((expense) => {
    const day = expense.ramadanDay;

    const splitGroup = expense.universal
      ? members
      : members.filter(
          (m) => !(absentByDay[day] ?? new Set()).has(m._id.toString()),
        );

    if (splitGroup.length === 0) return;
    const perHead = expense.amount / splitGroup.length;
    splitGroup.forEach((m) => {
      owed[m._id.toString()] += perHead;
    });
  });

  const totalContributed = Object.values(contributed).reduce(
    (s, v) => s + v,
    0,
  );
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const summary = members.map((m) => {
    const id = m._id.toString();
    const contrib = contributed[id];
    const share = owed[id];
    const balance = contrib - share;

    return {
      userId: id,
      name: m.name,
      room: m.room,
      avatar: m.avatar,
      contributed: contrib,
      expenseShare: share,
      balance: balance,
    };
  });

  const transactions = simplifyDebts(
    summary.map((s) => ({
      userId: s.userId,
      name: s.name,
      avatar: s.avatar,
      balance: s.balance,
    })),
  );

  return {
    summary,
    transactions,
    totalContributed: totalContributed,
    totalExpenses: totalExpenses,
    surplus: totalContributed - totalExpenses,
  };
}
