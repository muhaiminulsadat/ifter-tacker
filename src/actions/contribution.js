"use server";

import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {revalidatePath} from "next/cache";
import connectDB from "@/lib/db";
import User from "@/model/user.model";
import Contribution from "@/model/contribution.model";

async function getSession() {
  const session = await auth.api.getSession({headers: await headers()});
  if (!session) throw new Error("Not authenticated");
  return session;
}

export async function getContributions() {
  await connectDB();
  const session = await getSession();

  const members = await User.find(
    {groupId: session.user.groupId},
    "_id name room avatar",
  ).lean();

  const userIds = members.map((m) => m._id);

  const contributions = await Contribution.find({userId: {$in: userIds}})
    .sort({createdAt: -1})
    .lean();

  const memberMap = {};
  members.forEach((m) => {
    memberMap[m._id.toString()] = m;
  });

  const perMember = {};
  members.forEach((m) => {
    perMember[m._id.toString()] = {
      userId: m._id.toString(),
      name: m.name,
      room: m.room,
      avatar: m.avatar,
      total: 0,
    };
  });

  const log = contributions.map((c) => {
    const member = memberMap[c.userId.toString()];
    perMember[c.userId.toString()].total += c.amount;
    return {
      id: c._id.toString(),
      userId: c.userId.toString(),
      name: member?.name ?? "Unknown",
      avatar: member?.avatar ?? "??",
      amount: c.amount,
      ramadanDay: c.ramadanDay,
      note: c.note ?? "",
      createdAt: c.createdAt.toISOString(),
    };
  });

  return {
    log,
    perMember: Object.values(perMember),
    totalCollected: log.reduce((s, c) => s + c.amount, 0),
  };
}

export async function addContribution(formData) {
  await connectDB();
  const session = await getSession();

  if (session.user.role !== "admin")
    throw new Error("Only admin can log contributions.");

  const userId = formData.get("userId");
  const amount = Number(formData.get("amount"));
  const ramadanDay = Number(formData.get("ramadanDay"));
  const note = formData.get("note") ?? "";

  if (!userId || !amount || !ramadanDay)
    throw new Error("Missing required fields.");
  if (amount < 1) throw new Error("Amount must be at least 1 taka.");
  if (ramadanDay < 1 || ramadanDay > 30)
    throw new Error("Invalid Ramadan day.");

  await Contribution.create({userId, amount, ramadanDay, note});

  revalidatePath("/dashboard/contributions");
}

export async function deleteContribution(contributionId) {
  await connectDB();
  const session = await getSession();

  if (session.user.role !== "admin")
    throw new Error("Only admin can delete contributions.");

  await Contribution.findByIdAndDelete(contributionId);

  revalidatePath("/dashboard/contributions");
}
