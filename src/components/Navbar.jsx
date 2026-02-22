import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import Link from "next/link";
import {ChevronRight, Moon, LayoutDashboard, LogOut} from "lucide-react";
import NavbarClient from "@/components/NavbarClient";

export default async function Navbar() {
  const session = await auth.api.getSession({headers: await headers()});
  const user = session?.user ?? null;

  return (
    <nav
      className="nav-blur sticky top-0 z-50 border-b border-secondary/20"
      style={{background: "rgba(6,13,31,0.75)"}}
    >
      <div className="max-w-8xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <Moon
              size={22}
              className="crescent"
              color="#c9a84c"
              fill="#c9a84c"
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: "0 0 20px rgba(201,168,76,0.5)",
                animation: "glow-pulse 3s ease-in-out infinite",
              }}
            />
          </div>
          <span className="gold-shimmer font-amiri text-2xl font-bold tracking-wide">
            Noor
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it works", "Settlement"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm font-semibold text-base-content/50 hover:text-primary transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        {user ? (
          <NavbarClient
            user={{name: user.name, avatar: user.image, role: user.role}}
          />
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="btn btn-ghost btn-sm font-semibold text-primary border border-secondary/30 hover:border-primary/40 hover:bg-primary/5 rounded-xl"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn btn-primary btn-sm font-bold rounded-xl gap-1.5 animated-border"
              style={{background: "linear-gradient(135deg, #c9a84c, #a07830)"}}
            >
              Get Started
              <ChevronRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
