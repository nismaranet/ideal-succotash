import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowWeHire from "@/components/HowWeHire";
import {
  Clock,
  Users,
  Briefcase,
  ChevronRight,
  ArrowRight,
  Building2,
  MessageCircle,
  MapPin,
} from "lucide-react";
import dbConnect from "@/lib/mongoose";
import { Lowongan } from "@/models/Lowongan";
import type { Metadata } from "next";

export const metadata: Metadata = {
  // Homepage uses the global metadata by default, but we can override if needed
  // We'll let layout.tsx handle the default homepage metadata for now
  // Since layout.tsx sets the title to "Karir - Nismara Recruitment", we don't strictly need to redefine it here unless we want to override.
};

async function getDiscordMemberCount() {
  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}?with_counts=true`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
        next: { revalidate: 3600 }, // Cache 1 jam
      },
    );
    if (res.ok) {
      const data = await res.json();
      return data.approximate_member_count
        ? `${data.approximate_member_count}`
        : "150+";
    }
  } catch (error) {
    console.error("Gagal mengambil data member Discord:", error);
  }
  return "150+"; // Fallback
}

export default async function Home() {
  const mongooseInstance = await dbConnect();

  // Ambil 4 lowongan terbaru yang berstatus "Open"
  const recentPositions = await Lowongan.find({ status: "Open" })
    .sort({ postedAt: -1 })
    .limit(4)
    .lean();

  const totalPositions = await Lowongan.countDocuments({ status: "Open" });
  const discordMemberCount = await getDiscordMemberCount();

  // Hitung jumlah driver aktif dari collection driverlinks
  let activeDriversCount = 150;
  if (mongooseInstance.connection.db) {
    activeDriversCount = await mongooseInstance.connection.db
      .collection("driverlinks")
      .countDocuments();
  }

  /* ── Stats Dinamis ── */
  const stats = [
    {
      label: "Anggota Aktif",
      value: activeDriversCount.toString(),
      icon: Users,
    },
    {
      label: "Posisi Tersedia",
      value: totalPositions.toString(),
      icon: Briefcase,
    },
    { label: "Member Discord", value: discordMemberCount, icon: MessageCircle },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          {/* Subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-primary/[0.02]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-xs font-medium text-primary mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Sedang Membuka Lowongan
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
                Bergabung{" "}
                <span className="relative">
                  <span className="relative z-10 text-primary">Bersama</span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-primary/10 -z-0 rounded-sm" />
                </span>{" "}
                Nismara
              </h1>

              <p className="mt-5 text-lg leading-relaxed text-muted-foreground max-w-lg">
                Temukan peluang untuk mengembangkan potensimu di Nismara. Kami
                mencari individu berdedikasi yang siap berkontribusi dan tumbuh
                bersama tim kami di seluruh Indonesia.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <Link href="#lowongan">
                    Lihat Lowongan
                    <ChevronRight className="size-4 ml-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">Masuk / Profil</Link>
                </Button>
              </div>

              {/* Stats row */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="group rounded-xl border border-border bg-card/60 p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-md animate-pulse-glow"
                  >
                    <stat.icon className="size-4 text-primary mb-2 transition-transform group-hover:scale-110" />
                    <p className="text-xl font-bold text-foreground leading-none">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Indonesia Map */}
            <div className="relative hidden lg:flex items-center justify-center animate-fade-in-up delay-200">
              <div className="relative w-full max-w-xl">
                {/* Glow behind map */}
                <div className="absolute inset-0 blur-3xl bg-primary/8 rounded-full scale-90" />
                <Image
                  src="https://images.nismara.my.id/web/indonesia-map.svg"
                  alt="Peta Indonesia — Lokasi operasional Nismara"
                  width={1600}
                  height={613}
                  className="relative z-10 w-full h-auto animate-float select-none pointer-events-none"
                  priority
                />
                {/* Floating location pins */}
                <div className="absolute top-[55%] left-[26%] z-20 flex items-center gap-1.5 rounded-full bg-white shadow-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground animate-fade-in-up delay-400">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Jakarta
                </div>
                <div className="absolute top-[68%] left-[34%] z-20 flex items-center gap-1.5 rounded-full bg-white shadow-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground animate-fade-in-up delay-500">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  DIY Yogyakarta
                </div>
                <div className="absolute top-[29%] left-[14%] z-20 flex items-center gap-1.5 rounded-full bg-white shadow-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground animate-fade-in-up delay-600">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Padang
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          OPEN POSITIONS
      ═══════════════════════════════════════════ */}
      <section
        id="lowongan"
        className="py-20 lg:py-28 bg-muted/30 scroll-mt-20"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
              Lowongan Terbuka
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Posisi yang Tersedia
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Jelajahi berbagai posisi yang sedang kami buka. Temukan peran yang
              sesuai dengan minat dan keahlianmu.
            </p>
          </div>

          {/* Position Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recentPositions.map((pos: any, i: number) => {
              // Hitung sisa hari jika ada deadline
              let sisaHari = null;
              if (pos.deadline) {
                const diffTime = new Date(pos.deadline).getTime() - Date.now();
                sisaHari = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              }

              return (
                <Link
                  key={pos._id.toString()}
                  href={`/lowongan/${pos.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 relative overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
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
                      <Building2 className="size-4 text-primary/70" />{" "}
                      {pos.division}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium bg-muted/50 w-fit px-2.5 py-1 rounded-md">
                      <Briefcase className="size-4 text-primary/70" />{" "}
                      {pos.roleType}
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

          {/* CTA */}
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/lowongan">
                Lihat Semua Lowongan
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW WE HIRE SECTION
      ═══════════════════════════════════════════ */}
      <HowWeHire />

      <Footer />
    </div>
  );
}
