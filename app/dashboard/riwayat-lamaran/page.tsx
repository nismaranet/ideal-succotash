import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { Application } from "@/models/Application";
import { Clock, CheckCircle, XCircle, FileText, ArrowRight, MessagesSquare } from "lucide-react";
import Link from "next/link";

export default async function RiwayatLamaranPage() {
  const session = await getServerSession(authOptions);
  await dbConnect();
  const lamarans = await Application.find({ 
    "applicant.discordId": session?.user?.discordId as string,
    status: { $in: ["Accepted", "Rejected"] }
  })
    .sort({ appliedAt: -1 })
    .lean();

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2 animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight">Riwayat Lamaran</h1>
        <p className="text-muted-foreground">Ini adalah rekam jejak lamaran kamu yang sudah selesai diproses.</p>
      </div>
      
      <div className="grid gap-6">
        {lamarans.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm animate-fade-in-up delay-100">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <FileText className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Belum ada riwayat</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Kamu belum memiliki lamaran yang selesai diproses.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lamarans.map((lamaran: any, i: number) => {
              const isAccepted = lamaran.status === "Accepted";
              const isRejected = lamaran.status === "Rejected";

              return (
                <div
                  key={lamaran._id.toString()} 
                  className="rounded-xl border border-border bg-card p-6 shadow-sm relative overflow-hidden animate-fade-in-up flex flex-col"
                  style={{ animationDelay: `${(i + 1) * 100}ms` }}
                >
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    isAccepted ? "bg-emerald-500" : "bg-red-500"
                  }`} />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg">{lamaran.lowonganTitle}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Dilamar pada: {new Date(lamaran.appliedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      isAccepted ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                    }`}>
                      {isAccepted && <CheckCircle className="size-3.5" />}
                      {isRejected && <XCircle className="size-3.5" />}
                      {lamaran.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 text-sm text-foreground/80">
                    {isAccepted && (
                      <span className="text-emerald-600 font-medium">Selamat! Lamaran kamu diterima.</span>
                    )}
                    {isRejected && (
                      <span className="text-red-600 font-medium">Mohon maaf, lamaran kamu belum dapat kami terima saat ini.</span>
                    )}
                  </div>

                  {lamaran.reason && (
                    <div className="mt-3 text-sm bg-background border border-border rounded-lg p-3 italic text-muted-foreground">
                      <span className="font-semibold block mb-1 not-italic text-foreground">Catatan Manajer:</span>
                      "{lamaran.reason}"
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground mb-1">Ditangani Oleh:</span>
                      {lamaran.claimedBy ? (
                        <span className="text-sm font-semibold">{lamaran.claimedBy.name}</span>
                      ) : (
                        <span className="text-sm font-medium text-amber-600">-</span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Link 
                        href={`/dashboard/lamaran/${lamaran._id}`}
                        className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
