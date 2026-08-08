import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, ExternalLink } from "lucide-react";

const footerLinks = {
  navigasi: [
    { label: "Beranda", href: "/" },
    { label: "Lowongan", href: "/lowongan" },
    { label: "Tentang", href: "/about" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  akun: [
    { label: "Nismara Group", href: "https://nismara.web.id" },
    { label: "Nismara Transport", href: "https://transport.nismara.web.id" },
    { label: "Nismara Racing", href: "https://racing.nismara.web.id" },
    { label: "Nismara Services", href: "https://services.nismara.web.id" },
  ],
  legal: [
    { label: "Syarat & Ketentuan", href: "/terms" },
    { label: "Kebijakan Privasi", href: "/privacy" },
    { label: "Kebijakan Cookie", href: "/cookies" },
    { label: "Tanya Jawab (FAQ)", href: "/faq" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-5">
              <div className="relative flex h-12 w-40 items-center justify-center">
                <Image
                  src="https://images.nismara.my.id/web/nismara-group-logo.png"
                  alt="Nismara Logo"
                  fill
                  sizes="160px"
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
              Nismara membuka kesempatan bagi individu berbakat untuk bergabung
              dan berkontribusi dalam komunitas kami. Temukan posisi yang sesuai
              dengan keahlianmu.
            </p>
            <div className="flex items-center gap-4 mt-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                Indonesia
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5" />
                contact@nismara.web.id
              </span>
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.navigasi.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Akun */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.akun.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground inline-flex items-center gap-1"
                  >
                    {link.label}
                    {link.href.startsWith("/dashboard") && (
                      <ExternalLink className="size-3" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Bantuan */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Legal & Bantuan
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Nismara. Seluruh hak cipta
            dilindungi.
          </p>
          <p className="text-xs text-muted-foreground">
            Dibuat dengan ❤️ di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
