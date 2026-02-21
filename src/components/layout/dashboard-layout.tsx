"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenSquare,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-slate-950 font-sans selection:bg-indigo-500/30 text-white">
      {/* Premium Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-slate-950/50 backdrop-blur-xl hidden md:flex flex-col z-50">
        {/* Brand Area */}
        <div className="h-24 flex items-center px-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
              <img
                src="/logo.png"
                alt="Nexus Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400 tracking-tight">
              Nexus
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 mt-4 flex-1">
          <NavLink
            href="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Overview"
            active={pathname === "/dashboard"}
          />
          <NavLink
            href="/dashboard/create"
            icon={<PenSquare size={20} />}
            label="Create Post"
            active={pathname === "/dashboard/create"}
          />
          <NavLink
            href="/dashboard/schedule"
            icon={<Calendar size={20} />}
            label="Calendar"
            active={pathname === "/dashboard/schedule"}
          />
          <NavLink
            href="/dashboard/settings"
            icon={<Settings size={20} />}
            label="Connections"
            active={pathname === "/dashboard/settings"}
          />
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-white/5">
          <div
            onClick={() => signOut()}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5"
          >
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 border-2 border-slate-900 ring-2 ring-white/10 flex items-center justify-center text-xs font-bold uppercase">
              {user?.email?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-200 group-hover:text-white transition-colors">
                {user?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-xs text-indigo-400 font-medium truncate">
                Pro Plan
              </p>
            </div>
            <LogOut
              size={18}
              className="text-slate-500 group-hover:text-red-400 transition-colors"
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area with subtle cosmic background */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-slate-950">
        {/* Ambient Background Glows */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-b from-indigo-900/10 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex-1 overflow-y-auto z-10 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 border border-transparent ${
        active
          ? "bg-white/5 text-white border-white/5 shadow-lg shadow-indigo-500/5"
          : "text-slate-400 hover:bg-white/5 hover:text-white hover:border-white/5"
      }`}
    >
      <div className="flex items-center gap-3.5">
        <span
          className={`group-hover:scale-110 transition-all duration-300 ${active ? "text-indigo-400" : "group-hover:text-indigo-400"}`}
        >
          {icon}
        </span>
        {label}
      </div>
      <ChevronRight
        size={14}
        className={`transition-all duration-300 ${
          active
            ? "opacity-100 translate-x-0 text-slate-400"
            : "opacity-0 -translate-x-2 text-slate-600 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-slate-400"
        }`}
      />
    </Link>
  );
}
