import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { Lowongan } from "@/models/Lowongan";
import ApplyFormClient from "./ApplyFormClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const data = await Lowongan.findOne({ slug });

  if (!data) return { title: "Tidak Ditemukan" };

  return {
    title: `Formulir Pendaftaran ${data.title}`,
    description: data.description.substring(0, 150) + "...",
  };
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/login?callbackUrl=/dashboard/apply/${slug}`);
  }

  await dbConnect();
  const lowongan = await Lowongan.findOne({ slug });

  if (!lowongan) {
    notFound();
  }

  if (lowongan.status !== "Open") {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-2">
            Maaf, Lowongan Ditutup
          </h1>
          <p className="text-muted-foreground">
            Posisi ini sudah tidak menerima lamaran baru.
          </p>
        </div>
      </div>
    );
  }

  // Jika formFields kosong, beri array kosong
  const fields = lowongan.formFields || [];

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 md:px-0">
      <div className="mb-8 p-6 bg-primary/5 rounded-2xl border border-primary/20">
        <h1 className="text-3xl font-bold tracking-tight">
          Formulir Pendaftaran
        </h1>
        <p className="text-muted-foreground mt-2">
          Anda sedang melamar untuk posisi:{" "}
          <strong className="text-foreground text-lg">{lowongan.title}</strong>
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-md inline-flex font-medium">
          Profil Pelamar: {session.user.name}
        </div>
      </div>

      <ApplyFormClient
        lowonganId={lowongan._id.toString()}
        fields={JSON.parse(JSON.stringify(fields))}
      />
    </div>
  );
}
