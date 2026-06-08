"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useAiAuth } from "@/components/fethron-ai/ai-auth-context";
import {
  ChevronDownIcon,
  DocsIcon,
  LogInIcon,
  LogOutIcon,
  SidebarToggleIcon,
} from "@/components/fethron-ai/ai-icons";
import { useAiSidebar } from "@/components/fethron-ai/ai-sidebar-context";
import { AiBrandLockup } from "@/components/fethron-ai/ai-brand-lockup";
import { AiThemeToggle } from "@/components/fethron-ai/ai-theme-toggle";
import { FETHRON_AI } from "@/config/ai-tools";

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [active, onClose, ref]);
}

export function AiAuthBar() {
  const { user, isAuthenticated, isReady, openLogin, logout } = useAiAuth();
  const { open: sidebarOpen, toggleSidebar } = useAiSidebar();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  return (
    <header className="relative z-20 flex shrink-0 items-center justify-between gap-4 px-5 py-4 sm:px-8 sm:py-5">
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        {!sidebarOpen && (
          <>
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
              className="fethron-ai-sidebar-open-btn inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            >
              <SidebarToggleIcon size={18} aria-hidden />
            </button>
            <AiBrandLockup variant="bar" />
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
      <AiThemeToggle />
      {!isReady ? (
        <div className="h-9 w-[5.5rem] shrink-0 rounded-full opacity-0" aria-hidden />
      ) : isAuthenticated ? (
        <div ref={ref} className="relative">
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => setOpen((v) => !v)}
            className="fethron-ai-user-trigger inline-flex max-w-[14rem] items-center gap-2 rounded-full py-1.5 pl-1.5 pr-2.5 sm:max-w-[16rem] sm:pr-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--ai-primary)_22%,var(--ai-surface))] text-[var(--ai-primary)]">
              <span className="text-[12px] font-bold uppercase">{user!.name.charAt(0)}</span>
            </span>
            <span className="min-w-0 truncate text-[12px] font-semibold sm:text-[13px]">{user!.name}</span>
            <ChevronDownIcon
              size={14}
              className={`shrink-0 opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="fethron-ai-user-menu absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[11.5rem] overflow-hidden rounded-xl p-1.5"
              >
                <Link
                  href={FETHRON_AI.docsUrl}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="fethron-ai-user-menu-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium"
                >
                  <DocsIcon size={16} aria-hidden />
                  Docs
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="fethron-ai-user-menu-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium"
                >
                  <LogOutIcon size={16} aria-hidden />
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <button
          type="button"
          onClick={openLogin}
          className="fethron-ai-header-login inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] sm:text-[12px]"
        >
          <LogInIcon size={15} aria-hidden />
          Login
        </button>
      )}
      </div>
    </header>
  );
}
