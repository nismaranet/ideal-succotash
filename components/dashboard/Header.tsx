"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import Sidebar from "@/components/dashboard/Sidebar";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function Header({ 
  user 
}: { 
  user?: { name?: string | null; image?: string | null; email?: string | null; role?: string } 
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Dynamic breadcrumb logic based on pathname
  const segments = pathname.split("/").filter(Boolean);
  const formattedSegments = segments.map((seg) =>
    seg.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  );

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger render={
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Buka menu">
            <Menu className="size-5" />
          </Button>
        } />
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
          <Sidebar role={user?.role} className="flex relative w-full" onNavigate={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center text-sm font-medium text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
          {formattedSegments.map((segment, idx) => (
            <span key={idx} className="flex items-center">
              {idx > 0 && <span className="mx-2 text-border">/</span>}
              <span className={idx === formattedSegments.length - 1 ? "text-foreground font-semibold" : "hidden sm:inline-block"}>
                {segment}
              </span>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger 
              render={
                <Button variant="ghost" className="relative flex items-center gap-x-2 h-10 w-full px-2 rounded-full lg:w-auto hover:bg-muted">
                  <Avatar className="size-8 border border-border">
                    <AvatarImage src={user?.image || ""} alt={user?.name || "User Avatar"} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="text-sm font-semibold leading-6 text-foreground" aria-hidden="true">
                      {user?.name || "Pengguna"}
                    </span>
                  </span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                render={
                  <a href="/dashboard/settings" className="cursor-pointer flex items-center">
                    <User className="mr-2 size-4" />
                    <span>Profil</span>
                  </a>
                }
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-destructive focus:text-destructive cursor-pointer flex items-center"
              >
                <LogOut className="mr-2 size-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
