import Link from "next/link";
import { cn } from "@/lib/cn";
import { SITE } from "@/config/site";
import { BrandMark } from "@/components/ui/brand-mark";

interface LogoProps {
  className?: string;
  markVariant?: "red" | "black" | "off-white";
  light?: boolean;
  compact?: boolean;
}

export function Logo({
  className,
  markVariant = "red",
  light = false,
  compact = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      aria-label={`${SITE.name} home`}
    >
      <span
        className={cn(
          "relative shrink-0",
          compact ? "h-7 w-7 sm:h-8 sm:w-8" : "h-9 w-9 sm:h-10 sm:w-10",
        )}
        aria-hidden="true"
      >
        <BrandMark variant={markVariant} />
      </span>
      <span
        className={cn(
          "font-display tracking-[-0.02em]",
          compact ? "text-lg sm:text-xl" : "text-xl sm:text-[1.35rem]",
          compact && "max-sm:sr-only",
          light ? "text-black" : "text-foreground",
        )}
      >
        {SITE.name}
      </span>
    </Link>
  );
}
