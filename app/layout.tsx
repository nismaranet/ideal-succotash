import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://nismara.web.id"),
  title: {
    default: "Karir Nismara - Mulai Perjalanan Virtualmu Bersama Kami",
    template: "%s - Nismara Recruitment",
  },
  description:
    "Portal rekrutmen resmi untuk bergabung dengan berbagai divisi simulasi Nismara, termasuk Racing, Transport, Coach, dan Airlines.",
  keywords: [
    "Nismara",
    "Nismara Group",
    "VTC Indonesia",
    "Loker Nismara",
    "Lowongan Kerja Simulator",
    "Karir",
  ],
  authors: [{ name: "Nismara Group" }],
  creator: "Nismara Group",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    title: "Karir Nismara - Mulai Perjalanan Virtualmu Bersama Kami",
    description:
      "Temukan peluang karir terbaik di Nismara Group. Lihat lowongan yang tersedia, daftar, dan pantau status pendaftaranmu melalui dashboard.",
    siteName: "Nismara Recruitment",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karir Nismara - Mulai Perjalanan Virtualmu Bersama Kami",
    description:
      "Bergabunglah bersama komunitas pecinta game simulasi di Indonesia dengan Nismara Group.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "Y2oIpUQn-6CiJNU-hIkuga1RRPYbBDgDMPS4LRUXE40",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
