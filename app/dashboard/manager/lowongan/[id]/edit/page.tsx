"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import MarkdownEditor from "@/components/dashboard/MarkdownEditor";


export default function EditLowonganPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/lowongan/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data lowongan");
        return res.json();
      })
      .then((json) => {
        setData(json);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const updatedData = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`/api/lowongan/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Gagal mengupdate lowongan");
      }

      router.push("/dashboard/manager/lowongan");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="text-center py-20 text-red-500">
        <p>Error: {error}</p>
        <Button
          onClick={() => router.back()}
          className="mt-4"
          variant="outline"
        >
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Edit Lowongan</h1>
        <p className="text-muted-foreground">
          Perbarui informasi lowongan ini.
        </p>
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
              <Label htmlFor="title">
                Judul Lowongan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={data.title}
                required
                onChange={(e) => {
                  const slugInput = document.getElementById(
                    "slug",
                  ) as HTMLInputElement;
                  if (slugInput && !slugInput.dataset.manual) {
                    slugInput.value = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "");
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug (URL) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={data.slug}
                required
                onChange={(e) => {
                  e.currentTarget.dataset.manual = "true";
                }}
              />
              <p className="text-xs text-muted-foreground">
                Ubah jika perlu, pastikan unik.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="division">
                Divisi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="division"
                name="division"
                list="divisionList"
                defaultValue={data.division}
                required
                placeholder="Pilih atau ketik divisi baru..."
              />
              <datalist id="divisionList">
                <option value="Nismara Transport" />
                <option value="Nismara Airlines" />
                <option value="Nismara Racing" />
                <option value="Nismara Farm" />
                <option value="BLCK" />
                <option value="Rice Kencur" />
                <option value="General/Management" />
              </datalist>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleType">
                Tipe Peran (Role) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="roleType"
                name="roleType"
                list="roleTypeList"
                defaultValue={data.roleType}
                required
                placeholder="Pilih atau ketik peran baru..."
              />
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
              <Input
                id="type"
                name="type"
                list="typeList"
                defaultValue={data.type || "Casual"}
                placeholder="Cth: Casual, Competitive..."
              />
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
              <Input
                id="location"
                name="location"
                defaultValue={data.location}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={data.status}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Open">Langsung Buka (Open)</option>
                <option value="Closed">Tutup (Closed)</option>
                <option value="Draft">Simpan Saja (Draft)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Batas Waktu Lamaran (Opsional)</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                className="h-10"
                defaultValue={
                  data.deadline
                    ? new Date(data.deadline).toISOString().split("T")[0]
                    : ""
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Deskripsi <span className="text-red-500">*</span>
            </Label>
            <MarkdownEditor
              id="description"
              name="description"
              rows={6}
              required
              defaultValue={data.description}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Persyaratan Pelamar</Label>
            <p className="text-xs text-muted-foreground">
              Gunakan daftar titik (bullet) atau ketik tiap syarat di baris
              baru.
            </p>
            <MarkdownEditor
              id="requirements"
              name="requirements"
              rows={8}
              defaultValue={
                data.requirements ? data.requirements.join("\n") : ""
              }
            />
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSaving} className="flex-1">
              {isSaving ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
