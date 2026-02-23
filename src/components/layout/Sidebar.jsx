"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ShoppingCart,
  Scale,
  Megaphone,
  Moon,
  X,
} from "lucide-react";
import {GoReport} from "react-icons/go";
import {MdReportOff} from "react-icons/md";
import Image from "next/image";

// ─── Nav Items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/dashboard/attendance",
    icon: Users,
    label: "Attendance",
    live: true,
  },
  {
    href: "/dashboard/contributions",
    icon: Wallet,
    label: "Contributions",
  },
  {
    href: "/dashboard/expenses",
    icon: ShoppingCart,
    label: "Expenses",
  },
  {
    href: "/dashboard/settlement",
    icon: Scale,
    label: "Settlement",
  },
  {
    href: "/dashboard/reports",
    icon: MdReportOff,
    label: "Reports",
  },
  {
    href: "/dashboard/announcements",
    icon: Megaphone,
    label: "Announcements",
  },
];

function NavItem({item, active, onClick}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`sidebar-item ${active ? "nav-active" : ""}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: active ? "0 10px 10px 0" : 10,
        color: active ? "#c9a84c" : "#5a7fa5",
        fontWeight: 600,
        fontSize: 14,
        marginBottom: 2,
        textDecoration: "none",
        transition: "all 0.2s",
        borderLeft: active ? "3px solid #c9a84c" : "3px solid transparent",
      }}
    >
      <Icon
        size={17}
        strokeWidth={active ? 2.5 : 2}
        color={active ? "#c9a84c" : "#5a7fa5"}
      />

      <span style={{flex: 1}}>{item.label}</span>

      {item.live && (
        <span
          style={{
            background: "#c9a84c",
            color: "#060d1f",
            borderRadius: 10,
            padding: "1px 7px",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 0.5,
          }}
        >
          LIVE
        </span>
      )}
    </Link>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar({open, onClose, user, ramadanDay, iftarTime}) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop — mobile only */}
      {open && (
        <div
          onClick={onClose}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "#00000066",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar panel */}
      <aside
        style={{
          width: 240,
          background: "#07111f",
          borderRight: "1px solid #1e3a6e",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: open ? 0 : -240,
          zIndex: 50,
          transition: "left 0.3s ease",
        }}
      >
        {/* ── Logo ─────────────────────────────────────────────── */}
        <div
          className="geometric-pattern"
          style={{
            padding: "24px 20px 18px",
            borderBottom: "1px solid #1e3a6e",
            position: "relative",
          }}
        >
          {/* Close button — visible on mobile */}
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "transparent",
              border: "none",
              color: "#4a6fa5",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={16} />
          </button>

          {/* Brand */}
          <Link href={"/"}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <Moon
                className="crescent"
                size={26}
                color="#c9a84c"
                fill="#c9a84c"
              />
              <div>
                <div
                  className="gold-shimmer font-amiri"
                  style={{fontSize: 22, fontWeight: 700, lineHeight: 1}}
                >
                  Noor
                </div>
                <div
                  style={{
                    color: "#4a6fa5",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: 1,
                    marginTop: 2,
                  }}
                >
                  BUET HALL · RAMADAN {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </Link>

          {/* Ramadan day pill */}
          <div
            style={{
              padding: "8px 12px",
              background: "#c9a84c15",
              borderRadius: 8,
              border: "1px solid #c9a84c30",
            }}
          >
            <div style={{color: "#c9a84c", fontSize: 12, fontWeight: 700}}>
              🌙 Day {ramadanDay ?? "—"} of Ramadan
            </div>
            <div style={{color: "#4a6fa5", fontSize: 11, marginTop: 2}}>
              Iftar at {iftarTime ?? "—"}
            </div>
          </div>
        </div>

        {/* ── Nav ──────────────────────────────────────────────── */}
        <nav
          style={{
            flex: 1,
            padding: "12px 10px",
            overflowY: "auto",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              active={
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href)
              }
              onClick={onClose}
            />
          ))}
        </nav>

        {/* ── User Profile ──────────────────────────────────────── */}
        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid #1e3a6e",
          }}
        >
          <div style={{display: "flex", alignItems: "center", gap: 10}}>
            {/* Avatar */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #c9a84c, #a07830)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#060d1f",
                fontWeight: 800,
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              {user?.image ? (
                <Image src={user?.image} alt="avatar" height={20} width={20} />
              ) : (
                user?.avatar || "??"
              )}
            </div>

            {/* Info */}
            <div style={{overflow: "hidden"}}>
              <div
                style={{
                  color: "#e8d48b",
                  fontWeight: 700,
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.name ?? "Loading..."}
              </div>
              <div style={{color: "#c9a84c", fontSize: 11, fontWeight: 600}}>
                {user?.role === "admin" ? "Admin" : "Member"}
                {user?.room ? ` · Room ${user.room}` : ""}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
