"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AiUser = {
  id: string;
  name: string;
  email: string;
};

type AiAuthContextValue = {
  user: AiUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  loginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  login: (email: string) => void;
  logout: () => void;
};

const STORAGE_KEY = "fethron-ai-session";

const AiAuthContext = createContext<AiAuthContextValue | null>(null);

function displayNameFromEmail(email: string) {
  const local = email.split("@")[0]?.trim();
  if (!local) return "Builder";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export function AiAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AiUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AiUser);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user, isReady]);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const login = useCallback(
    (email: string) => {
      const trimmed = email.trim().toLowerCase();
      setUser({
        id: crypto.randomUUID(),
        email: trimmed,
        name: displayNameFromEmail(trimmed),
      });
      setLoginOpen(false);
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    setLoginOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isReady,
      loginOpen,
      openLogin,
      closeLogin,
      login,
      logout,
    }),
    [user, isReady, loginOpen, openLogin, closeLogin, login, logout],
  );

  return <AiAuthContext.Provider value={value}>{children}</AiAuthContext.Provider>;
}

export function useAiAuth() {
  const ctx = useContext(AiAuthContext);
  if (!ctx) throw new Error("useAiAuth must be used within AiAuthProvider");
  return ctx;
}
