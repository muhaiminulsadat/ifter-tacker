"use client";

import {useState, useRef} from "react";
import {Pin, Trash2, Plus, X, Megaphone, PinOff} from "lucide-react";
import toast from "react-hot-toast";
import {
  addAnnouncement,
  togglePin,
  deleteAnnouncement,
} from "@/actions/announcements";

function Avatar({label}) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
      style={{
        background: "linear-gradient(135deg, #1e3a6e, #0d1a35)",
        border: "1px solid rgba(201,168,76,0.25)",
        color: "#c9a84c",
      }}
    >
      {label}
    </div>
  );
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function AnnouncementCard({announcement, isAdmin}) {
  const [pinning, setPinning] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handlePin() {
    setPinning(true);
    try {
      await togglePin(announcement.id);
      toast.success(announcement.pinned ? "Unpinned" : "Pinned");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setPinning(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this announcement?")) return;
    setDeleting(true);
    try {
      await deleteAnnouncement(announcement.id);
      toast.success("Announcement deleted");
    } catch (e) {
      toast.error(e.message);
      setDeleting(false);
    }
  }

  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200"
      style={{
        background: announcement.pinned
          ? "linear-gradient(135deg, rgba(201,168,76,0.07), #0d1a35)"
          : "#0d1a35",
        border: announcement.pinned
          ? "1px solid rgba(201,168,76,0.28)"
          : "1px solid #1e3a6e",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {announcement.pinned && (
            <Pin size={13} color="#c9a84c" className="shrink-0 mt-0.5" />
          )}
          <h3 className="font-bold text-base-content text-sm leading-snug">
            {announcement.title}
          </h3>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handlePin}
              disabled={pinning}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-primary/10 disabled:opacity-40"
              title={announcement.pinned ? "Unpin" : "Pin"}
            >
              {announcement.pinned ? (
                <PinOff size={13} color="#c9a84c" />
              ) : (
                <Pin size={13} color="rgba(201,168,76,0.5)" />
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-error/10 disabled:opacity-40"
              title="Delete"
            >
              <Trash2 size={13} color="rgba(248,113,113,0.6)" />
            </button>
          </div>
        )}
      </div>

      <p className="text-base-content/60 text-sm leading-relaxed mb-4">
        {announcement.body}
      </p>

      <div className="flex items-center gap-2">
        <Avatar label={announcement.authorAvatar} />
        <span className="text-xs text-base-content/40 font-medium">
          {announcement.authorName}
        </span>
        <span className="text-base-content/20 text-xs">·</span>
        <span className="text-xs text-base-content/35">
          {timeAgo(announcement.createdAt)}
        </span>
      </div>
    </div>
  );
}

export function AddAnnouncementButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [bodyLen, setBodyLen] = useState(0);
  const formRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(formRef.current);
      formData.set("pinned", String(pinned));
      await addAnnouncement(formData);
      toast.success("Announcement posted");
      formRef.current.reset();
      setBodyLen(0);
      setPinned(false);
      setOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary btn-sm gap-2 rounded-xl font-bold"
      >
        <Plus size={15} />
        Post Announcement
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Megaphone size={18} color="#fb923c" />
                <h2 className="font-bold text-base-content text-base">
                  New Announcement
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-base-200 transition-colors"
              >
                <X size={15} color="rgba(232,212,139,0.5)" />
              </button>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-xs font-bold text-base-content/50 uppercase tracking-wider mb-1.5">
                  Title
                </label>
                <input
                  name="title"
                  required
                  maxLength={120}
                  placeholder="e.g. Today's shopper — Riad"
                  className="input-dark w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-base-content/50 uppercase tracking-wider">
                    Body
                  </label>
                  <span className="text-xs text-base-content/30">
                    {bodyLen}/1000
                  </span>
                </div>
                <textarea
                  name="body"
                  required
                  maxLength={1000}
                  rows={4}
                  placeholder="Write your announcement here…"
                  className="input-dark w-full resize-none"
                  onChange={(e) => setBodyLen(e.target.value.length)}
                />
              </div>

              <button
                type="button"
                onClick={() => setPinned((p) => !p)}
                className="flex items-center gap-2.5 self-start rounded-xl px-3 py-2 transition-colors"
                style={{
                  background: pinned
                    ? "rgba(201,168,76,0.10)"
                    : "rgba(30,58,110,0.4)",
                  border: pinned
                    ? "1px solid rgba(201,168,76,0.3)"
                    : "1px solid #1e3a6e",
                }}
              >
                <Pin
                  size={13}
                  color={pinned ? "#c9a84c" : "rgba(232,212,139,0.3)"}
                />
                <span
                  className="text-xs font-semibold"
                  style={{color: pinned ? "#c9a84c" : "rgba(232,212,139,0.4)"}}
                >
                  {pinned ? "Pinned" : "Pin this announcement"}
                </span>
              </button>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn btn-ghost btn-sm flex-1 rounded-xl border border-secondary/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-sm flex-1 rounded-xl font-bold"
                >
                  {loading ? "Posting…" : "Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
