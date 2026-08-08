"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Sidebar({
  role,
  className,
  onNavigate,
}: {
  role?: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const isManagerMode = pathname.startsWith("/dashboard/manager");
  const isManagerOrAdmin = role === "manager" || role === "admin";

  const userLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "Riwayat Lamaran",
      href: "/dashboard/riwayat-lamaran",
      icon: Briefcase,
    },
  ];

  const managerLinks = [
    {
      name: "Dashboard Manager",
      href: "/dashboard/manager",
      icon: ShieldAlert,
    },
    {
      name: "Kelola Lowongan",
      href: "/dashboard/manager/lowongan",
      icon: Briefcase,
    },
    {
      name: "Review Pelamar",
      href: "/dashboard/manager/applications",
      icon: Users,
    },
  ];

  const links = isManagerMode && isManagerOrAdmin ? managerLinks : userLinks;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-border bg-background lg:flex",
        className,
      )}
    >
      <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center group" onClick={onNavigate}>
          <div className="relative flex h-8 w-24 items-center justify-start transition-transform group-hover:scale-105">
            <Image
              src="https://images.nismara.my.id/web/nismara-group-logo.png"
              alt="Nismara Logo"
              fill
              sizes="96px"
              className="object-contain object-left"
            />
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Switcher Mode */}
      {isManagerOrAdmin && (
        <div className="border-t border-border p-4">
          <Link
            href={isManagerMode ? "/dashboard" : "/dashboard/manager"}
            className="flex items-center justify-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary border border-border"
          >
            <ShieldAlert className="size-4" />
            {isManagerMode ? "Ke Mode User" : "Ke Mode Manager"}
          </Link>
        </div>
      )}
    </aside>
  );
}
