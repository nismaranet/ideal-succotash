import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { Application } from "@/models/Application";
import { Lowongan } from "@/models/Lowongan";
import Link from "next/link";

export default async function ManagerDashboard() {
  const session = await getServerSession(authOptions);
  const discordId = session?.user?.discordId;

  await dbConnect();

  // Fetch Global Stats & Personal Stats
  const [
    totalLowongan,
    lamaranTerbuka,
    lamaranSelesai,
    lamaranDitolak,
    totalDitangani,
    totalDiterima,
    totalDitolakSaya,
    recentApplications
  ] = await Promise.all([
    Lowongan.countDocuments({ status: "Open" }),
    Application.countDocuments({ status: { $in: ["Pending", "Reviewed"] } }),
    Application.countDocuments({ status: "Accepted" }),
    Application.countDocuments({ status: "Rejected" }),
    // Personal stats
    Application.countDocuments({ "claimedBy.discordId": discordId } as any),
    Application.countDocuments({ "claimedBy.discordId": discordId, status: "Accepted" } as any),
    Application.countDocuments({ "claimedBy.discordId": discordId, status: "Rejected" } as any),
    // Recent applications
    Application.find().sort({ appliedAt: -1 }).limit(10).lean()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Manager</h1>
        <p className="text-muted-foreground">Overview lamaran dan statistik Nismara Group.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats */}
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow p-6">
          <h3 className="tracking-tight text-sm font-medium">Total Lowongan Terbuka</h3>
          <div className="mt-2 text-3xl font-bold">{totalLowongan}</div>
        </div>
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow p-6">
          <h3 className="tracking-tight text-sm font-medium">Lamaran Terbuka</h3>
          <div className="mt-2 text-3xl font-bold text-blue-600">{lamaranTerbuka}</div>
        </div>
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow p-6">
          <h3 className="tracking-tight text-sm font-medium">Lamaran Diterima</h3>
          <div className="mt-2 text-3xl font-bold text-green-600">{lamaranSelesai}</div>
        </div>
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow p-6">
          <h3 className="tracking-tight text-sm font-medium">Lamaran Ditolak</h3>
          <div className="mt-2 text-3xl font-bold text-red-600">{lamaranDitolak}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Personal Stats */}
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow p-6 lg:col-span-3">
          <h3 className="text-lg font-semibold leading-none tracking-tight mb-4">Statistik Pribadi Saya</h3>
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Ditangani</p>
              <p className="text-2xl font-bold text-primary">{totalDitangani}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Diterima</p>
              <p className="text-2xl font-bold text-green-600">{totalDiterima}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ditolak</p>
              <p className="text-2xl font-bold text-red-600">{totalDitolakSaya}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow p-6">
        <h3 className="text-lg font-semibold leading-none tracking-tight mb-4">Daftar Lamaran Terkini</h3>
        <p className="text-sm text-muted-foreground mb-4">Menampilkan 10 lamaran paling baru.</p>
        
        {/* Table */}
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b border-border">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Pelamar</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Posisi</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tanggal</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {recentApplications.map((app: any) => (
                <tr key={app._id.toString()} className="border-b border-border transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium">{app.applicant.name}</td>
                  <td className="p-4 align-middle">{app.lowonganTitle}</td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      app.status === 'Accepted' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' :
                      app.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' :
                      app.status === 'Reviewed' ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' :
                      'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
                    }`}>
                      {app.status === 'Pending' ? 'Terbuka' : app.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    {new Date(app.appliedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4 align-middle">
                    <Link href={`/dashboard/lamaran/${app._id}`} className="text-primary hover:underline font-medium">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
              {recentApplications.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    Belum ada lamaran masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
