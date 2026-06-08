"use client";

import { AnimatePresence, motion } from "motion/react";
import { MoonIcon, SunIcon } from "@/components/fethron-ai/ai-icons";
import { useAiTheme } from "@/components/fethron-ai/ai-theme-context";
import { AI_THEME_TRANSITION_MS } from "@/config/ai-theme-config";

export function AiThemeToggle() {
  const { theme, toggleTheme, isReady } = useAiTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={!isReady}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fethron-ai-theme-toggle relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -40, scale: 0.82 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 40, scale: 0.82 }}
          transition={{ duration: AI_THEME_TRANSITION_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? <SunIcon size={17} aria-hidden /> : <MoonIcon size={17} aria-hidden />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
