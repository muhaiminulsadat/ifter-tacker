"use server";

import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {revalidatePath} from "next/cache";
import connectDB from "@/lib/db";
import Attendance from "@/model/attendence.model";
import User from "@/model/user.model";

async function getSession() {
  const session = await auth.api.getSession({headers: await headers()});
  if (!session) throw new Error("Not authenticated");
  return session;
}

export async function getAttendanceForDay(ramadanDay) {
  await connectDB();
  const session = await getSession();

  const members = await User.find(
    {groupId: session.user.groupId},
    "_id name room avatar",
  ).lean();

  const userIds = members.map((m) => m._id);

  const records = await Attendance.find({
    userId: {$in: userIds},
    ramadanDay,
  }).lean();

  const recordMap = {};
  records.forEach((r) => {
    recordMap[r.userId.toString()] = r;
  });

  return members.map((m) => {
    const record = recordMap[m._id.toString()];
    return {
      userId: m._id.toString(),
      name: m.name,
      room: m.room,
      avatar: m.avatar,
      status: record?.status ?? "attending",
      reason: record?.reason ?? "",
    };
  });
}

export async function markAttendance(userId, ramadanDay, status, reason = "") {
  await connectDB();
  await getSession();

  await Attendance.findOneAndUpdate(
    {userId, ramadanDay},
    {userId, ramadanDay, status, reason},
    {upsert: true, new: true},
  );

  revalidatePath("/dashboard/attendance");
}

export async function markMyAttendance(ramadanDay, status, reason = "") {
  await connectDB();
  const session = await getSession();

  await Attendance.findOneAndUpdate(
    {userId: session.user.id, ramadanDay},
    {userId: session.user.id, ramadanDay, status, reason},
    {upsert: true, new: true},
  );

  revalidatePath("/dashboard/attendance");
}
