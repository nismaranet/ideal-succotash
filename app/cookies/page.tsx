import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Kebijakan Cookie",
  description:
    "Informasi mengenai penggunaan *cookie* pada website Nismara untuk meningkatkan pengalaman pengguna Anda.",
};

export default function CookiesPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Navbar />
      <main className="flex-1 py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Kebijakan Cookie
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
                Apa Itu Cookie?
              </h2>
              <p>
                Cookie adalah file teks kecil yang disimpan di peramban
                (browser) web Anda saat mengunjungi sebuah situs. Mereka
                digunakan untuk membantu situs bekerja dengan lebih efisien
                serta menyimpan preferensi sementara Anda.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Bagaimana Nismara Menggunakan Cookie?
              </h2>
              <p className="mb-3">
                Kami sangat menghargai privasi Anda. Nismara{" "}
                <strong>hanya</strong> menggunakan Cookie yang bersifat esensial
                (wajib) untuk menjalankan fitur dasar website. Kami tidak
                menggunakan cookie untuk pelacakan pihak ketiga (third-party
                tracking) atau keperluan pemasaran/iklan pemasaran.
              </p>
              <p className="mb-3 font-semibold">
                Cookie yang kami gunakan meliputi:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Cookie Sesi (NextAuth):</strong> Digunakan untuk
                  mengenali status otentikasi Anda. Ini memungkinkan Anda untuk
                  tetap masuk (login) selama menjelajahi halaman Dasbor tanpa
                  harus masuk berulang kali.
                </li>
                <li>
                  <strong>Cookie Keamanan (CSRF):</strong> Digunakan untuk
                  mencegah serangan Cross-Site Request Forgery, memastikan bahwa
                  formulir yang Anda kirim aman dan berasal dari peramban Anda.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Mengelola Cookie
              </h2>
              <p>
                Karena cookie yang kami gunakan bersifat esensial untuk sistem
                login (portal anggota), Anda tidak dapat mematikannya jika ingin
                mengakses dasbor pendaftaran. Namun, Anda masih memiliki
                kebebasan untuk menghapus atau memblokir cookie ini kapan saja
                melalui pengaturan peramban (browser) Anda, dengan konsekuensi
                Anda akan keluar (log out) dari akun Anda.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
