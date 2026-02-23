"use server";

import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import connectDB from "@/lib/db";
import User from "@/model/user.model";
import Contribution from "@/model/contribution.model";
import Expense from "@/model/expense.model";
import Attendance from "@/model/attendence.model";
import mongoose from "mongoose";

async function getSession() {
  const session = await auth.api.getSession({headers: await headers()});
  if (!session) throw new Error("Not authenticated");
  return session;
}

export async function getReports() {
  await connectDB();
  const session = await getSession();

  const members = await User.find(
    {groupId: session.user.groupId},
    "_id name avatar room",
  ).lean();

  const userIds = members.map((m) => m._id);

  const memberMap = {};
  members.forEach((m) => {
    memberMap[m._id.toString()] = m;
  });

  const [contributions, expenses, attendanceRecords] = await Promise.all([
    Contribution.find({userId: {$in: userIds}}).lean(),
    Expense.find({paidByUserId: {$in: userIds}}).lean(),
    Attendance.find({userId: {$in: userIds}}).lean(),
  ]);

  console.log(contributions);

  const dailyMap = {};
  contributions.forEach((c) => {
    if (!dailyMap[c.ramadanDay])
      dailyMap[c.ramadanDay] = {day: c.ramadanDay, contributed: 0, spent: 0};
    dailyMap[c.ramadanDay].contributed += c.amount;
  });
  expenses.forEach((e) => {
    if (!dailyMap[e.ramadanDay])
      dailyMap[e.ramadanDay] = {day: e.ramadanDay, contributed: 0, spent: 0};
    dailyMap[e.ramadanDay].spent += e.amount;
  });
  const dailyOverview = Object.values(dailyMap).sort((a, b) => a.day - b.day);

  const categoryMap = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] ?? 0) + e.amount;
  });
  const categoryBreakdown = Object.entries(categoryMap)
    .map(([name, value]) => ({name, value}))
    .sort((a, b) => b.value - a.value);

  const contribByMember = {};
  members.forEach((m) => {
    contribByMember[m._id.toString()] = {
      name: m.name,
      avatar: m.avatar,
      total: 0,
    };
  });

  contributions.forEach((c) => {
    const userIdStr = c.userId?._id?.toString() ?? c.userId?.toString();
    if (contribByMember[userIdStr]) {
      contribByMember[userIdStr].total += Number(c.amount) || 0;
    }
  });

  const memberContributions = Object.values(contribByMember).sort(
    (a, b) => b.total - a.total,
  );

  const absentByMember = {};
  members.forEach((m) => {
    absentByMember[m._id.toString()] = 0;
  });

  attendanceRecords.forEach((a) => {
    if (a.status === "absent") absentByMember[a.userId.toString()]++;
  });

  const daysTracked = [...new Set(attendanceRecords.map((a) => a.ramadanDay))]
    .length;

  const memberAttendance = members
    .map((m) => {
      const absent = absentByMember[m._id.toString()];
      const attended = Math.max(0, daysTracked - absent);
      const rate =
        daysTracked > 0 ? Math.round((attended / daysTracked) * 100) : 100;
      return {
        name: m.name,
        avatar: m.avatar,
        attended,
        absent,
        rate,
      };
    })
    .sort((a, b) => b.rate - a.rate);

  const attendingByDay = {};
  const totalMembers = members.length;
  attendanceRecords.forEach((a) => {
    if (!attendingByDay[a.ramadanDay])
      attendingByDay[a.ramadanDay] = {
        day: a.ramadanDay,
        attending: totalMembers,
        absent: 0,
      };
    if (a.status === "absent") {
      attendingByDay[a.ramadanDay].attending -= 1;
      attendingByDay[a.ramadanDay].absent += 1;
    }
  });
  const dailyAttendance = Object.values(attendingByDay).sort(
    (a, b) => a.day - b.day,
  );

  const totalContributed = contributions.reduce((s, c) => s + c.amount, 0);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const totalExpenseCount = expenses.length;
  const avgDailySpend =
    dailyOverview.length > 0
      ? Math.round(totalSpent / dailyOverview.length)
      : 0;

  return {
    dailyOverview,
    categoryBreakdown,
    memberContributions,
    memberAttendance,
    dailyAttendance,
    stats: {
      totalContributed: Math.round(totalContributed),
      totalSpent: Math.round(totalSpent),
      surplus: Math.round(totalContributed - totalSpent),
      avgDailySpend,
      totalExpenseCount,
      daysTracked,
      totalMembers,
    },
  };
}
