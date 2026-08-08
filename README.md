# 🎮 Nismara Recruitment Web

![Next.js](https://img.shields.io/badge/Next.js-16.3.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

Website **Careers/Recruitment** resmi untuk **Nismara Group** — sebuah komunitas pecinta game simulasi terkemuka di Indonesia. Portal ini dirancang untuk mewadahi pendaftaran talenta-talenta baru ke berbagai divisi simulasi yang ada di Nismara.

---

## ✨ Fitur Utama

- **🌍 Public Job Portal**: Pengguna publik dapat melihat daftar lowongan (recruitment) yang sedang dibuka di seluruh divisi Nismara.
- **📝 Sistem Pendaftaran Pintar**: Pengguna yang sudah mendaftar/login via Discord dapat melamar ke posisi yang tersedia dan memantau status lamarannya lewat _Dashboard_ personal.
- **💼 Manager Dashboard**: Akses khusus untuk Admin & Manager guna membuat lowongan baru, merakit formulir kustom (dynamic forms), dan melakukan kurasi (review) terhadap pelamar.
- **🔐 Discord OAuth**: Terintegrasi langsung dengan Discord untuk memverifikasi role, booster status, dan identitas asli pelamar di server komunitas.
- **⚡ High Performance**: Menggunakan optimasi database ganda. MongoDB untuk penyimpanan data persisten (Users, Applications, Jobs) dan Redis untuk penyimpanan _Sessions_ yang ultra-cepat.

## 🏢 Divisi Nismara Group

Aplikasi ini melayani rekrutmen untuk berbagai divisi di bawah naungan Nismara:

1. 🚛 **Nismara Transport**: Divisi _Virtual Trucking Company_ (VTC) untuk Euro Truck Simulator 2 & American Truck Simulator.
2. ✈️ **Nismara Airlines**: Divisi aviasi virtual menggunakan Microsoft Flight Simulator 2020.
3. 🏎️ **Nismara Racing**: Divisi balap profesional (Assetto Corsa, Assetto Corsa Competizione).
4. 🚜 **Nismara Farm**: Divisi simulator pertanian (Farming Simulator).
5. 🔫 **BLCK**: Divisi game aksi, taktik, dan _heist_ (Arena Breakout, GTA V).
6. ⛏️ **Rice Kencur**: Divisi kreatif berbasis blok (Minecraft).

---

## 🛠️ Tech Stack

Aplikasi ini dibangun di atas pondasi _modern web stack_ untuk memastikan performa yang maksimal dan _developer experience_ yang menyenangkan:

- **Framework**: [Next.js (App Router)](https://nextjs.org/) v16.3.0
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Komponen UI**: [shadcn/ui](https://ui.shadcn.com/) (menggunakan `@base-ui/react`) & [Lucide Icons](https://lucide.dev/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose & Native MongoClient)
- **Session Storage**: [Redis](https://redis.io/) (via `ioredis`)
- **Autentikasi**: [NextAuth.js v4](https://next-auth.js.org/) (Discord Provider)

---

## 🚀 Cara Menjalankan di Lokal (Development)

Untuk ikut berkontribusi atau menjalankan _project_ ini di mesin lokal, ikuti langkah-langkah berikut:

### 1. Kebutuhan Sistem

Pastikan Anda sudah menginstal:

- **Node.js** (v18 atau lebih baru)
- **npm** / **yarn** / **pnpm**
- Akses ke server **MongoDB** & **Redis**

### 2. Instalasi Dependensi

Clone repository ini dan install dependensinya:

```bash
git clone https://github.com/nismara-group/recruitment-nismara-web.git
cd recruitment-nismara-web
npm install
```

### 3. Pengaturan Environment Variables

Buat file `.env.local` di root folder dan isi variabel berikut:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster...
REDIS_URL=redis://localhost:6379

# Discord Auth
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_GUILD_ID=863959415702028318
DISCORD_MANAGER_ROLE_ID=1406574228794507354

# Next Auth
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000

# Trucky API
TRUCKY_API_KEY=your_trucky_token
TRUCKY_COMPANY_ID=4138
```

### 4. Jalankan Server Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya. Segala bentuk perubahan kode akan secara otomatis dimuat ulang oleh Turbopack Next.js.

---

## 📜 Lisensi & Aturan Kontribusi

Repositori ini adalah hak milik **Nismara Group**. Apabila Anda anggota _developer team_ yang ingin berkontribusi, pastikan Anda membaca pedoman Code Standards yang ada di dalam berkas konfigurasi lokal sebelum melakukan modifikasi struktural.

_Dibuat dengan ❤️ oleh Nismara Group_
