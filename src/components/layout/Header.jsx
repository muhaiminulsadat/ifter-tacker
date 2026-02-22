"use client";

import {useState, useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import {Menu, Timer, LogOut, Bell} from "lucide-react";
import toast from "react-hot-toast";
import {useGetCurrentUser} from "@/hooks/auth-hooks";
import {authClient} from "@/lib/auth-client";
import Link from "next/link";
import ToastProvider from "../ToastProvider";

const PAGE_TITLES = {
  "/dashboard": {icon: "🌙", label: "Dashboard"},
  "/dashboard/attendance": {icon: "🕌", label: "Attendance"},
  "/dashboard/contributions": {icon: "💰", label: "Contributions"},
  "/dashboard/expenses": {icon: "🛒", label: "Expenses"},
  "/dashboard/settlement": {icon: "⚖️", label: "Settlement"},
  "/dashboard/announcements": {icon: "📢", label: "Announcements"},
};

function useIftarCountdown(iftarTime) {
  const [countdown, setCountdown] = useState("");
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    if (!iftarTime) return;

    const tick = () => {
      const now = new Date();
      const [time, meridiem] = iftarTime.split(" ");
      const [h, m] = time.split(":").map(Number);

      let hours = h;
      if (meridiem === "PM" && h !== 12) hours += 12;
      if (meridiem === "AM" && h === 12) hours = 0;

      const iftar = new Date();
      iftar.setHours(hours, m, 0, 0);

      const diff = iftar - now;

      if (diff <= 0) {
        setPassed(true);
        setCountdown("Iftar time! 🌙");
        return;
      }

      const totalMins = Math.floor(diff / 60000);
      const hrs = Math.floor(totalMins / 60);
      const mins = totalMins % 60;

      setCountdown(hrs > 0 ? `${hrs}h ${mins}m to Iftar` : `${mins}m to Iftar`);
    };

    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [iftarTime]);

  return {countdown, passed};
}

export default function Header({onMenuClick, iftarTime}) {
  const pathname = usePathname();
  const router = useRouter();
  const {countdown, passed} = useIftarCountdown(iftarTime);

  const user = useGetCurrentUser();

  const page = PAGE_TITLES[pathname] ?? {icon: "🌙", label: "Noor"};

  const handleLogout = async () => {
    try {
      const {authClient} = await import("@/lib/auth-client");
      await authClient.signOut();
      toast.success("Logged out. Ramadan Mubarak! 🌙");
      router.push("/login");
    } catch {
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <header
      style={{
        height: 60,
        background: "#07111fcc",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1e3a6e",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 14,
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <button
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
        style={{
          background: "#1e3a6e",
          border: "none",
          color: "#c9a84c",
          borderRadius: 8,
          width: 36,
          height: 36,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#2d5a9e")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#1e3a6e")}
      >
        <Menu size={18} />
      </button>

      {/* ── Page Title ─────────────────────────────────────── */}
      <div style={{display: "flex", alignItems: "center", gap: 8}}>
        <span style={{fontSize: 18, lineHeight: 1}}>{page.icon}</span>
        <span
          style={{
            color: "#e8d48b",
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          {page.label}
        </span>
      </div>

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {countdown && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: passed ? "#14532d" : "#c9a84c18",
              border: `1px solid ${passed ? "#4ade8044" : "#c9a84c33"}`,
              borderRadius: 8,
              padding: "5px 12px",
            }}
          >
            <Timer
              size={14}
              color={passed ? "#4ade80" : "#c9a84c"}
              strokeWidth={2.5}
            />
            <span
              style={{
                color: passed ? "#4ade80" : "#c9a84c",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {countdown}
            </span>
          </div>
        )}

        {!user ? (
          <>
            <Link href={"/login"}>Login</Link>
            <Link href={"/register"}>Register</Link>
          </>
        ) : (
          <>
            <button
              aria-label="Notifications"
              style={{
                background: "transparent",
                border: "1px solid #1e3a6e",
                borderRadius: 8,
                width: 34,
                height: 34,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4a6fa5",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#c9a84c44";
                e.currentTarget.style.color = "#c9a84c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1e3a6e";
                e.currentTarget.style.color = "#4a6fa5";
              }}
              onClick={() =>
                toast("Announcements coming soon! 📢", {icon: "🌙"})
              }
            >
              <Bell size={15} />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              aria-label="Logout"
              style={{
                background: "transparent",
                border: "1px solid #1e3a6e",
                borderRadius: 8,
                width: 34,
                height: 34,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4a6fa5",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#f8717144";
                e.currentTarget.style.color = "#f87171";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1e3a6e";
                e.currentTarget.style.color = "#4a6fa5";
              }}
            >
              <LogOut size={15} />
            </button>
          </>
        )}
      </div>
      <ToastProvider />
    </header>
  );
}
