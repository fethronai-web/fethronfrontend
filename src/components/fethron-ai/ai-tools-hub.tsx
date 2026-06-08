"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { AI_MODELS, AI_TOOLS, FETHRON_AI, type AiModelId, type AiTool, type AiToolId } from "@/config/ai-tools";
import { AiAuthBar } from "@/components/fethron-ai/ai-auth-bar";
import { AiSidebar } from "@/components/fethron-ai/ai-sidebar";
import {
  AttachFileIcon,
  AttachPhotoIcon,
  CheckIcon,
  ChevronDownIcon,
  SendIcon,
  ToolIcon,
} from "@/components/fethron-ai/ai-icons";
import { AiThemeBackground } from "@/components/fethron-ai/ai-theme-background";
import { AiPromptTextarea } from "@/components/fethron-ai/ai-prompt-textarea";
import { useAiTheme } from "@/components/fethron-ai/ai-theme-context";
import { BrandMark } from "@/components/ui/brand-mark";

function useGreeting() {
  return useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, []);
}

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

function ModelPicker({
  activeId,
  onSelect,
}: {
  activeId: AiModelId;
  onSelect: (id: AiModelId) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = AI_MODELS.find((m) => m.id === activeId)!;

  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className="fethron-ai-model-picker inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold sm:text-[13px]"
      >
        <span>{active.name}</span>
        <ChevronDownIcon size={14} className={`shrink-0 opacity-70 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fethron-ai-model-menu absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[14rem] overflow-hidden rounded-xl p-1.5 sm:min-w-[15.5rem]"
          >
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                type="button"
                role="option"
                aria-selected={model.id === activeId}
                onClick={() => {
                  onSelect(model.id);
                  setOpen(false);
                }}
                className="fethron-ai-model-item flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left"
                data-active={model.id === activeId}
              >
                <span>
                  <span className="block text-[13px] font-semibold">{model.name}</span>
                  <span className="mt-0.5 block text-[11px] leading-snug opacity-70">
                    {model.description}
                  </span>
                </span>
                {model.id === activeId && (
                  <span className="mt-0.5 shrink-0 text-[var(--ai-primary)]">
                    <CheckIcon size={14} />
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AttachMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  const pickFile = () => {
    fileRef.current?.click();
    setOpen(false);
  };

  const pickPhoto = () => {
    photoRef.current?.click();
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <input
        ref={fileRef}
        type="file"
        className="sr-only"
        tabIndex={-1}
        onChange={() => {
          /* wire upload later */
        }}
      />
      <input
        ref={photoRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={() => {
          /* wire upload later */
        }}
      />

      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Add attachment"
        onClick={() => setOpen((v) => !v)}
        className="fethron-ai-icon-btn inline-flex shrink-0 items-center justify-center px-1 py-1 text-2xl leading-none"
      >
        +
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fethron-ai-attach-menu absolute left-0 top-[calc(100%+0.5rem)] z-50 min-w-[11.5rem] overflow-hidden rounded-xl p-1.5"
          >
            <button type="button" role="menuitem" onClick={pickFile} className="fethron-ai-attach-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium">
              <AttachFileIcon size={16} aria-hidden />
              Add file
            </button>
            <button type="button" role="menuitem" onClick={pickPhoto} className="fethron-ai-attach-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium">
              <AttachPhotoIcon size={16} aria-hidden />
              Add photo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuickChip({
  tool,
  active,
  onSelect,
}: {
  tool: AiTool;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      data-active={active}
      aria-pressed={active}
      onClick={onSelect}
      className="fethron-ai-chip group flex min-w-[10.5rem] items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left sm:min-w-[11.5rem] sm:px-4 sm:py-3"
    >
      <span className="fethron-ai-chip-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
        <ToolIcon id={tool.id} size={17} />
      </span>
      <span className="min-w-0">
        <span className="fethron-ai-chip-label block text-[13px] font-semibold leading-tight tracking-tight">
          {tool.chipLabel}
        </span>
        <span className="fethron-ai-chip-hint mt-0.5 block text-[10px] font-medium leading-snug">
          {tool.chipHint}
        </span>
      </span>
    </button>
  );
}

export function AiToolsHub() {
  const greeting = useGreeting();
  const [activeId, setActiveId] = useState<AiToolId>("roadmap-oracle");
  const [modelId, setModelId] = useState<AiModelId>("fethron-m3");
  const [input, setInput] = useState("");
  const activeTool = AI_TOOLS.find((t) => t.id === activeId)!;
  const hasText = input.trim().length > 0;

  const { theme } = useAiTheme();

  const handleNewChat = () => {
    setInput("");
    setActiveId("roadmap-oracle");
  };

  return (
    <div
      className="fethron-ai relative flex min-h-dvh flex-col overflow-hidden"
      data-theme={theme}
      suppressHydrationWarning
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <AiThemeBackground theme={theme} />
      </div>

      <LayoutGroup id="fethron-ai-shell">
        <div className="relative z-10 flex min-h-dvh min-w-0 flex-1">
          <AiSidebar
            activeToolId={activeId}
            onSelectTool={setActiveId}
            onNewChat={handleNewChat}
          />

          <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
            <AiAuthBar />
            <main
              id="main-content"
              className="flex flex-1 flex-col items-center overflow-y-auto px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8"
            >
        <div className="my-auto flex w-full flex-col items-center">
        <div className="fethron-ai-greeting mb-8 text-center sm:mb-10">
          <div className="flex items-center justify-center gap-2.5 sm:gap-4">
            <span className="h-8 w-8 shrink-0 sm:h-11 sm:w-11" aria-hidden="true">
              <BrandMark variant="red" />
            </span>
            <p className="font-display whitespace-nowrap text-[clamp(1.5rem,7vw,3.5rem)] font-medium leading-[1.08]">
              {greeting}, builder
            </p>
          </div>
          <p className="fethron-ai-subtitle font-display mx-auto mt-3.5 max-w-xl text-[15px] font-normal italic leading-relaxed sm:mt-4 sm:text-[17px]">
            &ldquo;{FETHRON_AI.agentTagline}&rdquo;
          </p>
        </div>

        <div className="fethron-ai-prompt relative z-20 w-full max-w-3xl rounded-[1.25rem] px-4 py-3 sm:max-w-4xl sm:rounded-[1.5rem] sm:px-5 sm:py-4">
          <label htmlFor="ai-prompt" className="sr-only">
            {activeTool.name} input
          </label>
          <AiPromptTextarea
            id="ai-prompt"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={activeTool.inputPlaceholder}
            className="fethron-ai-prompt-field w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none sm:text-base"
          />

          <div className="fethron-ai-prompt-toolbar mt-1 flex items-center gap-2 pt-1">
            <AttachMenu />

            <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
              <ModelPicker activeId={modelId} onSelect={setModelId} />

              <button
                type="button"
                disabled={!hasText}
                aria-label={activeTool.actionLabel}
                data-ready={hasText}
                className="fethron-ai-send-btn inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              >
                <SendIcon size={18} aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-0 mt-5 w-full max-w-4xl sm:mt-6">
          <p className="fethron-ai-chip-heading mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.22em]">
            Pick a tool
          </p>
          <div className="flex flex-wrap items-stretch justify-center gap-2.5 sm:gap-3">
            {AI_TOOLS.map((tool) => (
              <QuickChip
                key={tool.id}
                tool={tool}
                active={activeId === tool.id}
                onSelect={() => setActiveId(tool.id)}
              />
            ))}
          </div>
        </div>
        </div>
            </main>
          </div>
        </div>
      </LayoutGroup>
    </div>
  );
}
