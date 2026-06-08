"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AiSidebarContextValue = {
  open: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

const AiSidebarContext = createContext<AiSidebarContextValue | null>(null);

export function AiSidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);
  const toggleSidebar = useCallback(() => setOpen((v) => !v), []);

  const value = useMemo(
    () => ({ open, openSidebar, closeSidebar, toggleSidebar }),
    [open, openSidebar, closeSidebar, toggleSidebar],
  );

  return <AiSidebarContext.Provider value={value}>{children}</AiSidebarContext.Provider>;
}

export function useAiSidebar() {
  const ctx = useContext(AiSidebarContext);
  if (!ctx) throw new Error("useAiSidebar must be used within AiSidebarProvider");
  return ctx;
}
