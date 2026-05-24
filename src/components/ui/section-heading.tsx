import { cn } from "@/lib/cn";

type SectionTheme = "dark" | "light" | "swirl";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  theme?: SectionTheme;
}

const themeStyles: Record<
  SectionTheme,
  { eyebrow: string; line: string; title: string; description: string }
> = {
  dark: {
    eyebrow: "text-accent",
    line: "bg-accent/60",
    title: "text-foreground",
    description: "text-muted",
  },
  light: {
    eyebrow: "text-accent",
    line: "bg-black/20",
    title: "text-black",
    description: "text-black/65",
  },
  swirl: {
    eyebrow: "text-off-white/85",
    line: "bg-off-white/40",
    title: "text-off-white",
    description: "text-off-white/75",
  },
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
  theme = "dark",
}: SectionHeadingProps) {
  const styles = themeStyles[theme];

  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-4 flex items-center gap-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] sm:text-xs",
            styles.eyebrow,
          )}
        >
          {align === "left" ? (
            <span className={cn("h-px w-8", styles.line)} aria-hidden="true" />
          ) : null}
          {eyebrow}
          {align === "center" ? (
            <span className={cn("h-px w-8", styles.line)} aria-hidden="true" />
          ) : null}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-display text-balance text-[clamp(2rem,5vw,3.75rem)] font-light leading-[1.05] tracking-[-0.01em]",
          styles.title,
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-pretty text-base leading-[1.7] sm:text-lg",
            styles.description,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
