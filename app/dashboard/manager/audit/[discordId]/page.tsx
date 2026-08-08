import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";
import Link from "next/link";
import { ArrowLeft, User, Shield, Briefcase, Award, TrendingUp, AlertCircle, FileText, History } from "lucide-react";
import dbConnect from "@/lib/mongoose";
import { Application } from "@/models/Application";

async function getDiscordMember(discordId: string) {
  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordId}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 300 } // Cache 5 menit
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch Discord member:", error);
    return null;
  }
}

async function getDiscordRoles() {
  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/roles`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 3600 } // Cache 1 jam
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch Discord roles:", error);
    return [];
  }
}

async function getNismaraTransportUser(discordId: string) {
  try {
    const res = await fetch(`${process.env.NISMARA_TRANSPORT_URL}/api/users/${discordId}`, {
      headers: {
        Authorization: `Bearer ${process.env.NISMARA_SECRET_API}`,
      },
      cache: "no-store", 
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch Nismara Transport user:", error);
    return null;
  }
}

async function getLamaranHistory(discordId: string) {
  try {
    await dbConnect();
    const lamaran = await Application.find({ "applicant.discordId": discordId })
      .sort({ appliedAt: -1 })
      .lean();
    return lamaran as any[];
  } catch (error) {
    console.error("Failed to fetch Lamaran history:", error);
    return [];
  }
}

export default async function AuditUserPage({ params }: { params: Promise<{ discordId: string }> }) {
  const resolvedParams = await params;
  const discordId = resolvedParams.discordId;

  const [discordMember, allRoles, nismaraData, lamaranHistory] = await Promise.all([
    getDiscordMember(discordId),
    getDiscordRoles(),
    getNismaraTransportUser(discordId),
    getLamaranHistory(discordId)
  ]);

  // Map role by ID untuk mencari nama dan warna
  const roleMap = new Map<string, { name: string; color: number }>(
    allRoles.map((r: any) => [r.id, { name: r.name, color: r.color }])
  );

  const memberRoles = discordMember?.roles?.map((roleId: string) => {
    const roleInfo = roleMap.get(roleId);
    return {
      id: roleId,
      name: roleInfo?.name || "Unknown Role",
      color: roleInfo?.color ? `#${roleInfo.color.toString(16).padStart(6, '0')}` : "#99aab5"
    };
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton variant="outline" size="icon" className="rounded-full" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Pelamar</h1>
          <p className="text-muted-foreground">
            Mengecek informasi profil, role discord, dan riwayat di Nismara Transport
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Discord Profile Card */}
        <Card className="md:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Profil Discord
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {discordMember ? (
              <>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                    {discordMember.user.avatar ? (
                      <AvatarImage src={`https://cdn.discordapp.com/avatars/${discordMember.user.id}/${discordMember.user.avatar}.png`} />
                    ) : null}
                    <AvatarFallback className="text-2xl font-semibold">{discordMember.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-center space-y-1">
                    <h3 className="font-semibold text-xl">{discordMember.user.global_name || discordMember.user.username}</h3>
                    <p className="text-sm text-muted-foreground font-medium">@{discordMember.user.username}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    Discord Roles ({memberRoles.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {memberRoles.length > 0 ? (
                      memberRoles.map((role: any) => (
                        <Badge 
                          key={role.id} 
                          variant="outline" 
                          style={{ borderColor: role.color, color: role.color }}
                          className="bg-opacity-10 py-1"
                        >
                          {role.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Tidak ada role</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-6 text-muted-foreground flex flex-col items-center justify-center min-h-[200px] border border-dashed rounded-lg">
                <AlertCircle className="h-8 w-8 mb-3 text-muted-foreground/50" />
                <p className="font-medium">User tidak ditemukan</p>
                <p className="text-xs mt-1">User belum join server Discord</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nismara Transport Profile Card */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="h-5 w-5 text-primary" />
                Data Nismara Transport
              </CardTitle>
              <CardDescription>
                Informasi member yang disinkronisasi dari Nismara Transport
              </CardDescription>
            </CardHeader>
            <CardContent>
              {nismaraData?.user ? (
                <div className="space-y-6">
                  {/* Status & Level */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg border">
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Level</p>
                      <p className="font-bold text-2xl">{nismaraData.user.level}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nismara Coin</p>
                      <p className="font-bold text-2xl text-primary">{Math.floor(nismaraData.user.nc).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Trucky ID</p>
                      <p className="font-bold text-2xl">{nismaraData.user.truckyId}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                      <div className="pt-1">
                        <Badge variant={nismaraData.user.isDriver ? "default" : "secondary"}>
                          {nismaraData.user.isDriver ? "Aktif (Driver)" : "Non-Aktif"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Trucky Stats */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      Trucky Data
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-lg border p-4 flex flex-col gap-2 shadow-sm transition-colors hover:bg-muted/30">
                        <span className="text-sm font-medium text-muted-foreground">Rank Driver</span>
                        <span className="font-bold text-lg" style={{ color: nismaraData.user.truckyRankColor || 'inherit' }}>
                          {nismaraData.user.truckyRank || '-'}
                        </span>
                      </div>
                      <div className="rounded-lg border p-4 flex flex-col gap-2 shadow-sm transition-colors hover:bg-muted/30">
                        <span className="text-sm font-medium text-muted-foreground">Role VTC</span>
                        <span className="font-bold text-lg" style={{ color: nismaraData.user.truckyRoleColor || 'inherit' }}>
                          {nismaraData.user.truckyRole || '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {nismaraData.userStats?.jobs && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          Statistik Pekerjaan
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="space-y-1.5 p-3 rounded-md bg-muted/20 border">
                            <p className="text-xs text-muted-foreground font-medium">Total Job</p>
                            <p className="font-bold text-lg">{nismaraData.userStats.jobs.total}</p>
                          </div>
                          <div className="space-y-1.5 p-3 rounded-md bg-green-500/10 border border-green-500/20">
                            <p className="text-xs text-green-700 dark:text-green-400 font-medium">Selesai</p>
                            <p className="font-bold text-lg text-green-700 dark:text-green-400">{nismaraData.userStats.jobs.completed}</p>
                          </div>
                          <div className="space-y-1.5 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                            <p className="text-xs text-destructive font-medium">Dibatalkan</p>
                            <p className="font-bold text-lg text-destructive">{nismaraData.userStats.jobs.canceled}</p>
                          </div>
                          <div className="space-y-1.5 p-3 rounded-md bg-muted/20 border">
                            <p className="text-xs text-muted-foreground font-medium">Jarak (Km)</p>
                            <p className="font-bold text-lg">{Math.floor(nismaraData.userStats.jobs.distanceKm).toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg bg-muted/10 flex flex-col items-center justify-center min-h-[300px]">
                  <Briefcase className="h-10 w-10 mb-3 opacity-30" />
                  <p className="font-medium text-lg text-foreground/70">Tidak ada data di Nismara Transport</p>
                  <p className="text-sm mt-1 max-w-sm">User ini belum terdaftar atau belum menghubungkan akun Discord dengan web Nismara Transport.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Leave History / Cuti (if any) */}
          {nismaraData?.leaveHistory && nismaraData.leaveHistory.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Riwayat Izin/Cuti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nismaraData.leaveHistory.map((leave: any) => (
                    <div key={leave._id} className="border rounded-lg p-4 space-y-3 transition-colors hover:bg-muted/20">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-semibold">{leave.reason}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <User className="h-3 w-3" /> Oleh: {leave.managerName}
                          </p>
                        </div>
                        <Badge variant={leave.status === 'deactivated' ? "secondary" : "default"} className="whitespace-nowrap">
                          {leave.status === 'deactivated' ? 'Selesai' : leave.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs p-2 bg-muted/30 rounded-md">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground mb-0.5">Mulai</span>
                          <span className="font-medium">{new Date(leave.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground mb-0.5">Selesai</span>
                          <span className="font-medium">{new Date(leave.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground mb-0.5">Durasi</span>
                          <span className="font-medium">{leave.durationDays} Hari</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Riwayat Lamaran (if any) */}
          {lamaranHistory && lamaranHistory.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <History className="h-5 w-5 text-primary" />
                  Riwayat Lamaran
                </CardTitle>
                <CardDescription>Daftar posisi yang pernah dilamar oleh user ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lamaranHistory.map((lamaran: any) => (
                    <div key={lamaran._id.toString()} className="border rounded-lg p-4 space-y-3 transition-colors hover:bg-muted/20">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-semibold text-primary">{lamaran.lowonganTitle}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Dilamar pada: {new Date(lamaran.appliedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <Badge variant={
                          lamaran.status === 'Accepted' ? 'default' : 
                          lamaran.status === 'Rejected' ? 'destructive' :
                          lamaran.status === 'Reviewed' ? 'secondary' : 'outline'
                        } className="whitespace-nowrap">
                          {lamaran.status}
                        </Badge>
                      </div>
                      <div className="pt-2 border-t flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">ID: {lamaran._id.toString()}</span>
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                          <Link href={`/dashboard/lamaran/${lamaran._id}`}>Lihat Detail</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
