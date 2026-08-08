"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Apakah saya harus memiliki game original untuk bergabung?",
    answer:
      "Ya, kami mewajibkan kepemilikan minimal basis game original (resmi) untuk divisi game yang Anda lamar. Hal ini untuk memastikan kelancaran kompatibilitas multiplayer, dukungan update, dan menghargai karya pengembang game.",
  },
  {
    question: "Apakah saya wajib memiliki semua DLC (Downloadable Content)?",
    answer:
      "Tidak. Anda tidak diwajibkan untuk memiliki semua DLC. Memiliki base game original sudah cukup. Namun, untuk event atau konvoi tertentu, kepemilikan DLC peta spesifik mungkin dibutuhkan, tetapi hal itu akan diinformasikan sebelumnya.",
  },
  {
    question: "Apakah ada batasan usia untuk melamar ke Nismara?",
    answer:
      "Nismara tidak mematok batas usia minimal secara spesifik (selama sesuai dengan ToS layanan terkait). Kami mengedepankan sifat kedewasaan mental. Asalkan Anda bisa beradaptasi, berkomunikasi dengan baik, dan mematuhi peraturan komunitas, Anda dipersilakan mendaftar.",
  },
  {
    question: "Apakah saya bisa melamar lebih dari satu peran/divisi?",
    answer:
      "Tergantung pada kebutuhan operasional. Disarankan untuk fokus melamar dan aktif pada satu divisi utama terlebih dahulu agar kontribusi Anda bisa optimal.",
  },
  {
    question: "Berapa lama proses seleksi setelah saya mengirim formulir?",
    answer:
      "Tim rekrutmen kami biasanya akan merespon pendaftaran dengan sesegera mungkin. Lama atau cepatnya tergantung kepada anda juga seberapa lama anda merespon pertanyaan dari staff kami. Estimasi waktu yang bisa diberikan adalah 1-7 hari. Apabila lebih dari 7 hari dan tidak ada respon lanjutkan maka lamaran anda akan dianggap gugur.",
  },
  {
    question:
      "Saya belum pernah menggunakan game simulator, apakah ada pelatihan?",
    answer:
      "Tentu. Setiap anggota yang lolos akan melewati masa uji coba di mana rekan dan staf Nismara siap memandu dan membantu Anda memahami cara bermain secara simulasi yang baik.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col min-h-full">
      <Navbar />
      <main className="flex-1 py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Tanya Jawab (FAQ)
            </h1>
            <p className="text-lg text-muted-foreground">
              Pertanyaan yang sering diajukan seputar proses rekrutmen Nismara.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={cn(
                    "border border-border rounded-xl bg-card overflow-hidden transition-all duration-200",
                    isOpen
                      ? "border-primary/40 shadow-sm ring-1 ring-primary/10"
                      : "hover:border-border/80 hover:bg-muted/30",
                  )}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
                  >
                    <span className="font-semibold text-foreground">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-5 text-muted-foreground transition-transform duration-300",
                        isOpen && "rotate-180 text-primary",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    <div className="px-6 pb-5 pt-0 text-muted-foreground leading-relaxed border-t border-border/50 mt-2">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
