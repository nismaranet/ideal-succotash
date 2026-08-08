import Image from "next/image";
import Link from "next/link";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Pelajari lebih lanjut tentang visi, misi, dan nilai-nilai Nismara Group sebagai komunitas dan ekosistem game simulasi terbesar di Indonesia.",
  keywords: [
    "Tentang Nismara",
    "Profil Nismara",
    "Komunitas Simulasi",
    "VTC Indonesia",
  ],
};
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Plane,
  Truck,
  Flag,
  Tractor,
  Crosshair,
  Pickaxe,
} from "lucide-react";

const divisions = [
  {
    name: "Nismara Transport",
    game: "Euro Truck Simulator 2 & American Truck Simulator",
    icon: Truck,
    description:
      "Divisi simulasi logistik antar benua. Mengantarkan kargo dengan aman dan profesional, melintasi jalanan Eropa dan Amerika.",
    color: "bg-blue-500/10 text-blue-500",
    border: "group-hover:border-blue-500/30",
  },
  {
    name: "Nismara Airlines",
    game: "Microsoft Flight Simulator 2020",
    icon: Plane,
    description:
      "Divisi penerbangan virtual. Menerbangkan rute domestik dan internasional dengan standar prosedur kokpit yang realistis.",
    color: "bg-sky-500/10 text-sky-500",
    border: "group-hover:border-sky-500/30",
  },
  {
    name: "Nismara Racing",
    game: "Assetto Corsa & ACC",
    icon: Flag,
    description:
      "Divisi balap aspal panas. Adu mekanik dan waktu putaran terbaik dalam sirkuit balap profesional yang intens.",
    color: "bg-red-500/10 text-red-500",
    border: "group-hover:border-red-500/30",
  },
  {
    name: "Nismara Farm",
    game: "Farming Simulator",
    icon: Tractor,
    description:
      "Divisi pertanian dan perkebunan. Mengelola ladang raksasa, mengoperasikan alat berat, dan membangun ekosistem panen virtual.",
    color: "bg-green-500/10 text-green-500",
    border: "group-hover:border-green-500/30",
  },
  {
    name: "BLCK",
    game: "Arena Breakout, GTAV",
    icon: Crosshair,
    description:
      "Divisi taktis dan aksi. Membutuhkan kerja sama tim tingkat tinggi dalam peperangan taktis maupun operasi khusus (heist).",
    color: "bg-slate-500/10 text-slate-500",
    border: "group-hover:border-slate-500/30",
  },
  {
    name: "Rice Kencur",
    game: "Minecraft",
    icon: Pickaxe,
    description:
      "Divisi kreativitas tanpa batas. Membangun peradaban blok, berpetualang melawan monster, dan bertahan hidup bersama.",
    color: "bg-amber-500/10 text-amber-500",
    border: "group-hover:border-amber-500/30",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-background">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-6 animate-fade-in-up">
            Menyatukan Gamer Indonesia Sejak 2024
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6 animate-fade-in-up delay-100">
            Lebih dari Sekadar{" "}
            <span className="text-primary">Komunitas Game</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed animate-fade-in-up delay-200">
            Nismara adalah rumah bagi para pecinta simulasi, balap, dan
            strategi. Kami bermula di tahun 2024 dengan sebuah visi sederhana:
            membangun ekosistem virtual profesional yang erat dengan semangat
            kekeluargaan.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          DIVISIONS SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Keluarga Divisi Kami
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Satu server Discord, beragam pilihan game. Di mana pun keahlianmu
              berada, selalu ada tempat untukmu di Nismara.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {divisions.map((div, i) => (
              <div
                key={div.name}
                className={`group relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${div.border}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className={`size-14 rounded-xl flex items-center justify-center mb-6 ${div.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <div.icon className="size-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {div.name}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  {div.game}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {div.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-6">
            Siap Memulai Perjalananmu?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Jangan hanya bermain sendirian. Bergabunglah bersama ratusan anggota
            Nismara lainnya dan rasakan pengalaman simulasi yang sesungguhnya.
          </p>
          <Button
            size="lg"
            className="h-14 px-8 text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            asChild
          >
            <Link href="/lowongan">
              Lihat Posisi Tersedia <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
