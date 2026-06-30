"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Layers, Loader2, Search, Sparkles, Star, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MaterialsList, type Material } from "@/components/dashboard/materials-list";

const filters = ["ALL", "PDF", "YOUTUBE", "WEBPAGE"] as const;

export function DashboardContent() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/scan")
      .then((r) => r.json())
      .then(setMaterials)
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => ({
    total: materials.length,
    completed: materials.filter((m) => m.status === "COMPLETED").length,
    flashcards: materials.reduce((sum, m) => sum + (m._count?.flashcards ?? 0), 0),
    favorites: materials.filter((m) => m.isFavorite).length,
  }), [materials]);

  const filtered = materials.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || m.type === filter;
    return matchesSearch && matchesFilter;
  });

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    await fetch(`/api/materials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: !isFavorite }),
    });
    setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, isFavorite: !isFavorite } : m)));
  };

  const deleteMaterial = async (id: string) => {
    if (!confirm("Delete this study set?")) return;
    await fetch(`/api/materials/${id}`, { method: "DELETE" });
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="mb-2 text-sm font-medium text-indigo-400">Dashboard</p>
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">My Study Materials</h1>
          <p className="mt-2 max-w-xl text-zinc-400">
            Everything you&apos;ve scanned — summaries, flashcards, and quizzes in one place.
          </p>
        </motion.div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search materials..."
            className="border-white/10 bg-white/5 pl-10 backdrop-blur-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Materials", value: stats.total, icon: Layers, iconClass: "bg-indigo-500/15 text-indigo-400" },
          { label: "Completed", value: stats.completed, icon: Zap, iconClass: "bg-emerald-500/15 text-emerald-400" },
          { label: "Flashcards", value: stats.flashcards, icon: Brain, iconClass: "bg-violet-500/15 text-violet-400" },
          { label: "Favorites", value: stats.favorites, icon: Star, iconClass: "bg-amber-500/15 text-amber-400" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-white/10 bg-white/[0.03]">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              filter === f
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                : "border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <MaterialsList
        materials={filtered}
        loading={loading}
        emptyTitle="No study materials yet"
        emptyDescription="Install the Chrome extension and scan a PDF, YouTube video, or webpage to get started."
        emptyIcon={
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20">
            <Sparkles className="h-8 w-8 text-indigo-400" />
          </div>
        }
        onToggleFavorite={toggleFavorite}
        onDelete={deleteMaterial}
      />
    </div>
  );
}
