"use client";

import { motion } from "motion/react";
import {
  ChatsIcon,
  NewChatIcon,
  SidebarToggleIcon,
  ToolIcon,
} from "@/components/fethron-ai/ai-icons";
import { useAiSidebar } from "@/components/fethron-ai/ai-sidebar-context";
import { AiBrandLockup } from "@/components/fethron-ai/ai-brand-lockup";
import { AI_TOOLS, type AiToolId } from "@/config/ai-tools";

function SidebarIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="fethron-ai-sidebar-icon flex h-8 w-8 shrink-0 items-center justify-center">
      {children}
    </span>
  );
}

type AiSidebarProps = {
  activeToolId: AiToolId;
  onSelectTool: (id: AiToolId) => void;
  onNewChat: () => void;
};

export function AiSidebar({ activeToolId, onSelectTool, onNewChat }: AiSidebarProps) {
  const { open, closeSidebar } = useAiSidebar();

  // On mobile the sidebar is an overlay drawer — selecting a tool / starting a
  // chat should dismiss it so the content is revealed. On desktop it stays put.
  const isMobile = () =>
    typeof window !== "undefined" && !window.matchMedia("(min-width: 1024px)").matches;
  const selectTool = (id: AiToolId) => {
    onSelectTool(id);
    if (isMobile()) closeSidebar();
  };
  const newChat = () => {
    onNewChat();
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
            Tools
          </p>
          <div className="flex flex-col gap-0.5">
            {AI_TOOLS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                data-active={activeToolId === tool.id}
                onClick={() => selectTool(tool.id)}
                className="fethron-ai-sidebar-item flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left"
              >
                <SidebarIcon>
                  <ToolIcon id={tool.id} size={16} />
                </SidebarIcon>
                <span className="min-w-0 truncate text-[13px] font-medium">{tool.chipLabel}</span>
              </button>
            ))}
          </div>

          <p className="fethron-ai-sidebar-section mb-1.5 mt-4 px-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
            Recents
          </p>
          <div className="fethron-ai-sidebar-recents max-h-[10rem] overflow-y-auto px-1">
            <p className="fethron-ai-sidebar-muted px-2 py-1.5 text-[12px]">No recent chats yet</p>
          </div>
        </div>
      </div>
    </motion.aside>
    </>
  );
}
