"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import MarkdownEditor from "@/components/dashboard/MarkdownEditor";

export default function CreateLowonganPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/lowongan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Gagal membuat lowongan");
      }

      router.push("/dashboard/manager/lowongan");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Buat Lowongan Baru</h1>
        <p className="text-muted-foreground">Isi detail form di bawah untuk mempublikasikan lowongan ke publik.</p>
      </div>
      
      <div className="rounded-xl border border-border bg-card text-card-foreground shadow p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md text-sm font-medium border border-red-200">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Lowongan <span className="text-red-500">*</span></Label>
              <Input id="title" name="title" placeholder="Cth: Pilot Berpengalaman Divisi Airlines" required 
                onChange={(e) => {
                  const slugInput = document.getElementById("slug") as HTMLInputElement;
                  if (slugInput && !slugInput.dataset.manual) {
                    slugInput.value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) <span className="text-red-500">*</span></Label>
              <Input id="slug" name="slug" placeholder="cth: pilot-berpengalaman" required 
                onChange={(e) => {
                  e.currentTarget.dataset.manual = "true";
                }}
              />
              <p className="text-xs text-muted-foreground">Akan terisi otomatis. Dapat diedit jika perlu.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="division">Divisi <span className="text-red-500">*</span></Label>
              <Input id="division" name="division" list="divisionList" required placeholder="Pilih atau ketik divisi baru..." />
              <datalist id="divisionList">
                <option value="Nismara Transport" />
                <option value="Nismara Airlines" />
                <option value="Nismara Racing" />
                <option value="Nismara Farm" />
                <option value="BLCK" />
                <option value="General/Management" />
              </datalist>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleType">Tipe Peran (Role) <span className="text-red-500">*</span></Label>
              <Input id="roleType" name="roleType" list="roleTypeList" required placeholder="Pilih atau ketik peran baru..." />
              <datalist id="roleTypeList">
                <option value="Driver" />
                <option value="Pilot" />
                <option value="Racer" />
                <option value="Farmer" />
                <option value="Player" />
                <option value="Staff" />
              </datalist>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tingkat Komitmen / Status</Label>
              <Input id="type" name="type" list="typeList" placeholder="Cth: Casual, Competitive..." defaultValue="Casual" />
              <datalist id="typeList">
                <option value="Casual" />
                <option value="Competitive / Esports" />
                <option value="Trainee / Academy" />
                <option value="Staff / Manajemen" />
                <option value="Volunteer" />
                <option value="Full-time" />
              </datalist>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input id="location" name="location" defaultValue="Remote" placeholder="Cth: Remote, Jakarta..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status Awal</Label>
              <select 
                id="status" 
                name="status" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Open">Langsung Buka (Open)</option>
                <option value="Draft">Simpan Saja (Draft)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Batas Waktu Lamaran (Opsional)</Label>
              <Input id="deadline" name="deadline" type="date" className="h-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi <span className="text-red-500">*</span></Label>
            <MarkdownEditor 
              id="description" 
              name="description" 
              rows={6}
              required 
              placeholder="Ceritakan tentang lowongan ini secara ringkas..." 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Persyaratan Pelamar</Label>
            <p className="text-xs text-muted-foreground">Gunakan daftar titik (bullet) atau ketik tiap syarat di baris baru.</p>
            <MarkdownEditor 
              id="requirements" 
              name="requirements" 
              rows={8}
              placeholder="- Punya minimal 100 jam terbang...&#10;- Sopan dan beretika..." 
            />
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Sedang Menyimpan..." : "Publikasikan Lowongan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
