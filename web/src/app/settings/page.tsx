"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Bell, BookOpen, CreditCard, Database, Loader2, LogOut, Moon, Palette,
  Save, Shield, Sparkles, Trash2, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { formatDate, getPlanLimits } from "@/lib/utils";

interface UserSettings {
  name: string | null;
  email: string;
  image: string | null;
  plan: "FREE" | "PRO" | "PREMIUM";
  scansUsed: number;
  scansResetAt: string;
  createdAt: string;
  defaultSummaryType: string;
  defaultQuizDifficulty: string;
  defaultQuizCount: number;
  emailNotifications: boolean;
  studyReminders: boolean;
  productUpdates: boolean;
  theme: string;
  _count: { materials: number; folders: number };
  limits: { scans: number | "unlimited"; aiChat: boolean; export: boolean };
}

type Section = "profile" | "subscription" | "study" | "notifications" | "appearance" | "data";

const sections: { id: Section; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "study", label: "Study Defaults", icon: BookOpen },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "data", label: "Data & Privacy", icon: Database },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState<Section>("profile");

  const [name, setName] = useState("");
  const [summaryType, setSummaryType] = useState("QUICK");
  const [quizDifficulty, setQuizDifficulty] = useState("MEDIUM");
  const [quizCount, setQuizCount] = useState(10);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [studyReminders, setStudyReminders] = useState(false);
  const [productUpdates, setProductUpdates] = useState(true);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    fetch("/api/user/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setName(data.name ?? "");
        setSummaryType(data.defaultSummaryType ?? "QUICK");
        setQuizDifficulty(data.defaultQuizDifficulty ?? "MEDIUM");
        setQuizCount(data.defaultQuizCount ?? 10);
        setEmailNotifications(data.emailNotifications ?? true);
        setStudyReminders(data.studyReminders ?? false);
        setProductUpdates(data.productUpdates ?? true);
        setTheme(data.theme ?? "dark");
        applyTheme(data.theme ?? "dark");
      })
      .finally(() => setLoading(false));
  }, []);

  const applyTheme = (t: string) => {
    const root = document.documentElement;
    if (t === "light") root.classList.remove("dark");
    else root.classList.add("dark");
  };

  const save = async (partial?: Record<string, unknown>) => {
    setSaving(true);
    setMessage("");
    try {
      const body = partial ?? {
        name: name.trim(),
        defaultSummaryType: summaryType,
        defaultQuizDifficulty: quizDifficulty,
        defaultQuizCount: quizCount,
        emailNotifications,
        studyReminders,
        productUpdates,
        theme,
      };
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save");
      setMessage("Settings saved successfully.");
      if (body.theme) applyTheme(body.theme as string);
    } catch {
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const clearData = async (action: "materials" | "folders") => {
    const labels = { materials: "all study materials", folders: "all folders" };
    if (!confirm(`Delete ${labels[action]}? This cannot be undone.`)) return;
    await fetch(`/api/user/settings?action=${action}`, { method: "DELETE" });
    const res = await fetch("/api/user/settings");
    setSettings(await res.json());
    setMessage(`${labels[action]} deleted.`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
      </div>
    );
  }

  const planLimits = settings ? getPlanLimits(settings.plan) : getPlanLimits("FREE");
  const scansRemaining =
    settings?.limits.scans === "unlimited"
      ? "Unlimited"
      : Math.max(0, (settings?.limits.scans as number) - (settings?.scansUsed ?? 0));

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="mb-2 text-sm font-medium text-indigo-400">Settings</p>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="mt-2 text-zinc-400">Manage your profile, preferences, and account.</p>
      </motion.div>

      {message && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-300">
          {message}
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar nav */}
        <nav className="flex shrink-0 gap-2 overflow-x-auto lg:w-52 lg:flex-col">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                activeSection === id
                  ? "bg-indigo-600/20 text-indigo-300"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 space-y-6">
          {/* Profile */}
          {activeSection === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your public identity on StudyFlow AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {settings?.image && (
                  <div className="flex items-center gap-4">
                    <img src={settings.image} alt="" className="h-16 w-16 rounded-2xl ring-2 ring-white/10" />
                    <p className="text-sm text-zinc-400">Photo from your Google account</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-zinc-400">Display name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Email</label>
                  <Input value={settings?.email ?? ""} disabled className="mt-1.5 opacity-60" />
                  <p className="mt-1 text-xs text-zinc-500">Managed through Google sign-in</p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                  <span className="text-zinc-400">Member since</span>
                  <span>{settings ? formatDate(settings.createdAt) : "—"}</span>
                </div>
                <Button onClick={() => save()} disabled={saving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Subscription */}
          {activeSection === "subscription" && (
            <Card>
              <CardHeader>
                <CardTitle>Subscription & Usage</CardTitle>
                <CardDescription>Your current plan and scan limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-4">
                  <div>
                    <p className="text-sm text-indigo-300">Current plan</p>
                    <p className="text-2xl font-bold">{settings?.plan ?? "FREE"}</p>
                  </div>
                  <Sparkles className="h-8 w-8 text-indigo-400" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-xs text-zinc-500">Scans used</p>
                    <p className="text-xl font-semibold">{settings?.scansUsed ?? 0}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-xs text-zinc-500">Scans remaining</p>
                    <p className="text-xl font-semibold">{scansRemaining}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-xs text-zinc-500">Study materials</p>
                    <p className="text-xl font-semibold">{settings?._count.materials ?? 0}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-xs text-zinc-500">Folders</p>
                    <p className="text-xl font-semibold">{settings?._count.folders ?? 0}</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>• Flashcards: {planLimits.flashcards === Infinity ? "Unlimited" : `Up to ${planLimits.flashcards}`}</li>
                  <li>• Quiz questions: Up to {planLimits.quizQuestions}</li>
                  <li>• AI chat: {planLimits.aiChat ? "Enabled" : "Pro plan required"}</li>
                  <li>• Export: {planLimits.export ? "Enabled" : "Premium plan required"}</li>
                </ul>
                <div className="flex flex-wrap gap-3">
                  {settings?.plan === "FREE" && (
                    <Link href="/pricing">
                      <Button>Upgrade Plan</Button>
                    </Link>
                  )}
                  <Link href="/billing">
                    <Button variant="secondary">Manage Billing</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Study defaults */}
          {activeSection === "study" && (
            <Card>
              <CardHeader>
                <CardTitle>Study Defaults</CardTitle>
                <CardDescription>Default options when scanning new content from the extension</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Summary style</label>
                  <p className="mb-2 text-xs text-zinc-500">How detailed summaries should be by default</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {["QUICK", "DETAILED", "BEGINNER", "COLLEGE"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSummaryType(t)}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                          summaryType === t
                            ? "border-indigo-500 bg-indigo-600/20 text-indigo-300"
                            : "border-white/10 text-zinc-400 hover:bg-white/5"
                        }`}
                      >
                        {t.charAt(0) + t.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Quiz difficulty</label>
                  <div className="mt-2 flex gap-2">
                    {["EASY", "MEDIUM", "HARD"].map((d) => (
                      <button
                        key={d}
                        onClick={() => setQuizDifficulty(d)}
                        className={`rounded-xl border px-4 py-2 text-xs font-medium transition-all ${
                          quizDifficulty === d
                            ? "border-indigo-500 bg-indigo-600/20 text-indigo-300"
                            : "border-white/10 text-zinc-400 hover:bg-white/5"
                        }`}
                      >
                        {d.charAt(0) + d.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Quiz length</label>
                  <div className="mt-2 flex gap-2">
                    {[10, 20, 50].map((n) => (
                      <button
                        key={n}
                        onClick={() => setQuizCount(n)}
                        className={`rounded-xl border px-4 py-2 text-xs font-medium transition-all ${
                          quizCount === n
                            ? "border-indigo-500 bg-indigo-600/20 text-indigo-300"
                            : "border-white/10 text-zinc-400 hover:bg-white/5"
                        }`}
                      >
                        {n} questions
                      </button>
                    ))}
                  </div>
                  {settings?.plan === "FREE" && (
                    <p className="mt-2 text-xs text-amber-400/80">Free plan is limited to 10 questions per quiz</p>
                  )}
                </div>
                <Button onClick={() => save()} disabled={saving} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Study Defaults
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          {activeSection === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose what emails you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { label: "Email notifications", desc: "Important account and security alerts", value: emailNotifications, set: setEmailNotifications },
                  { label: "Study reminders", desc: "Reminders to review your flashcards", value: studyReminders, set: setStudyReminders },
                  { label: "Product updates", desc: "New features and improvements", value: productUpdates, set: setProductUpdates },
                ].map(({ label, desc, value, set }) => (
                  <div key={label} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-zinc-500">{desc}</p>
                    </div>
                    <Switch checked={value} onCheckedChange={set} />
                  </div>
                ))}
                <Button onClick={() => save()} disabled={saving} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Notifications
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Appearance */}
          {activeSection === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how StudyFlow looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {[
                      { id: "dark", label: "Dark", icon: Moon },
                      { id: "light", label: "Light", icon: Palette },
                      { id: "system", label: "System", icon: Shield },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setTheme(id)}
                        className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                          theme === id
                            ? "border-indigo-500 bg-indigo-600/20 text-indigo-300"
                            : "border-white/10 text-zinc-400 hover:bg-white/5"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={() => save()} disabled={saving} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Appearance
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Data & privacy */}
          {activeSection === "data" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Control your stored study content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <div>
                      <p className="text-sm font-medium">Study materials</p>
                      <p className="text-xs text-zinc-500">{settings?._count.materials ?? 0} items stored</p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-2 text-red-400 hover:bg-red-500/10"
                      onClick={() => clearData("materials")}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete all
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <div>
                      <p className="text-sm font-medium">Folders</p>
                      <p className="text-xs text-zinc-500">{settings?._count.folders ?? 0} folders</p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-2 text-red-400 hover:bg-red-500/10"
                      onClick={() => clearData("folders")}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete all
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-red-400">Account</CardTitle>
                  <CardDescription>Sign out or manage your account</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/" })} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                  <Link href="/privacy">
                    <Button variant="ghost" size="sm">Privacy Policy</Button>
                  </Link>
                  <Link href="/terms">
                    <Button variant="ghost" size="sm">Terms of Service</Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
