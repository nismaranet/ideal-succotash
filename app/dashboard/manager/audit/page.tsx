"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BackButton } from "@/components/BackButton";

export default function AuditSearchPage() {
  const [discordId, setDiscordId] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (discordId.trim()) {
      router.push(`/dashboard/manager/audit/${discordId.trim()}`);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in-up mt-8">
      <div className="flex items-center justify-between mb-8">
        <BackButton fallbackUrl="/dashboard/manager" iconOnly={false} size="default" />
      </div>

      <Card className="border-border shadow-md">
        <CardHeader className="text-center pb-8 pt-10">
          <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/5">
            <Shield className="size-10 text-primary" />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">Audit Member Nismara</CardTitle>
          <CardDescription className="text-base mt-3 max-w-md mx-auto">
            Pencarian manual profil anggota. Masukkan Discord ID pengguna untuk melihat status, role, histori Trucky, dan riwayat lamarannya.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 md:px-10 pb-8">
          <form onSubmit={handleSearch} className="flex flex-col gap-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
              <Input
                type="text"
                placeholder="Contoh: 312345678901234567"
                value={discordId}
                onChange={(e) => setDiscordId(e.target.value)}
                className="pl-12 h-14 text-lg border-2 focus-visible:ring-offset-2 transition-all"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="h-14 w-full text-md font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              disabled={!discordId.trim()}
            >
              <Search className="mr-2 size-5" />
              Cari & Audit Member
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 bg-muted/20 py-5 text-sm text-muted-foreground text-center px-6">
          <p>
            TIPS: Pastikan kamu memasukkan <strong>Discord ID</strong> (berupa 18-19 digit angka), bukan username.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
