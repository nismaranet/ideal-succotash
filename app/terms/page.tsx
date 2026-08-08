import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Syarat & Ketentuan",
  description:
    "Syarat dan ketentuan umum untuk bergabung dan menjadi anggota komunitas Nismara Group.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Navbar />
      <main className="flex-1 py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Syarat dan Ketentuan Layanan
            </h1>
            <p className="text-muted-foreground">
              Pembaruan Terakhir:{" "}
              {new Date().toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="space-y-10 text-foreground/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Penerimaan Syarat
              </h2>
              <p>
                Dengan mendaftar, mengakses, atau menggunakan layanan dan
                platform komunitas Nismara, Anda setuju untuk terikat oleh
                Syarat dan Ketentuan ini. Jika Anda tidak menyetujui salah satu
                bagian dari ketentuan ini, Anda tidak diperkenankan untuk
                bergabung dalam komunitas Nismara.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Persyaratan Keanggotaan
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>
                    Toleransi Nol Terhadap Cheat (Zero Tolerance):
                  </strong>{" "}
                  Kami menerapkan kebijakan toleransi nol mutlak terhadap
                  penggunaan program ilegal, cheat, trainer, modifikasi curang,
                  atau eksploitasi bug yang memberikan keuntungan tidak wajar.
                  Pelanggaran terhadap aturan ini akan mengakibatkan pemblokiran
                  permanen dari seluruh divisi Nismara tanpa peringatan.
                </li>
                <li>
                  <strong>Tidak Ada Batasan Usia Spesifik:</strong> Nismara
                  tidak mematok batas usia minimal (selama mematuhi ketentuan
                  ToS platform game & Discord). Namun, kami mewajibkan seluruh
                  anggota untuk memiliki kedewasaan mental, mampu beradaptasi
                  dengan budaya komunitas, dan mematuhi seluruh peraturan yang
                  berlaku.
                </li>
                <li>
                  <strong>Kepemilikan Game Original:</strong> Anda diwajibkan
                  memiliki salinan game original (resmi/legal) untuk divisi yang
                  Anda lamar. Untuk konten tambahan (DLC), Anda tidak diwajibkan
                  memiliki seluruhnya kecuali secara spesifik dibutuhkan untuk
                  peran tertentu.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Etika dan Perilaku (Code of Conduct)
              </h2>
              <p className="mb-3">
                Sebagai anggota Nismara, Anda diharapkan untuk selalu menjaga
                nama baik komunitas baik di dalam maupun di luar server.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Dilarang melakukan diskriminasi, ujaran kebencian, atau
                  pelecehan (SARA) dalam bentuk apa pun.
                </li>
                <li>Saling menghormati antar sesama anggota dan pengurus.</li>
                <li>
                  Dilarang melakukan promosi (spam) yang tidak relevan atau
                  mengganggu ketertiban.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Penghentian Keanggotaan
              </h2>
              <p>
                Manajemen Nismara berhak penuh untuk menangguhkan atau
                menghentikan keanggotaan Anda kapan saja, dengan atau tanpa
                pemberitahuan, jika Anda terbukti melanggar Syarat dan Ketentuan
                ini.
              </p>
            </section>

            <div className="mt-12 bg-primary/10 rounded-xl p-6 border border-primary/20 flex gap-4">
              <ShieldAlert className="size-8 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">
                  Catatan Penting
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Nismara adalah entitas virtual (komunitas game) non-profit.
                  Dokumen ini bertujuan untuk menjaga ketertiban komunitas dan
                  bukan merupakan dokumen kontrak kerja profesional yang
                  mengikat di mata hukum negara perdata/pidana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
