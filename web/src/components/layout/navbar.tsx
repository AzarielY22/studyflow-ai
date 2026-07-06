"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Brain, LayoutDashboard, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/support", label: "Support" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const isAuthenticated = status === "authenticated" && !!session?.user;

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  const authButtons = isAuthenticated ? (
    <>
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="gap-2">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Button>
      </Link>
      <Link href="/dashboard">
        <Button size="sm" className="max-w-[160px] truncate">
          {session.user.name?.split(" ")[0] || session.user.email?.split("@")[0] || "Account"}
        </Button>
      </Link>
    </>
  ) : (
    <>
      <Link href="/login">
        <Button variant="ghost" size="sm">Log in</Button>
      </Link>
      <Link href="/login">
        <Button size="sm">Start Free</Button>
      </Link>
    </>
  );

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 font-semibold">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span>StudyFlow AI</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors hover:text-indigo-400",
                pathname === link.href ? "text-indigo-400" : "text-zinc-400"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-white/10" />
          ) : (
            authButtons
          )}
        </div>

        <button
          className="rounded-lg p-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-background/95 px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm text-zinc-400"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            {status === "loading" ? (
              <div className="h-10 animate-pulse rounded-lg bg-white/10" />
            ) : isAuthenticated ? (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button className="w-full gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Start Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
