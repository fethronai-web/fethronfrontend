"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Trash2 } from "lucide-react";
import {
  ChatsIcon,
  NewChatIcon,
  SidebarToggleIcon,
} from "@/components/fethron-ai/ai-icons";
import { useAiSidebar } from "@/components/fethron-ai/ai-sidebar-context";
import { useAiAuth } from "@/components/fethron-ai/ai-auth-context";
import { AiBrandLockup } from "@/components/fethron-ai/ai-brand-lockup";
import { trpc } from "@/lib/trpc/client";
import type { ChatSummary } from "@/lib/trpc/types";

function SidebarIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="fethron-ai-sidebar-icon flex h-8 w-8 shrink-0 items-center justify-center">
      {children}
    </span>
  );
}

/** The tenant's saved chats. Logged-in only — anon chats are ephemeral. Refetches
 *  when a new chat is created (the hub dispatches `fethron-chats-changed`). */
function Recents({
  activeChatId,
  onPick,
  onActiveDeleted,
}: {
  activeChatId: string | null;
  onPick: (id: string) => void;
  onActiveDeleted: () => void;
}) {
  const { isAuthenticated } = useAiAuth();
  const [chats, setChats] = useState<ChatSummary[]>([]);

  const del = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setChats((cs) => cs.filter((c) => c.id !== id)); // optimistic
    trpc.chat.delete.mutate({ chatId: id }).catch(() => {});
    if (id === activeChatId) onActiveDeleted();
  };
  // Auth state only resolves on the client (Dynamic SDK), so gate the
  // auth-dependent UI behind mount to keep SSR and the first client render
  // identical — otherwise React reports a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const load = useCallback(() => {
    if (!isAuthenticated) {
      setChats([]);
      return;
    }
    trpc.chat.list
      .query()
      .then(setChats)
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    load();
    const onChanged = () => load();
    window.addEventListener("fethron-chats-changed", onChanged);
    return () => window.removeEventListener("fethron-chats-changed", onChanged);
  }, [load]);

  if (!mounted) {
    return <p className="fethron-ai-sidebar-muted px-2 py-1.5 text-[12px]">No recent chats yet</p>;
  }
  if (!isAuthenticated) {
    return (
      <p className="fethron-ai-sidebar-muted px-2 py-1.5 text-[12px]">
        Sign in to save your chats
      </p>
    );
  }
  if (chats.length === 0) {
    return <p className="fethron-ai-sidebar-muted px-2 py-1.5 text-[12px]">No recent chats yet</p>;
  }
  return (
    <div className="flex flex-col gap-0.5">
      {chats.map((c) => (
        <div key={c.id} className="group/recent relative">
          <button
            type="button"
            data-active={c.id === activeChatId}
            onClick={() => onPick(c.id)}
            className="fethron-ai-sidebar-item flex w-full items-center gap-2 rounded-xl py-1.5 pl-2 pr-8 text-left"
            title={c.title ?? "Chat"}
          >
            <span className="min-w-0 truncate text-[13px] font-medium">{c.title ?? "New chat"}</span>
          </button>
          <button
            type="button"
            onClick={(e) => del(e, c.id)}
            aria-label="Delete chat"
            className="fethron-ai-recent-del absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md opacity-0 transition-opacity group-hover/recent:opacity-100"
          >
            <Trash2 size={14} aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}

type AiSidebarProps = {
  activeChatId: string | null;
  onNewChat: () => void;
  onOpenChat: (id: string) => void;
};

export function AiSidebar({ activeChatId, onNewChat, onOpenChat }: AiSidebarProps) {
  const { open, closeSidebar } = useAiSidebar();

  // On mobile the sidebar is an overlay drawer — starting / opening a chat should
  // dismiss it so the content is revealed. On desktop it stays put.
  const isMobile = () =>
    typeof window !== "undefined" && !window.matchMedia("(min-width: 1024px)").matches;
  const newChat = () => {
    onNewChat();
    if (isMobile()) closeSidebar();
  };
  const pickChat = (id: string) => {
    onOpenChat(id);
    if (isMobile()) closeSidebar();
  };

  return (
    <>
      {/* dimmed backdrop — mobile only, click to dismiss */}
      <div
        onClick={closeSidebar}
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
      />

      <motion.aside
        initial={false}
        animate={{
          width: open ? "var(--ai-sidebar-width)" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden={!open}
        className="fethron-ai-sidebar fixed inset-y-0 left-0 z-50 h-dvh shrink-0 overflow-hidden lg:relative lg:inset-auto lg:z-30"
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
      <div className="flex h-full w-[var(--ai-sidebar-width)] flex-col">
        {open && (
          <div className="fethron-ai-sidebar-head flex shrink-0 items-center gap-2 px-3 py-3.5">
            <div className="min-w-0 flex-1 overflow-hidden">
              <AiBrandLockup variant="sidebar" markClassName="h-8 w-8" />
            </div>

            <button
              type="button"
              onClick={closeSidebar}
              aria-label="Close sidebar"
              className="fethron-ai-sidebar-icon-btn flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            >
              <SidebarToggleIcon size={17} aria-hidden />
            </button>
          </div>
        )}

        <nav className="flex shrink-0 flex-col gap-0.5 px-2">
          <button
            type="button"
            onClick={newChat}
            className="fethron-ai-sidebar-item flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left"
          >
            <SidebarIcon>
              <NewChatIcon size={17} aria-hidden />
            </SidebarIcon>
            <span className="truncate text-[13px] font-medium">New chat</span>
          </button>

          <button
            type="button"
            className="fethron-ai-sidebar-item fethron-ai-sidebar-item-muted flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left"
            disabled
          >
            <SidebarIcon>
              <ChatsIcon size={17} aria-hidden />
            </SidebarIcon>
            <span className="truncate text-[13px] font-medium">Chats</span>
          </button>
        </nav>

        <div className="fethron-ai-sidebar-divider mx-3.5 my-2.5" />

        <div className="min-h-0 flex-1 overflow-hidden px-2 pb-3">
          <p className="fethron-ai-sidebar-section mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
            Recents
          </p>
          <div className="fethron-ai-sidebar-recents min-h-0 flex-1 overflow-y-auto px-1">
            <Recents activeChatId={activeChatId} onPick={pickChat} onActiveDeleted={onNewChat} />
          </div>
        </div>
      </div>
    </motion.aside>
    </>
  );
}
