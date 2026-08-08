<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Nismara Recruitment Web

## Deskripsi Project

Website **careers/recruitment** untuk organisasi **Nismara** — sebuah komunitas pecinta game simulasi di Indonesia. Website ini memungkinkan:

- **Public users**: melihat lowongan/recruitment yang tersedia
- **Registered users**: mendaftar ke posisi, memantau status pendaftaran melalui dashboard
- **Manager/Admin**: mengelola lowongan dan pendaftaran

## Divisi yang telah ada di Nismara Group

- **Nismara Transport** (VTC Euro Truck Simulator 2 dan American Truck Simulator) divisi ini bermain pada game ETS2 dan ATS. Di dalam divisi ini juga ada sub Divisi seperti Nismara Coach yang berfokus bermain menggunakan Bus di ETS2 dan ATS walaupun saat ini masih menggunakan mods. Tetapi nanti ETS2 akan menggunakan DLC Coach nanti.
- **Nismara Airlines** divisi ini berfokus pada game Flight Simulator. Saat ini pemain lebih prefer bermain di Microsoft Flight Simulator 2020 (MSFS 2020).
- **Nismara Racing** divisi ini berfokus pada game-game balap seperti Assetto Corsa, Assetto Corsa Competizione, dsb.
- **Nismara Farm** divisi ini berfokus pada game Farming Simulator.
- **BLCK** divisi ini berfokus pada game-game action perang atau heist. Game meliputi Arena Break Out, GTAV, dsb.
- **Rice Kencur** divisi ini berfokus pada game Minecraft.

## Role atau Peran yang Tersedia

### Nismara Transport

- **Driver** untuk game ETS2 dan ATS.
- **Staff** staff dalam Divisi Nismara Transport mengambil alih manajemen semua hal dari Driver dan juga mengatur acara atau convoys yang akan di adakan oleh Divisi Nismara Transport.

### Nismara Airlines

- **Pilot** untuk game Flight Simulator.
- **Staff** staff dalam Divisi Nismara Airlines mengambil alih manajemen semua hal dari Pilot dan juga mengatur acara atau flights yang akan di adakan oleh Divisi Nismara Airlines.

### Nismara Racing

- **Racer** untuk game-game balap seperti Assetto Corsa, Assetto Corsa Competizione, dsb.
- **Staff** staff dalam Divisi Nismara Racing mengambil alih manajemen semua hal dari Racer dan juga mengatur acara atau races yang akan di adakan oleh Divisi Nismara Racing.

### Nismara Farm

- **Farmer** untuk game Farming Simulator.
- **Staff** staff dalam Divisi Nismara Farm mengambil alih manajemen semua hal dari Farmer dan juga mengatur acara atau convoys yang akan di adakan oleh Divisi Nismara Farm.

### BLCK

- **Player** untuk game-game action perang atau heist. Game meliputi Arena Break Out, GTAV, dsb.
- **Staff** staff dalam Divisi BLCK mengambil alih manajemen semua hal dari Player dan juga mengatur acara atau convoys yang akan di adakan oleh Divisi BLCK.

### Rice Kencur

- **Player** untuk game Minecraft.
- **Staff** staff dalam Divisi Rice Kencur mengambil alih manajemen semua hal dari Player dan juga mengatur acara atau convoys yang akan di adakan oleh Divisi Rice Kencur.

## Tech Stack

| Layer         | Teknologi                                      | Versi    |
| ------------- | ---------------------------------------------- | -------- |
| Framework     | Next.js (App Router)                           | 16.3.0   |
| Language      | TypeScript                                     | ^5       |
| Styling       | Tailwind CSS                                   | v4       |
| UI Components | shadcn/ui (base-vega style, `@base-ui/react`)  | latest   |
| Icons         | lucide-react                                   | ^1.30.0  |
| Database      | MongoDB (via Mongoose + native MongoClient)    | -        |
| Auth          | NextAuth v4 (Discord OAuth)                    | ^4.24.15 |
| External API  | Supabase, Trucky API                           | -        |
| CSS Utilities | class-variance-authority, clsx, tailwind-merge | -        |

## Arsitektur & Struktur Folder

```
app/                    → Next.js App Router pages & API routes
  api/auth/             → NextAuth route handler (Discord provider)
  globals.css           → Global styles + Tailwind config + custom animations
  layout.tsx            → Root layout (Inter font, metadata)
  page.tsx              → Homepage (Hero + Lowongan + Footer)
components/
  ui/                   → shadcn/ui components (Button, dll)
  Navbar.tsx            → Sticky navbar (client component)
  Footer.tsx            → Footer (server component)
lib/
  utils.ts              → cn() helper (clsx + tailwind-merge)
  mongodb.ts            → MongoClient singleton (untuk NextAuth adapter)
  mongoose.ts           → Mongoose connection dengan caching (untuk models/queries)
  trucky.ts             → Trucky API wrapper (VTC Hub integration)
types/
  next-auth.d.ts        → Session type augmentation
public/
  indonesia-map.svg     → Dotted/pixel-art SVG peta Indonesia (warna #216BD6)
```

## Konvensi Penting

### Bahasa

- **UI/konten**: Bahasa Indonesia
- **Code & comments**: boleh campuran, tapi preferensi Bahasa Indonesia untuk komentar
- **Variable/function names**: English

### Styling

- Gunakan **Tailwind CSS v4** — import `tailwindcss` langsung (bukan `@tailwind` directives)
- Design tokens didefinisikan di `globals.css` menggunakan CSS custom properties (oklch)
- Primary color: **biru** (oklch 0.48 0.18 260 ≈ #216BD6) — konsisten dengan warna peta Indonesia
- Theme: **Light** — bersih dan profesional
- Custom animations tersedia: `.animate-fade-in-up`, `.animate-float`, `.animate-pulse-glow`
- Navbar menggunakan `.navbar-glass` untuk backdrop blur effect
- Saat diminta untuk memperbaiki atau mengubah styling/CSS, ubah bagian visualnya saja tanpa memodifikasi fungsi logika yang sudah ada

### shadcn/ui

- Style: `base-vega` (menggunakan `@base-ui/react` primitives, BUKAN Radix UI)
- Button component mendukung `asChild` prop yang ditranslasikan ke `render` prop dari base-ui. **PENTING: Jika kamu menginstall ulang komponen (misal `npx shadcn add button`), jangan lupa untuk mengembalikan modifikasi `asChild` dan `nativeButton={false}` secara manual karena versi bawaannya tidak mendukungnya (akan menyebabkan error DOM attributes atau error Base UI nativeButton).**
- Config ada di `components.json`
- Path alias: `@/components/ui/`

### Database

- **Dua koneksi MongoDB tersedia**:
  - `lib/mongodb.ts` — native `MongoClient` (dipakai oleh NextAuth `MongoDBAdapter`)
  - `lib/mongoose.ts` — Mongoose ODM (dipakai untuk query/model bisnis)
- Environment variable: `MONGODB_URI` (di `.env.local`)

### Authentication

- NextAuth v4 dengan **Discord OAuth** provider
- Session strategy: **database** (bukan JWT)
- Session diperkaya dengan: `discordId`, `role`, `isDriver`, `truckyId`, `driverData`, `teamId`, `xp`, `level`, `isBooster`, `nismaraplus`
- Role system: `user` | `manager` | `admin`
- Manager role ditentukan dari Discord role ID
- Sign-in page: `/dashboard/`

### External APIs

- **Discord Bot API**: sync member roles & booster status (throttle 10 menit)
- **Trucky API** (`e.truckyapp.com`): sync driver stats, rank, role (throttle 12 jam)
  - API key via `TRUCKY_API_KEY` env var
  - Company ID: `TRUCKY_COMPANY_ID` (default: 4138)

## Environment Variables

```
# .env.local
MONGODB_URI=             # MongoDB connection string
DISCORD_CLIENT_ID=       # Discord OAuth app client ID
DISCORD_CLIENT_SECRET=   # Discord OAuth app client secret
DISCORD_BOT_TOKEN=       # Discord bot token (untuk guild member API)
DISCORD_GUILD_ID=        # Discord guild ID (default: 863959415702028318)
DISCORD_MANAGER_ROLE_ID= # Discord manager role ID (default: 1406574228794507354)
NEXTAUTH_SECRET=         # Random string untuk NextAuth encryption
NEXTAUTH_URL=            # Base URL (http://localhost:3000)
TRUCKY_API_KEY=          # Trucky API access token
TRUCKY_COMPANY_ID=       # Trucky company ID (default: 35643)
```

## Guidelines untuk AI

1. **Selalu cek `node_modules/next/dist/docs/`** sebelum menulis code Next.js — API mungkin berbeda dari training data
2. **Jangan install package baru** tanpa konfirmasi user
3. **Pertahankan konsistensi warna** — gunakan token CSS (`bg-primary`, `text-foreground`, dll), jangan hardcode hex/oklch
4. **Semua komponen UI baru** harus menggunakan shadcn/ui pattern atau Tailwind — jangan CSS modules
5. **Server Components by default** — gunakan `"use client"` hanya jika butuh state, effects, atau event handlers
6. **Import path** selalu pakai alias `@/` (e.g., `@/lib/utils`, `@/components/ui/button`)
7. **Responsive design** — mobile-first, gunakan breakpoints `sm:`, `md:`, `lg:`
8. **Animasi** — gunakan class yang sudah tersedia di globals.css, atau tambahkan di sana jika perlu yang baru
9. **Perhatian saat Update Komponen UI**: Jika mengupdate atau menambah komponen shadcn/ui (misalnya `npx shadcn@latest add ...`), perhatikan bahwa komponen kustom yang sudah ada (seperti `Button` yang dimodifikasi untuk `asChild` dengan `render` prop dan `nativeButton={false}` via `@base-ui/react`) bisa tertimpa. Pastikan untuk mengembalikan/menyesuaikan ulang logika kustom tersebut agar tidak terjadi error React.
10. **Perhatikan komponen yang sudah ada** gunakan komponen yang sudah ada dan jangan membuat sesuatu yang baru
11. **Filter dan Pencarian pada Tabel**: Apabila membuat sebuah antarmuka yang mengandung tabel dan memiliki kemungkinan untuk memuat banyak data (seperti riwayat lowongan atau pelamar), selalu pastikan untuk menambahkan fitur pencarian (search) dan filter bawaan.
12. **Next.js 15+ Dynamic Routing**: Parameter dinamis (`params` atau `searchParams`) di Route Handlers maupun Components adalah `Promise`. Wajib dibongkar menggunakan `await params` sebelum nilainya (seperti `params.id`) diakses agar tidak terkena error `sync-dynamic-apis`.
