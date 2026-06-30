"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain, CreditCard, FolderOpen, Home, LogOut, Settings, Sparkles, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const links = [
  { href: "/dashboard", label: "My Materials", icon: Home },
  { href: "/dashboard/favorites", label: "Favorites", icon: Star },
  { href: "/dashboard/folders", label: "Folders", icon: FolderOpen },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface DashboardSidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    plan?: string;
  };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const initials = user?.name?.[0] || user?.email?.[0]?.toUpperCase() || "?";
  const plan = user?.plan || "FREE";

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-white/10 bg-zinc-950/40 backdrop-blur-2xl">
      <div className="border-b border-white/10 p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
            <Brain className="h-5 w-5 text-white" />
            <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
          </div>
          <div>
            <span className="font-semibold tracking-tight">StudyFlow AI</span>
            <p className="text-xs text-zinc-500">Study smarter</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
          Workspace
        </p>
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-indigo-600/20 to-violet-600/10 text-white shadow-inner"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  active
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "bg-white/5 text-zinc-500 group-hover:text-zinc-300"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            {user?.image ? (
              <img
                src={user.image}
                alt=""
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-white/10"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name || "Student"}</p>
              <p className="truncate text-xs text-zinc-500">{user?.email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300">
              <Sparkles className="h-3 w-3" />
              {plan}
            </span>
            {plan === "FREE" && (
              <Link href="/pricing" className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300">
                Upgrade
              </Link>
            )}
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
