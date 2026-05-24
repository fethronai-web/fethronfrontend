"use client";

import { useEffect, useRef, useState } from "react";
import { logger } from "@/lib/logger";

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {},
) {
  const { threshold = 0.12, rootMargin = "0px 0px -8% 0px", once = true } =
    options;
  const ref = useRef<T>(null);
  // Always false on first render so SSR and client hydration match.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      logger.warn("useReveal ref is null on mount");
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      logger.warn("IntersectionObserver unavailable, revealing immediately");
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    let observer: IntersectionObserver;

    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        },
        { threshold, rootMargin },
      );
      observer.observe(element);

      // Already on screen after hydration — reveal without waiting for IO callback
      requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const viewportHeight =
          window.innerHeight || document.documentElement.clientHeight;
        if (rect.top < viewportHeight * 0.92 && rect.bottom > 0) {
          setVisible(true);
          if (once) observer.disconnect();
        }
      });
    } catch (error) {
      logger.error("Failed to initialize IntersectionObserver", {}, error);
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, visible };
}
