"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CHROME_EXTENSION_URL } from "@/lib/site";

interface ChromeStoreButtonProps {
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "secondary" | "ghost" | "outline";
  className?: string;
  label?: string;
}

export function ChromeStoreButton({
  size = "lg",
  variant = "default",
  className,
  label = "Add to Chrome",
}: ChromeStoreButtonProps) {
  if (CHROME_EXTENSION_URL) {
    return (
      <Button asChild size={size} variant={variant} className={className}>
        <a
          href={CHROME_EXTENSION_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe className="h-4 w-4" />
          {label}
        </a>
      </Button>
    );
  }

  return (
    <Button asChild size={size} variant={variant} className={className}>
      <Link href="#extension">
        <Globe className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}
