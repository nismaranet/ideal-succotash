import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { Application } from "@/models/Application";
import { redirect } from "next/navigation";
import ApplicationTable from "./ApplicationTable";

export default async function ReviewPelamarPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user.role !== "manager" && session.user.role !== "admin")) {
    redirect("/dashboard");
  }

  await dbConnect();

  // Ambil seluruh data lamaran, urutkan dari yang terbaru
  const applications = await Application.find()
    .select("_id applicant.name applicant.discordId lowonganTitle status appliedAt claimedBy.name")
    .sort({ appliedAt: -1 })
    .lean();

  // Konversi ObjectId ke string agar bisa dilempar ke Client Component
  const formattedApplications = applications.map((app: any) => ({
    ...app,
    _id: app._id.toString(),
    appliedAt: app.appliedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Review Pelamar</h1>
        <p className="text-muted-foreground">
          Kelola dan tinjau seluruh lamaran yang masuk ke Nismara Group.
        </p>
      </div>

      <ApplicationTable applications={formattedApplications} />
    </div>
  );
}
