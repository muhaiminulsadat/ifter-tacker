import {getAnnouncements} from "@/actions/announcements";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {Megaphone} from "lucide-react";
import {
  AnnouncementCard,
  AddAnnouncementButton,
} from "@/components/announcements/AnnouncementsClient";

export const metadata = {
  title: "Announcements · Noor",
};

export default async function AnnouncementsPage() {
  const [announcements, session] = await Promise.all([
    getAnnouncements(),
    auth.api.getSession({headers: await headers()}),
  ]);

  const isAdmin = session?.user?.role === "admin";

  const pinned = announcements.filter((a) => a.pinned);
  const rest = announcements.filter((a) => !a.pinned);

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-4 md:p-8 fade-up">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(251,146,60,0.10)",
              border: "1px solid rgba(251,146,60,0.20)",
            }}
          >
            <Megaphone size={20} color="#fb923c" />
          </div>
          <div>
            <h1 className="font-amiri text-2xl font-bold text-base-content">
              Announcements
            </h1>
            <p className="text-base-content/45 text-sm">
              {announcements.length === 0
                ? "Nothing posted yet"
                : `${announcements.length} announcement${announcements.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {isAdmin && <AddAnnouncementButton />}
      </div>

      {announcements.length === 0 ? (
        <div
          className="rounded-2xl p-16 flex flex-col items-center justify-center text-center gap-3"
          style={{background: "#0d1a35", border: "1px solid #1e3a6e"}}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2"
            style={{
              background: "rgba(251,146,60,0.08)",
              border: "1px solid rgba(251,146,60,0.15)",
            }}
          >
            <Megaphone size={26} color="rgba(251,146,60,0.5)" />
          </div>
          <p className="font-bold text-base-content/40">No announcements yet</p>
          <p className="text-base-content/25 text-sm max-w-xs">
            {isAdmin
              ? "Post your first announcement to keep the group informed."
              : "Check back later — admins will post updates here."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pinned.length > 0 && (
            <>
              <p className="text-xs font-bold text-primary/50 uppercase tracking-widest px-1">
                Pinned
              </p>
              {pinned.map((a) => (
                <AnnouncementCard
                  key={a.id}
                  announcement={a}
                  isAdmin={isAdmin}
                />
              ))}
            </>
          )}

          {rest.length > 0 && (
            <>
              {pinned.length > 0 && (
                <p className="text-xs font-bold text-base-content/25 uppercase tracking-widest px-1 mt-2">
                  Recent
                </p>
              )}
              {rest.map((a) => (
                <AnnouncementCard
                  key={a.id}
                  announcement={a}
                  isAdmin={isAdmin}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
