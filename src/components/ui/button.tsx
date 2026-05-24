import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "soft" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

interface ButtonAsButton
  extends ButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  href?: undefined;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  onClick?: () => void;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "btn-shimmer bg-accent text-accent-foreground shadow-[0_0_40px_-8px_var(--glow-red)] hover:shadow-[0_0_50px_-6px_var(--glow-red)] hover:brightness-110 focus-visible:ring-accent/50",
  soft:
    "bg-red-soft text-black hover:bg-red-soft-hover focus-visible:ring-accent/40 focus-visible:ring-offset-swirl",
  secondary:
    "border border-border-strong bg-surface-raised/80 text-foreground backdrop-blur-sm hover:bg-surface-overlay hover:border-swirl/30 focus-visible:ring-foreground/20",
  outline:
    "border border-border text-muted hover:text-foreground hover:border-border-strong hover:bg-surface-raised focus-visible:ring-foreground/20",
  ghost:
    "text-muted hover:text-foreground hover:bg-surface-overlay focus-visible:ring-foreground/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs tracking-wide uppercase",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-sm sm:h-[3.25rem] sm:text-base",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  const styles = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className,
  );

  if ("href" in props && props.href) {
    const { href, onClick } = props;
    return (
      <Link href={href} className={styles} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonAsButton;

  return (
    <button type={type} className={styles} {...buttonProps}>
      {children}
    </button>
  );
}
