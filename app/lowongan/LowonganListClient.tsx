"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Building2, Clock, ArrowRight, Briefcase } from "lucide-react";

interface LowonganItem {
  _id: string;
  title: string;
  slug: string;
  division: string;
  roleType: string;
  location: string;
  type: string;
  deadline: string | null;
  description: string;
}

export default function LowonganListClient({ data }: { data: LowonganItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDivision, setFilterDivision] = useState("");

  const filteredData = data.filter((item) => {
    const matchSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.roleType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDivision = filterDivision ? item.division === filterDivision : true;
    return matchSearch && matchDivision;
  });

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Cari posisi atau tipe peran (contoh: Pilot, Driver)..."
            className="pl-12 h-12 text-base bg-background border-border/50 focus-visible:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="flex h-12 w-full md:w-64 rounded-md border border-border/50 bg-background px-4 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
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

      {/* Results */}
      {filteredData.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border border-dashed shadow-sm">
          <div className="bg-muted/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Tidak ada lowongan ditemukan</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Kami tidak menemukan lowongan yang sesuai dengan kata kunci atau divisi yang kamu pilih. Coba gunakan kata kunci yang lebih umum.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((pos) => {
            // Hitung sisa hari jika ada deadline
            let sisaHari = null;
            if (pos.deadline) {
              const diffTime = new Date(pos.deadline).getTime() - Date.now();
              sisaHari = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }

            return (
              <Link
                key={pos._id}
                href={`/lowongan/${pos.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Aksen atas */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
                      pos.type === "Full-time"
                        ? "bg-primary/10 text-primary"
                        : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    <Clock className="size-3.5" />
                    {pos.type}
                  </span>
                  
                  {sisaHari !== null && sisaHari > 0 ? (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full">
                      Sisa {sisaHari} Hari
                    </span>
                  ) : sisaHari !== null && sisaHari <= 0 ? (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                      Ditutup
                    </span>
                  ) : null}
                </div>

                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                  {pos.title}
                </h3>
                
                <div className="mt-4 mb-auto flex flex-wrap gap-2 pb-2">
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium bg-muted/50 w-fit px-2.5 py-1 rounded-md">
                     <Building2 className="size-4 text-primary/70" /> {pos.division}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium bg-muted/50 w-fit px-2.5 py-1 rounded-md">
                     <Briefcase className="size-4 text-primary/70" /> {pos.roleType}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                    <MapPin className="size-4 text-foreground/50" />
                    {pos.location}
                  </div>

                  <div className="flex items-center text-sm font-bold text-primary opacity-80 group-hover:opacity-100 transition-all">
                    Lihat Detail
                    <ArrowRight className="size-4 ml-1.5 -translate-x-2 transition-transform duration-300 group-hover:translate-x-0" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
