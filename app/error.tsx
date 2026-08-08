"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertOctagon } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-full">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 lg:py-36 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/[0.04] via-transparent to-destructive/[0.02]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="text-center px-6 animate-fade-in-up max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertOctagon className="size-10" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            500
          </h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Terjadi Kesalahan
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Maaf, sistem kami mengalami kendala teknis saat memproses permintaanmu. Silakan coba lagi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => reset()} className="w-full sm:w-auto">
              Coba Lagi
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/">Ke Beranda</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
