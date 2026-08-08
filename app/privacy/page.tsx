import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan Privasi Nismara. Menjelaskan bagaimana kami melindungi, menyimpan, dan menggunakan data pribadi Anda.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Navbar />
      <main className="flex-1 py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Kebijakan Privasi
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
                1. Informasi yang Kami Kumpulkan
              </h2>
              <p className="mb-3">
                Saat Anda masuk (login) ke portal rekrutmen Nismara menggunakan
                akun Discord Anda, kami secara otomatis menerima dan
                mengumpulkan data spesifik dari Discord melalui protokol
                otentikasi standar (OAuth2). Data ini meliputi:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Discord ID (Nomor unik identitas akun).</li>
                <li>Nama pengguna (Username).</li>
                <li>Foto profil (Avatar).</li>
                <li>Status peran (Role) Anda di server Discord Nismara.</li>
              </ul>
              <p className="mt-3">
                Selain itu, jika Anda mengirimkan formulir pendaftaran, kami
                akan menyimpan data tambahan yang Anda berikan secara sukarela
                (misal: tautan profil Steam, deskripsi pengalaman, dll).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Bagaimana Kami Menggunakan Informasi Anda
              </h2>
              <p className="mb-3">
                Data yang dikumpulkan digunakan semata-mata untuk kepentingan
                internal organisasi Nismara, yakni:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Memverifikasi identitas Anda sebagai anggota server Discord.
                </li>
                <li>
                  Menilai kecocokan profil Anda dengan posisi/divisi yang
                  dilamar.
                </li>
                <li>
                  Memudahkan manajemen dan komunikasi internal pengurus Nismara.
                </li>
                <li>
                  Menghubungkan profil Nismara Anda dengan sistem pihak ketiga
                  (misalnya: integrasi Trucky API untuk divisi Transport).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Berbagi Informasi
              </h2>
              <p>
                <strong>
                  Kami tidak menjual, menyewakan, atau memperdagangkan data
                  pribadi Anda kepada pihak ketiga mana pun.
                </strong>{" "}
                Data Anda hanya dapat diakses oleh manajer rekrutmen dan
                administrator sistem Nismara yang berwenang, serta hanya
                dibagikan secara otomatis ke sistem penyedia API resmi yang
                terintegrasi atas persetujuan Anda (seperti Trucky).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Keamanan Data
              </h2>
              <p>
                Kami mengambil langkah-langkah yang wajar secara industri untuk
                melindungi data yang kami simpan, termasuk penggunaan enkripsi
                sesi dan pengamanan database tertutup. Namun, perlu diingat
                bahwa tidak ada transmisi data melalui internet yang 100% aman.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. Hak Pengguna
              </h2>
              <p>
                Anda memiliki hak untuk meminta penghapusan seluruh data rekam
                jejak lamaran dan profil Anda dari basis data kami. Untuk
                melakukan ini, Anda dapat menghubungi Administrator melalui
                server Discord kami atau email kami melalui
                support@nismara.web.id.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
