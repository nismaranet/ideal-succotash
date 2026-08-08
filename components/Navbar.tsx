"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, Home, Briefcase, Info, LogIn } from "lucide-react";

const navLinks = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Lowongan", href: "/lowongan", icon: Briefcase },
  { label: "Tentang", href: "/about", icon: Info },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="bg-white border-b border-border shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative flex h-10 w-32 items-center justify-center transition-transform group-hover:scale-105">
            <Image
              src="https://images.nismara.my.id/web/nismara-group-logo.png"
              alt="Nismara Logo"
              fill
              sizes="160px"
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg transition-colors hover:text-foreground hover:bg-accent flex items-center gap-2"
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse bg-muted rounded-md" />
          ) : session ? (
            <Button size="sm" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 size-4" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link href="/login">
                <LogIn className="mr-2 size-4" />
                Masuk
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-border bg-white/95 navbar-glass px-6 py-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground rounded-lg transition-colors hover:text-foreground hover:bg-accent"
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-border mt-3">
            {status === "loading" ? (
              <div className="h-9 w-full animate-pulse bg-muted rounded-md" />
            ) : session ? (
              <Button size="sm" className="w-full" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 size-4" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button size="sm" className="w-full" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 size-4" />
                  Masuk
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
