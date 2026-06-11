"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import {
  FileText,
  LayoutGrid,
  Rocket,
  Scale,
  ShieldCheck,
  Sparkles,
  type LucideProps,
} from "lucide-react";
import {
  AI_MODELS,
  FETHRON_AI,
  TOOL_MODES,
  TOOL_SHOWCASE,
  getFethronAgentPath,
  getToolMode,
  type AiModelId,
  type ToolMode,
  type ToolShowcaseIcon,
} from "@/config/ai-tools";
import { AiAuthBar } from "@/components/fethron-ai/ai-auth-bar";
import { AiSidebar } from "@/components/fethron-ai/ai-sidebar";
import {
  AttachFileIcon,
  AttachPhotoIcon,
  CheckIcon,
  ChevronDownIcon,
  SendIcon,
} from "@/components/fethron-ai/ai-icons";
import { AiThemeBackground } from "@/components/fethron-ai/ai-theme-background";
import { AiPromptTextarea } from "@/components/fethron-ai/ai-prompt-textarea";
import { useAiTheme } from "@/components/fethron-ai/ai-theme-context";
import { useAiAuth } from "@/components/fethron-ai/ai-auth-context";
import { useAiSidebar } from "@/components/fethron-ai/ai-sidebar-context";
import { MessageList } from "@/components/fethron-ai/chat/message-list";
import { messagesFromDto, uiId, type UiMessage } from "@/components/fethron-ai/chat/types";
import { trpc } from "@/lib/trpc/client";
import { BrandMark } from "@/components/ui/brand-mark";
import { FloatingSocial } from "@/components/layout/floating-social";

const TOOL_MODE_ICON: Record<ToolMode, (p: LucideProps) => React.ReactElement> = {
  auto: (p) => <Sparkles {...p} />,
  "know-your-vision": (p) => <Rocket {...p} />,
  "smart-contract-audit": (p) => <ShieldCheck {...p} />,
};

const TOOL_SHOWCASE_ICON: Record<ToolShowcaseIcon, (p: LucideProps) => React.ReactElement> = {
  rocket: (p) => <Rocket {...p} />,
  shield: (p) => <ShieldCheck {...p} />,
  resume: (p) => <FileText {...p} />,
  architect: (p) => <LayoutGrid {...p} />,
  legal: (p) => <Scale {...p} />,
};

/**
 * Tool library under the composer (home only). Live tools nudge the user to the
 * composer's tool dropdown via `onPick` (they don't force a selection); future
 * tools render disabled with a "Soon" badge.
 */
function ToolShowcase({ onPick }: { onPick: () => void }) {
  return (
    <div className="mt-5 grid w-full max-w-2xl grid-cols-2 gap-2.5 sm:mt-7 sm:max-w-5xl sm:grid-cols-3 lg:grid-cols-5">
      {TOOL_SHOWCASE.map((t) => {
        const Icon = TOOL_SHOWCASE_ICON[t.icon];
        return (
          <button
            key={t.id}
            type="button"
            disabled={!t.available}
            onClick={t.available ? onPick : undefined}
            data-soon={!t.available || undefined}
            aria-label={t.available ? `${t.label} — choose it from the tool menu` : `${t.label} — coming soon`}
            className="fethron-ai-tool-chip group relative flex flex-col gap-2.5 rounded-2xl p-3.5 text-left disabled:cursor-not-allowed"
          >
            {!t.available && (
              <span className="absolute right-2.5 top-2.5 rounded-full bg-[var(--ai-primary)] px-1.5 py-[2px] text-[7.5px] font-bold uppercase leading-none tracking-[0.12em] text-white">
                Soon
              </span>
            )}
            <span className="fethron-ai-tool-ico flex h-8 w-8 items-center justify-center rounded-xl">
              <Icon className="h-[17px] w-[17px]" strokeWidth={1.9} />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-[12.5px] font-semibold leading-[1.25] tracking-[-0.01em] text-[var(--ai-text)]">
                {t.label}
              </span>
              <span className="text-[10.5px] leading-[1.35] text-[var(--ai-text-muted)]">{t.hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

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
  openUp,
}: {
  activeId: AiModelId;
  onSelect: (id: AiModelId) => void;
  openUp?: boolean;
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
        className="fethron-ai-model-picker inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12px] font-semibold sm:px-3 sm:text-[13px]"
      >
        <span>{active.name}</span>
        <ChevronDownIcon size={14} className={`shrink-0 opacity-70 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: openUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUp ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`fethron-ai-model-menu absolute right-0 z-50 min-w-[14rem] overflow-hidden rounded-xl p-1.5 sm:min-w-[15.5rem] ${
              openUp ? "bottom-[calc(100%+0.5rem)]" : "top-[calc(100%+0.5rem)]"
            }`}
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

function AttachMenu({ openUp, onAdd }: { openUp?: boolean; onAdd: (files: FileList | null) => void }) {
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAdd(e.target.files);
    e.target.value = ""; // allow re-selecting the same file
  };

  return (
    <div ref={ref} className="relative">
      <input
        ref={fileRef}
        type="file"
        multiple
        accept=".sol,.txt,.md,.json,text/*"
        className="sr-only"
        tabIndex={-1}
        onChange={onChange}
      />
      <input ref={photoRef} type="file" multiple accept="image/*" className="sr-only" tabIndex={-1} onChange={onChange} />

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
            initial={{ opacity: 0, y: openUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUp ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`fethron-ai-attach-menu absolute left-0 z-50 min-w-[11.5rem] overflow-hidden rounded-xl p-1.5 ${
              openUp ? "bottom-[calc(100%+0.5rem)]" : "top-[calc(100%+0.5rem)]"
            }`}
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

/** The composer's tool selector. "Auto" is default; the others force a tool. */
function ToolModePicker({
  activeId,
  onSelect,
  disabled,
  openUp,
}: {
  activeId: ToolMode;
  onSelect: (id: ToolMode) => void;
  disabled?: boolean;
  openUp?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = getToolMode(activeId);
  const ActiveIcon = TOOL_MODE_ICON[activeId];

  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="fethron-ai-model-picker inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12px] font-semibold disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-[13px]"
      >
        <ActiveIcon size={14} className="shrink-0 text-[var(--ai-primary)]" aria-hidden />
        <span className="max-w-[8.5rem] truncate sm:max-w-none">{active.label}</span>
        <ChevronDownIcon size={14} className={`shrink-0 opacity-70 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: openUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUp ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`fethron-ai-model-menu absolute left-0 z-50 min-w-[15rem] overflow-hidden rounded-xl p-1.5 sm:min-w-[16.5rem] ${
              openUp ? "bottom-[calc(100%+0.5rem)]" : "top-[calc(100%+0.5rem)]"
            }`}
          >
            {TOOL_MODES.map((mode) => {
              const Icon = TOOL_MODE_ICON[mode.id];
              return (
                <button
                  key={mode.id}
                  type="button"
                  role="option"
                  aria-selected={mode.id === activeId}
                  onClick={() => {
                    onSelect(mode.id);
                    setOpen(false);
                  }}
                  className="fethron-ai-model-item flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left"
                  data-active={mode.id === activeId}
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--ai-primary)_14%,transparent)] text-[var(--ai-primary)]">
                    <Icon size={15} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold">{mode.label}</span>
                    <span className="mt-0.5 block text-[11px] leading-snug opacity-70">{mode.hint}</span>
                  </span>
                  {mode.id === activeId && (
                    <span className="mt-1 shrink-0 text-[var(--ai-primary)]">
                      <CheckIcon size={14} />
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionButton({
  state,
  hasText,
  onSend,
  onStop,
}: {
  state: "idle" | "sending" | "running";
  hasText: boolean;
  onSend: () => void;
  onStop: () => void;
}) {
  if (state === "running") {
    return (
      <button
        type="button"
        onClick={onStop}
        aria-label="Stop"
        data-ready
        className="fethron-ai-send-btn inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
      >
        <span className="block h-3 w-3 rounded-[3px] bg-current" aria-hidden />
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onSend}
      disabled={!hasText || state === "sending"}
      aria-label={state === "sending" ? "Sending" : "Send"}
      data-ready={hasText && state !== "sending"}
      className="fethron-ai-send-btn inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
    >
      {state === "sending" ? (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] animate-spin" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
          <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ) : (
        <SendIcon size={18} aria-hidden />
      )}
    </button>
  );
}

interface Attachment {
  name: string;
  content: string; // file text, or data-URL for images (backend strips the prefix)
  mediaType?: string;
  kind: "image" | "file";
  previewUrl?: string;
}

// Per-file cap on the RAW file (what the user sees as "5MB"). The backend's
// UPLOAD_MAX_BYTES is set higher (7MB on the sent content) so a 5MB image's larger
// base64 still passes there. Bounds abuse + token burn while staying generous.
const MAX_ATTACH_BYTES = 5_000_000;
const MAX_ATTACH_COUNT = 8;

export function AiToolsHub({
  initialChatId,
  initialMessages,
}: {
  initialChatId?: string;
  initialMessages?: UiMessage[];
} = {}) {
  const greeting = useGreeting();
  const [toolMode, setToolMode] = useState<ToolMode>("auto");
  const [modelId, setModelId] = useState<AiModelId>("fethron-m3");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<UiMessage[]>(initialMessages ?? []);
  const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId ?? null);
  const [activeRunId, setActiveRunId] = useState<string | null>(() => lastRunId(initialMessages ?? []));
  const [isSending, setIsSending] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [attachNote, setAttachNote] = useState<string | null>(null);
  // Brief "select a tool" nudge toward the composer's tool dropdown, fired when a
  // tool button below the composer is clicked (the button itself never selects).
  const [toolHint, setToolHint] = useState(false);
  const toolHintTimer = useRef<number | null>(null);
  const flashToolHint = useCallback(() => {
    setToolHint(true);
    if (toolHintTimer.current) window.clearTimeout(toolHintTimer.current);
    toolHintTimer.current = window.setTimeout(() => setToolHint(false), 4500);
  }, []);
  useEffect(() => () => { if (toolHintTimer.current) window.clearTimeout(toolHintTimer.current); }, []);
  const hasText = input.trim().length > 0;
  const canSend = hasText || attachments.length > 0;
  const isChat = messages.length > 0;
  const runActive = activeRunId !== null;

  const addFiles = useCallback(async (list: FileList | File[] | null) => {
    if (!list) return;
    // Allow images (Vision references) and text source — .sol/.txt/.md/.json or any
    // text/* type. Reject binary junk (.pdf/.zip/.exe/…) right here so it can't be
    // attached via picker, drag-drop, OR paste.
    const allowed = (f: File) =>
      f.type.startsWith("image/") || f.type.startsWith("text/") || /\.(sol|txt|md|json)$/i.test(f.name);
    const all = Array.from(list);
    const blocked = all.filter((f) => !allowed(f)).map((f) => f.name);
    const okType = all.filter(allowed);
    const oversized = okType.filter((f) => f.size > MAX_ATTACH_BYTES).map((f) => f.name);
    const ok = okType.filter((f) => f.size <= MAX_ATTACH_BYTES);
    const read = await Promise.all(
      ok.map(
        (file) =>
          new Promise<Attachment | null>((resolve) => {
            const image = file.type.startsWith("image/");
            const r = new FileReader();
            r.onerror = () => resolve(null);
            r.onload = () => {
              const content = String(r.result);
              resolve(
                image
                  ? { name: file.name || "image", content, mediaType: file.type, kind: "image", previewUrl: content }
                  : { name: file.name || "file", content, kind: "file" },
              );
            };
            if (image) r.readAsDataURL(file);
            else r.readAsText(file);
          }),
      ),
    );
    const fresh = read.filter((a): a is Attachment => a != null);
    let overflow = 0;
    setAttachments((cur) => {
      const merged = [...cur, ...fresh];
      overflow = Math.max(0, merged.length - MAX_ATTACH_COUNT);
      return merged.slice(0, MAX_ATTACH_COUNT);
    });
    const notes: string[] = [];
    if (blocked.length) notes.push("Only images and .sol/text files can be attached (no video/binary)");
    if (oversized.length) notes.push(`skipped ${oversized.length} over ${MAX_ATTACH_BYTES / 1_000_000}MB`);
    if (overflow) notes.push(`max ${MAX_ATTACH_COUNT} files at once`);
    setAttachNote(notes.length ? `${notes.join(" · ")}.` : null);
  }, []);

  const removeAttachment = useCallback((i: number) => {
    setAttachments((cur) => cur.filter((_, n) => n !== i));
    setAttachNote(null);
  }, []);

  // The skip/limit note is a transient heads-up — auto-clear it after a few seconds
  // (the user can also dismiss it manually with the ×).
  useEffect(() => {
    if (!attachNote) return;
    const t = setTimeout(() => setAttachNote(null), 6000);
    return () => clearTimeout(t);
  }, [attachNote]);

  // Drop-anywhere on the agent surface: dropping a file ONLY on the composer is
  // fiddly (and a near-miss makes the browser navigate to the file). Listen at the
  // window so a drop anywhere attaches, and always preventDefault so the browser
  // never opens the file. A drag counter avoids flicker as the cursor crosses
  // child elements.
  useEffect(() => {
    let depth = 0;
    const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes("Files");
    const onOver = (e: DragEvent) => {
      if (hasFiles(e)) e.preventDefault();
    };
    const onEnter = (e: DragEvent) => {
      if (hasFiles(e)) {
        depth += 1;
        setDragActive(true);
      }
    };
    const onLeave = () => {
      depth = Math.max(0, depth - 1);
      if (depth === 0) setDragActive(false);
    };
    const onDrop = (e: DragEvent) => {
      depth = 0;
      setDragActive(false);
      if (e.dataTransfer?.files?.length) {
        e.preventDefault();
        void addFiles(e.dataTransfer.files);
      }
    };
    window.addEventListener("dragover", onOver);
    window.addEventListener("dragenter", onEnter);
    window.addEventListener("dragleave", onLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragover", onOver);
      window.removeEventListener("dragenter", onEnter);
      window.removeEventListener("dragleave", onLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [addFiles]);

  const { theme } = useAiTheme();
  const { openSidebar } = useAiSidebar();
  const { isAuthenticated, isReady } = useAiAuth();

  const handleNewChat = useCallback(() => {
    setInput("");
    setMessages([]);
    setAttachments([]);
    setAttachNote(null);
    setActiveChatId(null);
    setActiveRunId(null);
    setToolMode("auto");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", getFethronAgentPath());
    }
  }, []);

  // Reset to a fresh hub on a real login OR logout — the open thread belongs to
  // the previous identity (an anon chat after login, or a tenant chat after
  // logout). Gated on `isReady` + a baseline so the SDK's initial hydration
  // (which also flips isAuthenticated) does NOT wipe a freshly-resumed chat.
  const prevAuth = useRef<boolean | null>(null);
  useEffect(() => {
    if (!isReady) return;
    if (prevAuth.current === null) {
      prevAuth.current = isAuthenticated; // first settled read → baseline only
      return;
    }
    if (prevAuth.current !== isAuthenticated) {
      prevAuth.current = isAuthenticated;
      handleNewChat();
    }
  }, [isReady, isAuthenticated, handleNewChat]);

  // Open a saved chat IN PLACE — no route navigation (which would remount + re-
  // compile in dev and feel slow). Just one fast query, then swap the transcript
  // and sync the URL for deep-linking.
  const handleOpenChat = useCallback(
    async (id: string) => {
      if (id === activeChatId || isLoadingChat) return;
      setIsLoadingChat(true);
      try {
        const rows = await trpc.chat.messages.query({ chatId: id });
        const ui = messagesFromDto(rows);
        setMessages(ui);
        setActiveRunId(lastRunId(ui)); // a trailing run may still be in flight
        setActiveChatId(id);
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", getFethronAgentPath(`c/${id}`));
        }
      } catch {
        // stay put on failure (e.g. not signed in / foreign chat)
      } finally {
        setIsLoadingChat(false);
      }
    },
    [activeChatId, isLoadingChat],
  );

  const handleSend = useCallback(async () => {
    const typed = input.trim();
    if ((!typed && attachments.length === 0) || isSending || runActive) return;
    const atts = attachments;
    // If they only attached files, give the agent a sensible default instruction.
    const text =
      typed ||
      (atts.some((a) => /\.sol$/i.test(a.name) || a.kind === "file")
        ? "Please audit the attached contract file(s)."
        : "Here's a reference — turn it into a plan.");
    setInput("");
    setAttachments([]);
    setAttachNote(null);
    // Reveal the chat sidebar on DESKTOP only. On mobile it's an overlay drawer —
    // auto-opening it on every send would cover the conversation each time.
    if (typeof window === "undefined" || window.matchMedia("(min-width: 1024px)").matches) {
      openSidebar();
    }
    // Show the user's turn AND an assistant "thinking" placeholder immediately, so
    // there's feedback on the assistant side while the router decides (~1-2s).
    const userId = uiId();
    const pendingId = uiId();
    setMessages((m) => [
      ...m,
      {
        id: userId,
        role: "user",
        text: typed,
        ...(atts.length
          ? { attachments: atts.map((a) => ({ name: a.name, kind: a.kind, ...(a.previewUrl ? { previewUrl: a.previewUrl } : {}) })) }
          : {}),
      },
      { id: pendingId, role: "assistant", kind: "pending" },
    ]);
    setIsSending(true);
    const replacePending = (msg: UiMessage) =>
      setMessages((m) => m.map((x) => (x.id === pendingId ? msg : x)));
    try {
      const res = await trpc.chat.send.mutate({
        message: text,
        chatId: activeChatId ?? undefined,
        mode: toolMode,
        ...(atts.length
          ? { files: atts.map((a) => ({ name: a.name, content: a.content, ...(a.mediaType ? { mediaType: a.mediaType } : {}) })) }
          : {}),
      });
      if (res.kind === "run") {
        setActiveRunId(res.runId); // lock the composer until it settles
        replacePending({ id: pendingId, role: "assistant", kind: "run", runId: res.runId, tool: res.tool });
      } else {
        replacePending({ id: pendingId, role: "assistant", kind: "text", intent: res.intent, text: res.text, animate: true });
      }
      if (res.chatId && res.chatId !== activeChatId) {
        setActiveChatId(res.chatId);
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", getFethronAgentPath(`c/${res.chatId}`));
          window.dispatchEvent(new CustomEvent("fethron-chats-changed"));
        }
      }
    } catch (e) {
      // The send never landed (e.g. a network blip / server reload). Roll the turn
      // back and RESTORE the composer — text + the exact files — so the user can
      // retry with one click instead of re-uploading. A failed "retry" typed as a
      // new message would otherwise lose the attachments entirely.
      setMessages((m) => m.filter((x) => x.id !== userId && x.id !== pendingId));
      setInput(typed);
      setAttachments(atts);
      setAttachNote(`Couldn't send (${friendlyError(e)}). Your files are still here — press send to retry.`);
    } finally {
      setIsSending(false);
    }
  }, [input, attachments, isSending, runActive, activeChatId, toolMode, openSidebar]);

  const handleStop = useCallback(() => {
    const runId = activeRunId;
    if (!runId) return;
    setActiveRunId(null); // unlock the composer at once
    // Flip the run bubble to "interrupted" immediately — don't wait for the
    // backend abort to round-trip through SSE.
    setMessages((m) =>
      m.map((x) =>
        x.role === "assistant" && x.kind === "run" && x.runId === runId ? { ...x, canceled: true } : x,
      ),
    );
    trpc.chat.cancel.mutate({ runId }).catch(() => {});
  }, [activeRunId]);

  // A run bubble tells us when its stream ends → unlock the composer.
  const handleRunSettled = useCallback((runId: string) => {
    setActiveRunId((cur) => (cur === runId ? null : cur));
  }, []);

  const onComposerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!runActive) void handleSend();
    }
  };

  const onComposerPaste = (e: React.ClipboardEvent) => {
    // Pasted files arrive either as `files` (most browsers) or only via `items`
    // (some image pastes). Grab whichever has them — any file type, not just images.
    const direct = Array.from(e.clipboardData.files ?? []);
    const fromItems = Array.from(e.clipboardData.items ?? [])
      .filter((it) => it.kind === "file")
      .map((it) => it.getAsFile())
      .filter((f): f is File => !!f);
    const files = direct.length ? direct : fromItems;
    if (files.length) {
      e.preventDefault(); // a file paste — don't also dump junk into the textarea
      void addFiles(files);
    }
    // No files → plain text paste; let it land in the textarea normally.
  };

  const composer = (
    <div
      className={`fethron-ai-prompt relative z-20 w-full rounded-[1.25rem] px-4 py-3 transition-shadow sm:rounded-[1.5rem] sm:px-5 sm:py-4 ${
        dragActive ? "ring-2 ring-[var(--ai-primary)] ring-offset-2 ring-offset-transparent" : ""
      }`}
    >
      <label htmlFor="ai-prompt" className="sr-only">
        Message Fethron AI
      </label>

      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((a, i) => (
            <div
              key={`${a.name}-${i}`}
              className="group relative flex items-center gap-2 rounded-xl border border-[var(--ai-border)] bg-[var(--ai-glass)] py-1.5 pl-1.5 pr-2.5"
            >
              {a.kind === "image" && a.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.previewUrl} alt={a.name} className="h-8 w-8 shrink-0 rounded-lg object-cover" />
              ) : (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--ai-primary)_14%,transparent)] text-[var(--ai-primary)]">
                  <AttachFileIcon size={15} />
                </span>
              )}
              <span className="max-w-[9rem] truncate text-[12px] font-medium text-[var(--ai-text)]">{a.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(i)}
                aria-label={`Remove ${a.name}`}
                className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ai-text-muted)] text-[10px] leading-none text-white opacity-80 hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {attachNote && (
        <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-[var(--ai-primary)]">
          <span>{attachNote}</span>
          <button
            type="button"
            onClick={() => setAttachNote(null)}
            aria-label="Dismiss"
            className="flex h-4 w-4 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--ai-primary)_18%,transparent)] text-[11px] leading-none opacity-80 hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}

      <AiPromptTextarea
        id="ai-prompt"
        value={input}
        compact={isChat}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onComposerKeyDown}
        onPaste={onComposerPaste}
        placeholder={runActive ? "Working… press stop to interrupt" : isChat ? "Reply to Fethron AI…" : getToolMode(toolMode).placeholder}
        className="fethron-ai-prompt-field w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none sm:text-base"
      />

      <div className="fethron-ai-prompt-toolbar mt-1 flex flex-wrap items-center gap-2 pt-1">
        <AttachMenu openUp={isChat} onAdd={addFiles} />

        <div className="ml-auto flex flex-wrap items-center justify-end gap-2 sm:gap-2.5">
          <AnimatePresence>
            {toolHint && (
              <motion.span
                key="tool-hint"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="hidden items-center gap-1 whitespace-nowrap text-[12px] font-semibold text-[var(--ai-primary)] sm:flex"
              >
                Select a tool
                <motion.span aria-hidden="true" animate={{ x: [0, 5, 0] }} transition={{ duration: 0.9, repeat: Infinity }}>
                  →
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
          {/* Tool dropdown — locked while a run is in flight. The buttons below the
              composer point the user here instead of forcing a selection. */}
          <span className={`inline-flex rounded-full ${toolHint ? "fethron-ai-tool-pulse" : ""}`}>
            <ToolModePicker
              activeId={toolMode}
              onSelect={setToolMode}
              disabled={runActive || isSending}
              openUp={isChat}
            />
          </span>
          <ModelPicker activeId={modelId} onSelect={setModelId} openUp={isChat} />
          <ActionButton
            state={runActive ? "running" : isSending ? "sending" : "idle"}
            hasText={canSend}
            onSend={() => void handleSend()}
            onStop={handleStop}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="fethron-ai relative flex h-dvh flex-col overflow-hidden"
      data-theme={theme}
      data-chat={isChat ? "true" : undefined}
      suppressHydrationWarning
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <AiThemeBackground theme={theme} />
        {/* Chat mode: a near-opaque themed scrim (gradient + faint texture) over the
            scenery — reads cleanly but keeps a whisper of depth. */}
        {isChat && <div className="fethron-ai-chat-bg" />}
      </div>

      <LayoutGroup id="fethron-ai-shell">
        <div className="relative z-10 flex min-h-0 min-w-0 flex-1">
          <AiSidebar
            activeChatId={activeChatId}
            onNewChat={handleNewChat}
            onOpenChat={handleOpenChat}
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <AiAuthBar />
            <main id="main-content" className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {isChat ? (
                <>
                  <div className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 sm:px-6">
                    {/* Thin, unobtrusive top progress while a chat loads in place. */}
                    {isLoadingChat && (
                      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden">
                        <div className="fethron-ai-loadbar h-full w-1/3 bg-[var(--ai-primary)]" />
                      </div>
                    )}
                    <MessageList messages={messages} onRunSettled={handleRunSettled} />
                  </div>
                  <div className="shrink-0 px-4 pb-5 pt-2 sm:px-6">
                    <div className="mx-auto w-full max-w-3xl">{composer}</div>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center overflow-y-auto overflow-x-hidden px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8">
                  <div className="my-auto flex w-full flex-col items-center">
                    <div className="fethron-ai-greeting mb-8 text-center sm:mb-10">
                      <div className="flex items-center justify-center gap-2.5 sm:gap-4">
                        <span className="h-8 w-8 shrink-0 sm:h-11 sm:w-11" aria-hidden="true">
                          <BrandMark variant="red" />
                        </span>
                        <p className="font-display whitespace-nowrap text-[clamp(1.3rem,5.6vw,3.5rem)] font-medium leading-[1.08]">
                          {greeting}, builder
                        </p>
                      </div>
                      <p className="fethron-ai-subtitle font-display mx-auto mt-3.5 max-w-xl text-[15px] font-normal italic leading-relaxed sm:mt-4 sm:text-[17px]">
                        &ldquo;{FETHRON_AI.agentTagline}&rdquo;
                      </p>
                    </div>

                    <div className="w-full max-w-3xl sm:max-w-4xl">{composer}</div>
                    <ToolShowcase onPick={flashToolHint} />
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </LayoutGroup>

      {/* Hub: corner dock. Chat on mobile: right-centre so the composer stays clear. */}
      <FloatingSocial
        channels={["whatsapp", "discord"]}
        placement={isChat ? "agent" : "bottom-right"}
        alwaysVisible
      />
    </div>
  );
}

/** The runId of a trailing assistant run turn (the only one that can still be in
 *  flight), or null. */
function lastRunId(messages: UiMessage[]): string | null {
  const last = messages[messages.length - 1];
  return last && last.role === "assistant" && last.kind === "run" ? last.runId : null;
}

/** A safe, human error string. The backend already masks internal errors, but
 *  this is a belt-and-braces filter so a raw/JSON/SQL-looking message (e.g. a zod
 *  validation array) never reaches the user. */
function friendlyError(e: unknown): string {
  const raw = e instanceof Error ? e.message.trim() : "";
  const looksRaw =
    !raw ||
    raw.length > 200 ||
    /^[[{]/.test(raw) ||
    /validation|invalid_|insert into|select |update |delete from|"params"|TRPCError|ECONNREFUSED|fetch failed/i.test(raw);
  return looksRaw ? "Something went wrong. Please try again." : raw;
}
