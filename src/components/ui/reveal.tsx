"use client";

import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useReveal } from "@/hooks/use-reveal";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4;
  as?: ElementType;
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <Tag
      ref={ref}
      className={cn(
        "reveal",
        visible && "reveal-visible",
        delay > 0 && `reveal-delay-${delay}`,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
