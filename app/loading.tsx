import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center justify-center space-y-4">
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Subtle pulse ring behind the logo */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" />
          
          {/* Main Logo */}
          <Image
            src="/nismara.svg"
            alt="Loading..."
            fill
            priority
            className="object-contain animate-float"
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Memuat halaman...
        </p>
      </div>
    </div>
  );
}
