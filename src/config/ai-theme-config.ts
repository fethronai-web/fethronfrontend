export type AiTheme = "light" | "dark";

export const AI_THEME_TRANSITION_MS = 900;
export const AI_THEME_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

export const AI_THEME_STORAGE_KEY = "fethron-ai-theme";
export const AI_THEME_HTML_ATTR = "data-fethron-ai-theme";
export const AI_THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function parseAiTheme(value: string | undefined | null): AiTheme {
  return value === "dark" ? "dark" : "light";
}

export function buildAiThemeCookie(theme: AiTheme): string {
  return `${AI_THEME_STORAGE_KEY}=${theme}; path=/; max-age=${AI_THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
}

/** CSS-only early paint + cookie backfill from localStorage (root layout, beforeInteractive). */
export const AI_THEME_INIT_SCRIPT = `(function(){try{var k="${AI_THEME_STORAGE_KEY}";var t=localStorage.getItem(k);if(t!=="dark"&&t!=="light")return;document.documentElement.setAttribute("${AI_THEME_HTML_ATTR}",t);if(document.cookie.indexOf(k+"=")===-1)document.cookie=k+"="+t+";path=/;max-age=${AI_THEME_COOKIE_MAX_AGE};SameSite=Lax"}catch(e){}})();`;
