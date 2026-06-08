"use client";

import { useCallback, useLayoutEffect, useRef, type ComponentProps } from "react";

type AiPromptTextareaProps = Omit<ComponentProps<"textarea">, "rows"> & {
  value: string;
};

function getPromptHeightBounds() {
  const minHeight = window.matchMedia("(min-width: 640px)").matches ? 104 : 88;
  const maxHeight = Math.min(window.innerHeight * 0.52, 520);
  return { minHeight, maxHeight };
}

export function AiPromptTextarea({ value, className, onChange, ...props }: AiPromptTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { minHeight, maxHeight } = getPromptHeightBounds();
    el.style.height = `${minHeight}px`;
    const contentHeight = el.scrollHeight;
    const next = Math.min(Math.max(contentHeight, minHeight), maxHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = contentHeight > maxHeight ? "auto" : "hidden";
  }, []);

  useLayoutEffect(() => {
    resize();
  }, [value, resize]);

  useLayoutEffect(() => {
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => {
        onChange?.(e);
      }}
      className={className}
      {...props}
    />
  );
}
