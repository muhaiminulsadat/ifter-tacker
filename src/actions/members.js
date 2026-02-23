"use server";

import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {revalidatePath} from "next/cache";
import connectDB from "@/lib/db";
import User from "@/model/user.model";

async function getSession() {
  const session = await auth.api.getSession({headers: await headers()});
  if (!session) throw new Error("Not authenticated");
  return session;
}

export async function getPendingMembers() {
  await connectDB();
  const session = await getSession();
  if (session.user.role !== "admin") throw new Error("Admins only.");

  const members = await User.find(
    {groupId: session.user.groupId, isApproved: false},
    "_id name email room avatar createdAt",
  ).lean();

  return members.map((m) => ({
    id: m._id.toString(),
    name: m.name,
    email: m.email,
    room: m.room,
    avatar: m.avatar,
    createdAt: m.createdAt.toISOString(),
  }));
}

export async function approveUser(userId) {
  await connectDB();
  const session = await getSession();
  if (session.user.role !== "admin") throw new Error("Admins only.");

  await User.findByIdAndUpdate(userId, {isApproved: true});
  revalidatePath("/dashboard/members");
}

export async function rejectUser(userId) {
  await connectDB();
  const session = await getSession();
  if (session.user.role !== "admin") throw new Error("Admins only.");

  await User.findByIdAndDelete(userId);
  revalidatePath("/dashboard/members");
}
