"use client";

import {useState, useRef, useEffect} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {LayoutDashboard, LogOut, ChevronDown, Shield} from "lucide-react";
import {authClient} from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function NavbarClient({user}) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await authClient.signOut();
      toast.success("Signed out");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
      setSigningOut(false);
    }
  }

  const initials =
    // user.avatar ||
    user.name
      ?.trim()
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "??";

  const {data: session} = authClient.useSession();

  return (
    <div className="flex items-center gap-2">
      {!session?.user?.isApproved ? (
        ""
      ) : (
        <Link
          href="/dashboard"
          className="hidden sm:flex items-center gap-2 btn btn-sm font-bold rounded-xl"
          style={{
            background: "rgba(30,58,110,0.4)",
            border: "1px solid rgba(30,58,110,0.7)",
            color: "rgba(232,212,139,0.8)",
          }}
        >
          <LayoutDashboard size={14} />
          Dashboard
        </Link>
      )}

      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-all duration-200"
          style={{
            background: open ? "rgba(30,58,110,0.5)" : "rgba(13,26,53,0.6)",
            border: `1px solid ${open ? "rgba(201,168,76,0.3)" : "rgba(30,58,110,0.5)"}`,
          }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #a07830)",
              color: "#060d1f",
            }}
          >
            {initials}
          </div>
          <span
            className="hidden sm:block text-xs font-semibold max-w-24 truncate"
            style={{color: "rgba(232,212,139,0.7)"}}
          >
            {user.name?.split(" ")[0]}
          </span>
          <ChevronDown
            size={13}
            style={{
              color: "rgba(201,168,76,0.5)",
              transition: "transform 0.2s ease",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {open && (
          <div
            className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "#0d1a35",
              border: "1px solid rgba(30,58,110,0.8)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.05)",
              animation: "rise 0.18s ease both",
            }}
          >
            <div
              className="px-4 py-3 border-b"
              style={{borderColor: "rgba(30,58,110,0.6)"}}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #c9a84c, #a07830)",
                    color: "#060d1f",
                  }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-base-content truncate">
                    {user.name}
                  </p>
                  {user.role === "admin" && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Shield size={10} color="#60a5fa" />
                      <span
                        className="text-xs font-bold"
                        style={{color: "#60a5fa"}}
                      >
                        Admin
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-1.5">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150"
                style={{color: "rgba(232,212,139,0.7)"}}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(30,58,110,0.5)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <LayoutDashboard size={15} color="#c9a84c" />
                Dashboard
              </Link>

              <div
                className="my-1.5 border-t"
                style={{borderColor: "rgba(30,58,110,0.5)"}}
              />

              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 disabled:opacity-50"
                style={{color: "rgba(248,113,113,0.7)"}}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(248,113,113,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <LogOut size={15} color="#f87171" />
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
