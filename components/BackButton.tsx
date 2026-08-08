"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps extends ButtonProps {
  iconOnly?: boolean;
  fallbackUrl?: string;
}

export function BackButton({ className, variant = "outline", size = "icon", iconOnly = true, fallbackUrl, ...props }: BackButtonProps) {
  const router = useRouter();
  
  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else if (fallbackUrl) {
      router.push(fallbackUrl);
    } else {
      router.push("/");
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={cn(className)} 
      onClick={handleBack}
      {...props}
    >
      <ArrowLeft className={iconOnly || size === "icon" ? "h-4 w-4" : "h-4 w-4 mr-2"} />
      {!(iconOnly || size === "icon") && "Kembali"}
    </Button>
  );
}
