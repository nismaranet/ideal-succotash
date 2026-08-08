import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dbConnect from "@/lib/mongoose";
import { Lowongan } from "@/models/Lowongan";
import LowonganListClient from "./LowonganListClient";
import HowWeHire from "@/components/HowWeHire";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Cari Lowongan Posisi",
  description:
    "Jelajahi berbagai peluang dan lowongan karir yang sedang terbuka di Nismara Group. Temukan peran yang tepat untuk keahlian Anda.",
  keywords: ["Lowongan Nismara", "Loker VTC", "Rekrutmen Nismara", "Karir"],
};
export const revalidate = 0;

export default async function LowonganIndexPage() {
  await dbConnect();

  // Ambil hanya lowongan yang statusnya Open
  const lowongans = await Lowongan.find({ status: "Open" })
    .sort({ createdAt: -1 })
    .lean();

  // Serialize ke object biasa (karena _id dari Mongoose adalah ObjectId)
  const serialized = lowongans.map((l) => ({
    _id: l._id.toString(),
    title: l.title,
    slug: l.slug,
    division: l.division,
    roleType: l.roleType,
    location: l.location,
    type: l.type,
    deadline: l.deadline ? l.deadline.toISOString() : null,
    description: l.description,
  }));

  return (
    <div className="flex flex-col min-h-full">
      <Navbar />

      <main className="flex-1 bg-muted/30 pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Cari Peluangmu
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Jelajahi berbagai posisi yang sedang kami buka di Nismara Group.
              Gunakan fitur pencarian dan saringan di bawah untuk menemukan
              peran yang paling pas untukmu.
            </p>
          </div>

          <LowonganListClient data={serialized} />
        </div>
      </main>

      <HowWeHire />

      <Footer />
    </div>
  );
}
