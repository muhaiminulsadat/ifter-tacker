"use server";

import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {revalidatePath} from "next/cache";
import connectDB from "@/lib/db";
import Expense from "@/model/expense.model";
import User from "@/model/user.model";
import Attendance from "@/model/attendence.model";

async function getSession() {
  const session = await auth.api.getSession({headers: await headers()});
  if (!session) throw new Error("Not authenticated");
  return session;
}

export async function getExpenses() {
  await connectDB();
  const session = await getSession();

  const rawMembers = await User.find(
    {groupId: session.user.groupId, isApproved: true},
    "_id name avatar",
  ).lean();

  const userIds = rawMembers.map((m) => m._id);
  const memberMap = {};
  rawMembers.forEach((m) => {
    memberMap[m._id.toString()] = m;
  });

  const expenses = await Expense.find({paidByUserId: {$in: userIds}})
    .sort({ramadanDay: -1, createdAt: -1})
    .lean();

  const log = expenses.map((e) => {
    const paidBy = memberMap[e.paidByUserId.toString()];
    return {
      id: e._id.toString(),
      title: e.title,
      amount: e.amount,
      category: e.category,
      paidByUserId: e.paidByUserId.toString(),
      paidByName: paidBy?.name ?? "Unknown",
      paidByAvatar: paidBy?.avatar ?? "??",
      ramadanDay: e.ramadanDay,
      attendeeCount: e.attendeeCount,
      perHead: e.perHead,
      note: e.note ?? "",
      universal: e.universal ?? false,
      createdAt: e.createdAt.toISOString(),
    };
  });

  const members = JSON.parse(JSON.stringify(rawMembers));

  const totalSpent = log.reduce((s, e) => s + e.amount, 0);

  return {log, totalSpent, members};
}

export async function getAttendeeCountForDay(ramadanDay) {
  await connectDB();
  const session = await getSession();

  const members = await User.find(
    {groupId: session.user.groupId, isApproved: true},
    "_id",
  ).lean();

  const userIds = members.map((m) => m._id);

  const absentCount = await Attendance.countDocuments({
    userId: {$in: userIds},
    ramadanDay,
    status: "absent",
  });

  return members.length - absentCount;
}

// export async function addExpense(formData) {
//   await connectDB();
//   const session = await getSession();

//   if (session.user.role !== "admin")
//     throw new Error("Only admin can log expenses.");

//   const title = formData.get("title")?.trim();
//   const amount = Number(formData.get("amount"));
//   const category = formData.get("category");
//   const paidByUserId = formData.get("paidByUserId");
//   const ramadanDay = Number(formData.get("ramadanDay"));
//   const attendeeCount = Number(formData.get("attendeeCount"));
//   const note = formData.get("note") ?? "";

//   if (
//     !title ||
//     !amount ||
//     !category ||
//     !paidByUserId ||
//     !ramadanDay ||
//     !attendeeCount
//   ) {
//     throw new Error("Missing required fields.");
//   }
//   if (amount < 1) throw new Error("Amount must be at least 1 taka.");
//   if (attendeeCount < 1) throw new Error("Attendee count must be at least 1.");
//   if (ramadanDay < 1 || ramadanDay > 30)
//     throw new Error("Invalid Ramadan day.");

//   await Expense.create({
//     title,
//     amount,
//     category,
//     paidByUserId,
//     ramadanDay,
//     attendeeCount,
//     note,
//   });

//   revalidatePath("/dashboard/expenses");
// }

export async function addExpense(formData) {
  try {
    await connectDB();
    const session = await getSession();

    if (session.user.role !== "admin")
      throw new Error("Only admin can log expenses.");

    const title = formData.get("title")?.trim();
    const amount = Number(formData.get("amount"));
    const category = formData.get("category");
    const paidByUserId = formData.get("paidByUserId"); // Make sure input name="paidByUserId"
    const ramadanDay = Number(formData.get("ramadanDay"));
    const attendeeCount = Number(formData.get("attendeeCount"));
    const note = formData.get("note") ?? "";
    const universal = formData.get("universal") === "true";

    // Validation
    if (
      !title ||
      !amount ||
      !category ||
      !paidByUserId ||
      !ramadanDay ||
      !attendeeCount
    ) {
      throw new Error("Please fill all required fields.");
    }

    await Expense.create({
      title,
      amount,
      category,
      paidByUserId,
      ramadanDay,
      attendeeCount,
      note,
      universal,
    });

    revalidatePath("/dashboard/expenses");
    return {success: true};
  } catch (error) {
    console.error("Add Expense Error:", error.message);
    throw new Error(error.message); // This will be caught by your toast.error in the client
  }
}

export async function deleteExpense(expenseId) {
  await connectDB();
  const session = await getSession();

  if (session.user.role !== "admin")
    throw new Error("Only admin can delete expenses.");

  await Expense.findByIdAndDelete(expenseId);

  revalidatePath("/dashboard/expenses");
}
