"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MaterialsList, type Material } from "@/components/dashboard/materials-list";

export default function FavoritesPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/scan")
      .then((r) => r.json())
      .then((data) => setMaterials(Array.isArray(data) ? data.filter((m: Material) => m.isFavorite) : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = materials.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    await fetch(`/api/materials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: !isFavorite }),
    });
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const deleteMaterial = async (id: string) => {
    if (!confirm("Delete this study set?")) return;
    await fetch(`/api/materials/${id}`, { method: "DELETE" });
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="mb-2 text-sm font-medium text-amber-400">Favorites</p>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">Starred Materials</h1>
        <p className="mt-2 text-zinc-400">Quick access to your most important study sets.</p>
      </motion.div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Search favorites..."
          className="border-white/10 bg-white/5 pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <MaterialsList
        materials={filtered}
        loading={loading}
        emptyTitle="No favorites yet"
        emptyDescription="Star any material from your dashboard to pin it here for quick access."
        emptyIcon={
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15">
            <Star className="h-8 w-8 text-amber-400" />
          </div>
        }
        onToggleFavorite={toggleFavorite}
        onDelete={deleteMaterial}
      />
    </div>
  );
}
