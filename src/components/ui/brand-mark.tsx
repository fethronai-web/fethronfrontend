import { cn } from "@/lib/cn";

type BrandMarkVariant = "red" | "black" | "off-white";

interface BrandMarkProps {
  className?: string;
  variant?: BrandMarkVariant;
}

const fillMap: Record<BrandMarkVariant, string> = {
  red: "fill-accent",
  black: "fill-black",
  "off-white": "fill-off-white",
};

/** Geometric mark from brand palette (design/image.png) */
export function BrandMark({ className, variant = "red" }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      {/* T stem + F stem */}
      <path
        className={fillMap[variant]}
        d="M6 4L18 8L16 44L4 40L6 4Z"
      />
      {/* F top bar */}
      <path
        className={fillMap[variant]}
        d="M20 8L44 4L42 16L20 18L20 8Z"
      />
      {/* F middle bar */}
      <path
        className={fillMap[variant]}
        d="M20 22L38 20L36 30L20 30L20 22Z"
      />
    </svg>
  );
}
