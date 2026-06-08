"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AI_THEME_HTML_ATTR,
  AI_THEME_STORAGE_KEY,
  AI_THEME_TRANSITION_MS,
  buildAiThemeCookie,
  type AiTheme,
} from "@/config/ai-theme-config";

export type { AiTheme };

type AiThemeContextValue = {
  theme: AiTheme;
  isReady: boolean;
  toggleTheme: () => void;
  setTheme: (theme: AiTheme) => void;
};

const SWITCH_LOCK_MS = AI_THEME_TRANSITION_MS + 80;

const AiThemeContext = createContext<AiThemeContextValue | null>(null);

function persistTheme(theme: AiTheme) {
  document.documentElement.setAttribute(AI_THEME_HTML_ATTR, theme);
  document.cookie = buildAiThemeCookie(theme);
  try {
    localStorage.setItem(AI_THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

type AiThemeProviderProps = {
  children: ReactNode;
  initialTheme?: AiTheme;
};

export function AiThemeProvider({ children, initialTheme = "light" }: AiThemeProviderProps) {
  const [theme, setThemeState] = useState<AiTheme>(initialTheme);
  const [isReady, setIsReady] = useState(false);
  const switching = useRef(false);
  const lockTimer = useRef<number | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AI_THEME_STORAGE_KEY);
      if ((stored === "dark" || stored === "light") && stored !== initialTheme) {
        setThemeState(stored);
      }
    } catch {
      /* ignore */
    }
    setIsReady(true);

    return () => {
      document.documentElement.removeAttribute(AI_THEME_HTML_ATTR);
    };
  }, [initialTheme]);

  useEffect(() => {
    if (!isReady) return;
    persistTheme(theme);
  }, [theme, isReady]);

  useEffect(() => {
    return () => {
      if (lockTimer.current !== null) window.clearTimeout(lockTimer.current);
    };
  }, []);

  const setTheme = useCallback((next: AiTheme) => {
    if (switching.current) return;
    switching.current = true;
    setThemeState(next);
    if (lockTimer.current !== null) window.clearTimeout(lockTimer.current);
    lockTimer.current = window.setTimeout(() => {
      switching.current = false;
      lockTimer.current = null;
    }, SWITCH_LOCK_MS);
  }, []);

  const toggleTheme = useCallback(() => {
    if (switching.current) return;
    switching.current = true;
    setThemeState((current) => (current === "light" ? "dark" : "light"));
    if (lockTimer.current !== null) window.clearTimeout(lockTimer.current);
    lockTimer.current = window.setTimeout(() => {
      switching.current = false;
      lockTimer.current = null;
    }, SWITCH_LOCK_MS);
  }, []);

  const value = useMemo(
    () => ({ theme, isReady, toggleTheme, setTheme }),
    [theme, isReady, toggleTheme, setTheme],
  );

  return <AiThemeContext.Provider value={value}>{children}</AiThemeContext.Provider>;
}

export function useAiTheme() {
  const ctx = useContext(AiThemeContext);
  if (!ctx) throw new Error("useAiTheme must be used within AiThemeProvider");
  return ctx;
}
