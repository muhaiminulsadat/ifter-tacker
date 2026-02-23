"use server";

import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import connectDB from "@/lib/db";
import User from "@/model/user.model";
import Contribution from "@/model/contribution.model";
import Expense from "@/model/expense.model";
import Attendance from "@/model/attendence.model";
import Announcement from "@/model/announcement.model";

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
        amount: Math.round(amount),
      });
    }

    credit.balance -= amount;
    debt.balance -= amount;
    if (credit.balance < 0.5) ci++;
    if (debt.balance < 0.5) di++;
  }

  return transactions;
}

export async function getDashboard(ramadanDay) {
  await connectDB();
  const session = await getSession();

  const members = await User.find(
    {groupId: session.user.groupId, isApproved: true},
    "_id name avatar room role",
  ).lean();

  const userIds = members.map((m) => m._id);

  const memberMap = {};
  members.forEach((m) => {
    memberMap[m._id.toString()] = m;
  });

  const [contributions, expenses, attendanceRecords, announcements] =
    await Promise.all([
      Contribution.find({userId: {$in: userIds}}).lean(),
      Expense.find({paidByUserId: {$in: userIds}}).lean(),
      Attendance.find({userId: {$in: userIds}}).lean(),
      Announcement.find().sort({pinned: -1, createdAt: -1}).limit(3).lean(),
    ]);

  const totalContributed = contributions.reduce((s, c) => s + c.amount, 0);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  const todayAttendance = attendanceRecords.filter(
    (a) => a.ramadanDay === ramadanDay,
  );
  const absentTodayIds = new Set(
    todayAttendance
      .filter((a) => a.status === "absent")
      .map((a) => a.userId.toString()),
  );
  const attendingToday = members.length - absentTodayIds.size;

  const todayAttendanceList = members.map((m) => {
    const record = todayAttendance.find(
      (a) => a.userId.toString() === m._id.toString(),
    );
    return {
      userId: m._id.toString(),
      name: m.name,
      avatar: m.avatar,
      status: record?.status ?? "attending",
    };
  });

  const recentContributions = contributions
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((c) => {
      const member = memberMap[c.userId.toString()];
      return {
        id: c._id.toString(),
        name: member?.name ?? "Unknown",
        avatar: member?.avatar ?? "??",
        amount: c.amount,
        ramadanDay: c.ramadanDay,
        createdAt: c.createdAt.toISOString(),
      };
    });

  const recentExpenses = expenses
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((e) => {
      const paidBy = memberMap[e.paidByUserId.toString()];
      return {
        id: e._id.toString(),
        title: e.title,
        amount: e.amount,
        category: e.category,
        paidByName: paidBy?.name ?? "Unknown",
        paidByAvatar: paidBy?.avatar ?? "??",
        ramadanDay: e.ramadanDay,
        perHead: e.perHead,
      };
    });

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
    const absentOnDay = absentByDay[expense.ramadanDay] ?? new Set();
    const splitGroup = expense.universal
      ? members
      : members.filter((m) => !absentOnDay.has(m._id.toString()));
    if (!splitGroup.length) return;
    const perHead = expense.amount / splitGroup.length;
    splitGroup.forEach((m) => {
      owed[m._id.toString()] += perHead;
    });
  });

  const contributed = {};
  members.forEach((m) => {
    contributed[m._id.toString()] = 0;
  });
  contributions.forEach((c) => {
    contributed[c.userId.toString()] += c.amount;
  });

  const settlementBalances = members.map((m) => {
    const id = m._id.toString();
    return {
      userId: id,
      name: m.name,
      avatar: m.avatar,
      balance: Math.round(contributed[id] - owed[id]),
    };
  });

  const pendingTransactions = simplifyDebts(settlementBalances);

  const currentUserBalance = settlementBalances.find(
    (b) => b.userId === session.user.id,
  );

  const formattedAnnouncements = announcements.map((a) => ({
    id: a._id.toString(),
    title: a.title,
    body: a.body,
    pinned: a.pinned,
    createdAt: a.createdAt.toISOString(),
  }));

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      avatar: session.user.image,
      role: session.user.role,
    },
    stats: {
      totalContributed: Math.round(totalContributed),
      totalSpent: Math.round(totalSpent),
      surplus: Math.round(totalContributed - totalSpent),
      totalMembers: members.length,
      attendingToday,
      pendingSettlements: pendingTransactions.length,
    },
    todayAttendanceList,
    recentContributions,
    recentExpenses,
    pendingTransactions,
    currentUserBalance,
    announcements: formattedAnnouncements,
  };
}
