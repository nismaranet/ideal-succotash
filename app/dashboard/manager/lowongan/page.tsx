"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface LowonganType {
  _id: string;
  title: string;
  slug: string;
  division: string;
  roleType: string;
  status: string;
  deadline?: string;
  createdBy?: { name: string; discordId: string };
  updatedBy?: { name: string; discordId: string };
  createdAt: string;
}

export default function KelolaLowonganPage() {
  const [data, setData] = useState<LowonganType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDivision, setFilterDivision] = useState("");

  useEffect(() => {
    fetch("/api/lowongan")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data");
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
  }, []);

  const filteredData = data.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.roleType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDivision = filterDivision ? item.division === filterDivision : true;
    return matchSearch && matchDivision;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Lowongan</h1>
          <p className="text-muted-foreground">Manajemen seluruh lowongan aktif dan nonaktif Nismara Group.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/manager/lowongan/create">
            <Plus className="mr-2 size-4" />
            Buat Lowongan
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari judul atau role..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
          >
            <option value="">Semua Divisi</option>
            <option value="Nismara Transport">Nismara Transport</option>
            <option value="Nismara Airlines">Nismara Airlines</option>
            <option value="Nismara Racing">Nismara Racing</option>
            <option value="Nismara Farm">Nismara Farm</option>
            <option value="BLCK">BLCK</option>
            <option value="Rice Kencur">Rice Kencur</option>
            <option value="General/Management">General/Management</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p>Memuat lowongan...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            Belum ada lowongan yang dibuat. Silakan klik tombol "Buat Lowongan".
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b border-border">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Judul</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Divisi</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tipe Peran</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Dibuat Oleh</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Batas Waktu</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredData.map((item) => (
                  <tr key={item._id} className="border-b border-border transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{item.title}</td>
                    <td className="p-4 align-middle">{item.division}</td>
                    <td className="p-4 align-middle text-muted-foreground">{item.roleType}</td>
                    <td className="p-4 align-middle text-muted-foreground">{item.createdBy?.name || "System"}</td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {item.deadline ? new Date(item.deadline).toLocaleDateString('id-ID') : "-"}
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant={item.status === "Open" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex flex-col gap-2 mb-1 items-end">
                        <Button asChild variant="default" size="sm" className="w-28 text-xs h-7">
                          <Link href={`/dashboard/manager/lowongan/${item._id}/form`}>Rakit Formulir</Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="w-28 text-xs h-7">
                          <Link href={`/dashboard/manager/lowongan/${item._id}/edit`}>Edit Metadata</Link>
                        </Button>
                      </div>
                      {item.updatedBy && (
                        <div className="text-[10px] text-muted-foreground">
                          Diedit oleh {item.updatedBy.name}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
