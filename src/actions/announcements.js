"use server";

import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {revalidatePath} from "next/cache";
import connectDB from "@/lib/db";
import Announcement from "@/model/announcement.model";
import User from "@/model/user.model";

async function getSession() {
  const session = await auth.api.getSession({headers: await headers()});
  if (!session) throw new Error("Not authenticated");
  return session;
}

export async function getAnnouncements() {
  await connectDB();
  await getSession();

  const announcements = await Announcement.find()
    .sort({pinned: -1, createdAt: -1})
    .lean();

  const authorIds = [
    ...new Set(announcements.map((a) => a.authorId.toString())),
  ];
  const authors = await User.find(
    {_id: {$in: authorIds}},
    "_id name avatar",
  ).lean();

  const authorMap = {};
  authors.forEach((a) => {
    authorMap[a._id.toString()] = a;
  });

  return announcements.map((a) => ({
    id: a._id.toString(),
    title: a.title,
    body: a.body,
    pinned: a.pinned,
    authorId: a.authorId.toString(),
    authorName: authorMap[a.authorId.toString()]?.name ?? "Unknown",
    authorAvatar: authorMap[a.authorId.toString()]?.avatar ?? "??",
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));
}

export async function addAnnouncement(formData) {
  await connectDB();
  const session = await getSession();

  if (session.user.role !== "admin")
    throw new Error("Only admin can post announcements.");

  const title = formData.get("title")?.trim();
  const body = formData.get("body")?.trim();
  const pinned = formData.get("pinned") === "true";

  if (!title || !body) throw new Error("Title and body are required.");
  if (title.length > 120)
    throw new Error("Title must be under 120 characters.");
  if (body.length > 1000)
    throw new Error("Body must be under 1000 characters.");

  await Announcement.create({title, body, pinned, authorId: session.user.id});

  revalidatePath("/dashboard/announcements");
  return {success: true};
}

export async function togglePin(announcementId) {
  await connectDB();
  const session = await getSession();

  if (session.user.role !== "admin")
    throw new Error("Only admin can pin announcements.");

  const announcement = await Announcement.findById(announcementId);
  if (!announcement) throw new Error("Announcement not found.");

  announcement.pinned = !announcement.pinned;
  await announcement.save();

  revalidatePath("/dashboard/announcements");
}

export async function deleteAnnouncement(announcementId) {
  await connectDB();
  const session = await getSession();

  if (session.user.role !== "admin")
    throw new Error("Only admin can delete announcements.");

  await Announcement.findByIdAndDelete(announcementId);

  revalidatePath("/dashboard/announcements");
}
