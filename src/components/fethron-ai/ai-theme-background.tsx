"use client";

import { FETHRON_AI } from "@/config/ai-tools";
import { AI_THEME_EASE, AI_THEME_TRANSITION_MS } from "@/config/ai-theme-config";
import type { AiTheme } from "@/components/fethron-ai/ai-theme-context";
import { SeamlessLoopVideo } from "@/components/fethron-ai/seamless-loop-video";

export function AiThemeBackground({ theme }: { theme: AiTheme }) {
  const isLight = theme === "light";

  return (
    <div
      className="absolute inset-0 bg-[var(--ai-bg)] transition-[background-color] ease-in-out"
      style={{
        transitionDuration: `${AI_THEME_TRANSITION_MS}ms`,
        transitionTimingFunction: AI_THEME_EASE,
      }}
    >
      <div
        className="fethron-ai-video-light absolute inset-0 ease-in-out"
        style={{
          opacity: isLight ? 1 : 0,
          transition: `opacity ${AI_THEME_TRANSITION_MS}ms ${AI_THEME_EASE}`,
          zIndex: isLight ? 1 : 0,
          willChange: "opacity",
        }}
        aria-hidden={!isLight}
      >
        <SeamlessLoopVideo src={FETHRON_AI.videoBg} />
      </div>

      <div
        className="fethron-ai-video-dark absolute inset-0 ease-in-out"
        style={{
          opacity: isLight ? 0 : 1,
          transition: `opacity ${AI_THEME_TRANSITION_MS}ms ${AI_THEME_EASE}`,
          zIndex: isLight ? 0 : 1,
          willChange: "opacity",
        }}
        aria-hidden={isLight}
      >
        <SeamlessLoopVideo src={FETHRON_AI.videoBgDark} />
      </div>

      <div
        className="fethron-ai-bg-overlay absolute inset-0 z-[2] ease-in-out"
        style={{ transition: `background ${AI_THEME_TRANSITION_MS}ms ${AI_THEME_EASE}` }}
        aria-hidden
      />
    </div>
  );
}
