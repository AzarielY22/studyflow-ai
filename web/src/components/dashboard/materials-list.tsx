"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Globe, Loader2, Star, Trash2, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export interface Material {
  id: string;
  title: string;
  type: string;
  status: string;
  isFavorite: boolean;
  createdAt: string;
  _count?: { flashcards: number };
}

const typeIcons: Record<string, typeof FileText> = {
  PDF: FileText,
  YOUTUBE: Video,
  WEBPAGE: Globe,
};

const typeColors: Record<string, string> = {
  PDF: "from-rose-500/20 to-orange-500/10 text-rose-300",
  YOUTUBE: "from-red-500/20 to-pink-500/10 text-red-300",
  WEBPAGE: "from-cyan-500/20 to-blue-500/10 text-cyan-300",
};

interface MaterialsListProps {
  materials: Material[];
  loading: boolean;
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon?: React.ReactNode;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onDelete: (id: string) => void;
}

export function MaterialsList({
  materials,
  loading,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  onToggleFavorite,
  onDelete,
}: MaterialsListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
        <p className="mt-4 text-sm text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <Card className="border-dashed border-white/15 bg-white/[0.02]">
        <CardContent className="flex flex-col items-center py-20 text-center">
          {emptyIcon}
          <h3 className="text-xl font-semibold">{emptyTitle}</h3>
          <p className="mt-2 max-w-sm text-sm text-zinc-400">{emptyDescription}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {materials.map((material, i) => {
        const Icon = typeIcons[material.type] ?? FileText;
        const colorClass = typeColors[material.type] ?? "from-indigo-500/20 to-purple-500/10 text-indigo-300";

        return (
          <motion.div
            key={material.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="group relative overflow-hidden border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-indigo-500/10">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => onToggleFavorite(material.id, material.isFavorite)}
                      className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-yellow-500/10 hover:text-yellow-400"
                    >
                      <Star className={`h-4 w-4 ${material.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    </button>
                    <button
                      onClick={() => onDelete(material.id)}
                      className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Link href={`/dashboard/materials/${material.id}`} className="mt-4 block">
                  <h3 className="line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-indigo-300">
                    {material.title}
                  </h3>
                </Link>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                    {material.type}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                      material.status === "COMPLETED"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : material.status === "PROCESSING"
                        ? "bg-amber-500/15 text-amber-400"
                        : material.status === "FAILED"
                        ? "bg-red-500/15 text-red-400"
                        : "bg-white/5 text-zinc-500"
                    }`}
                  >
                    {material.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-zinc-500">
                  <span>{formatDate(material.createdAt)}</span>
                  {material._count && <span>{material._count.flashcards} flashcards</span>}
                </div>
                <Link
                  href={`/dashboard/materials/${material.id}`}
                  className="mt-4 flex items-center gap-1 text-xs font-medium text-indigo-400 opacity-0 transition-all group-hover:opacity-100"
                >
                  Continue studying
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
