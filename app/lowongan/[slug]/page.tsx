import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { Lowongan } from "@/models/Lowongan";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Briefcase, Calendar, ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReactMarkdown from "react-markdown";

// Server Component Props di Next.js 15+ (params is a Promise)
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const data = await Lowongan.findOne({ slug });

  if (!data) return { title: "Tidak Ditemukan" };

  return {
    title: `${data.title}`,
    description: data.description.substring(0, 150) + "...",
  };
}

export default async function LowonganDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  await dbConnect();
  const data = await Lowongan.findOne({ slug });

  if (!data) {
    notFound();
  }

  const isClosed = data.status !== "Open";
  const applyLink = session
    ? `/dashboard/apply/${data.slug}`
    : `/login?callbackUrl=/lowongan/${data.slug}`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Kembali ke Beranda
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri: Detail Utama */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Box */}
              <div className="rounded-2xl border border-border bg-card p-6 md:p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge
                    variant={isClosed ? "secondary" : "default"}
                    className="px-3 py-1"
                  >
                    {data.status === "Open" ? "Buka (Open)" : data.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="px-3 py-1 bg-primary/5 text-primary border-primary/20"
                  >
                    {data.division}
                  </Badge>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  {data.title}
                </h1>

                <div className="flex flex-wrap gap-y-4 gap-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 shrink-0" />
                    <span>{data.roleType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{data.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>{data.type}</span>
                  </div>
                  {data.deadline && (
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-medium">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>
                        Tutup:{" "}
                        {new Date(data.deadline).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Konten Utama */}
              <div className="rounded-2xl border border-border bg-card p-6 md:p-10 shadow-sm space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <div className="h-6 w-2 bg-primary rounded-full"></div>
                    Deskripsi Pekerjaan
                  </h2>
                  <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground">
                    <ReactMarkdown>{data.description}</ReactMarkdown>
                  </div>
                </section>

                <hr className="border-border" />

                <section>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <div className="h-6 w-2 bg-primary rounded-full"></div>
                    Persyaratan Pelamar
                  </h2>
                  {data.requirements && data.requirements.length > 0 ? (
                    <ul className="space-y-3">
                      {data.requirements.map((req: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-muted-foreground leading-relaxed"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground prose-p:my-0 prose-ul:my-0 prose-li:my-0">
                            <ReactMarkdown>{req}</ReactMarkdown>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Tidak ada syarat khusus yang dicantumkan.
                    </p>
                  )}
                </section>
              </div>
            </div>

            {/* Kolom Kanan: Sidebar Aksi */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">
                  Tertarik dengan posisi ini?
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Pastikan Anda telah membaca dan memahami seluruh persyaratan
                  sebelum melamar.
                </p>

                {isClosed ? (
                  <Button
                    className="w-full h-12 text-md"
                    variant="secondary"
                    disabled
                  >
                    Lowongan Telah Ditutup
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="w-full h-12 text-md shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                  >
                    <Link href={applyLink}>
                      {session ? "Lamar Sekarang" : "Login untuk Melamar"}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
