"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type ApplicationProps = {
  _id: string;
  applicant: {
    name: string;
    discordId: string;
  };
  lowonganTitle: string;
  status: string;
  appliedAt: string;
  claimedBy?: {
    name: string;
  };
};

export default function ApplicationTable({ applications }: { applications: ApplicationProps[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Pencarian berdasarkan nama pelamar atau nama lowongan
      const matchesSearch = 
        app.applicant.name.toLowerCase().includes(search.toLowerCase()) || 
        app.lowonganTitle.toLowerCase().includes(search.toLowerCase());
      
      // Filter berdasarkan status
      const matchesStatus = statusFilter === "All" || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Input 
            placeholder="Cari nama pelamar atau posisi..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Button 
            variant={statusFilter === "All" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setStatusFilter("All")}
            className="rounded-full"
          >
            Semua
          </Button>
          <Button 
            variant={statusFilter === "Pending" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setStatusFilter("Pending")}
            className="rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200"
          >
            Pending
          </Button>
          <Button 
            variant={statusFilter === "Reviewed" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setStatusFilter("Reviewed")}
            className="rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
          >
            Reviewed
          </Button>
          <Button 
            variant={statusFilter === "Accepted" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setStatusFilter("Accepted")}
            className="rounded-full bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
          >
            Accepted
          </Button>
          <Button 
            variant={statusFilter === "Rejected" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setStatusFilter("Rejected")}
            className="rounded-full bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
          >
            Rejected
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Pelamar</TableHead>
                <TableHead>Posisi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Apply</TableHead>
                <TableHead>PIC (Manager)</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{app.applicant.name}</span>
                        <span className="text-xs text-muted-foreground">{app.applicant.discordId}</span>
                      </div>
                    </TableCell>
                    <TableCell>{app.lowonganTitle}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`
                        ${app.status === 'Accepted' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                        ${app.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                        ${app.status === 'Reviewed' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                        ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                      `}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(app.appliedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </TableCell>
                    <TableCell>
                      {app.claimedBy ? (
                        <span className="text-sm font-medium">{app.claimedBy.name}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Belum ada</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/lamaran/${app._id}`}>
                          Review
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Tidak ada lamaran yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
