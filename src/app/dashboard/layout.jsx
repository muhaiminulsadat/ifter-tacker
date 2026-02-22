"use client";

import {useState, useEffect} from "react";
import {Toaster} from "react-hot-toast";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Stars from "@/components/layout/Stars";
import {useGetCurrentUser, useNotLoggedIn} from "@/hooks/auth-hooks";

const RAMADAN_DAY = 17;
const IFTAR_TIME = "6:24 PM";
const SIDEBAR_BREAKPOINT = 1024;

export default function DashboardShell({children}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useNotLoggedIn();
  const user = useGetCurrentUser();

  useEffect(() => {
    const handleResize = () =>
      setSidebarOpen(window.innerWidth >= SIDEBAR_BREAKPOINT);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      data-theme="noor"
      className="min-h-screen bg-base-100 text-base-content font-nunito relative"
    >
      <Stars />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        ramadanDay={RAMADAN_DAY}
        iftarTime={IFTAR_TIME}
      />

      <div
        className="min-h-screen relative z-10 transition-all duration-300"
        style={{marginLeft: sidebarOpen ? 240 : 0}}
      >
        <Header
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          iftarTime={IFTAR_TIME}
        />

        <main className="p-6 pb-16">{children}</main>
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#0d1a35",
            color: "#e8d48b",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 12,
            fontFamily: "var(--font-nunito), sans-serif",
            fontSize: 14,
            fontWeight: 600,
          },
          success: {iconTheme: {primary: "#c9a84c", secondary: "#060d1f"}},
          error: {iconTheme: {primary: "#f87171", secondary: "#060d1f"}},
        }}
      />
    </div>
  );
}
