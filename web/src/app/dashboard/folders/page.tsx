"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderOpen, Loader2, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MaterialsList, type Material } from "@/components/dashboard/materials-list";

interface Folder {
  id: string;
  name: string;
  _count: { materials: number };
  materials?: Material[];
}

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadFolders = () => {
    fetch("/api/folders")
      .then((r) => r.json())
      .then((data) => setFolders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFolders();
  }, []);

  const openFolder = async (folder: Folder) => {
    const res = await fetch(`/api/folders/${folder.id}`);
    const data = await res.json();
    setSelectedFolder(data);
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });
      const folder = await res.json();
      if (res.ok) {
        setFolders((prev) => [folder, ...prev]);
        setNewFolderName("");
      }
    } finally {
      setCreating(false);
    }
  };

  const deleteFolder = async (id: string) => {
    if (!confirm("Delete this folder? Materials won't be deleted.")) return;
    await fetch(`/api/folders/${id}`, { method: "DELETE" });
    setFolders((prev) => prev.filter((f) => f.id !== id));
    if (selectedFolder?.id === id) setSelectedFolder(null);
  };

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    await fetch(`/api/materials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: !isFavorite }),
    });
    if (selectedFolder) openFolder(selectedFolder);
  };

  const deleteMaterial = async (id: string) => {
    if (!confirm("Delete this study set?")) return;
    await fetch(`/api/materials/${id}`, { method: "DELETE" });
    if (selectedFolder) openFolder(selectedFolder);
  };

  if (selectedFolder) {
    return (
      <div className="space-y-8">
        <div>
          <button
            onClick={() => setSelectedFolder(null)}
            className="mb-4 text-sm text-zinc-500 hover:text-indigo-400"
          >
            ← Back to folders
          </button>
          <h1 className="text-3xl font-bold tracking-tight">{selectedFolder.name}</h1>
          <p className="mt-2 text-zinc-400">
            {selectedFolder.materials?.length ?? 0} materials in this folder
          </p>
        </div>
        <MaterialsList
          materials={selectedFolder.materials ?? []}
          loading={false}
          emptyTitle="Folder is empty"
          emptyDescription="Move materials into this folder from your dashboard."
          emptyIcon={
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15">
              <FolderOpen className="h-8 w-8 text-indigo-400" />
            </div>
          }
          onToggleFavorite={toggleFavorite}
          onDelete={deleteMaterial}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="mb-2 text-sm font-medium text-indigo-400">Organize</p>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">Folders</h1>
        <p className="mt-2 text-zinc-400">Group your study materials by subject or topic.</p>
      </motion.div>

      <div className="flex gap-3">
        <Input
          placeholder="New folder name..."
          className="max-w-xs border-white/10 bg-white/5"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createFolder()}
        />
        <Button onClick={createFolder} disabled={creating || !newFolderName.trim()} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Folder
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
        </div>
      ) : folders.length === 0 ? (
        <Card className="border-dashed border-white/15 bg-white/[0.02]">
          <CardContent className="flex flex-col items-center py-20 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15">
              <FolderOpen className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold">No folders yet</h3>
            <p className="mt-2 text-sm text-zinc-400">Create a folder to organize your study materials.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => (
            <Card
              key={folder.id}
              className="group cursor-pointer border-white/10 bg-white/[0.03] transition-all hover:border-indigo-500/30 hover:bg-white/[0.06]"
              onClick={() => openFolder(folder)}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                  <FolderOpen className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold group-hover:text-indigo-300">{folder.name}</h3>
                  <p className="text-xs text-zinc-500">{folder._count.materials} materials</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFolder(folder.id);
                  }}
                  className="rounded-lg p-2 text-zinc-600 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
