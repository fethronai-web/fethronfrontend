"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FileText } from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";
import { trpc } from "@/lib/trpc/client";
import type { RunResultDto } from "@/lib/trpc/types";
import type { BackendToolKind } from "@/config/ai-tools";
import { ReportCard } from "./report-card";
import { RunProgress } from "./run-progress";
import { TypedReveal } from "./typed-reveal";
import { useRunStream } from "./use-run-stream";
import type { UiMessage } from "./types";

function summaryLine(tool: BackendToolKind): string {
  return tool === "smart-contract-audit"
    ? "Your smart-contract audit is ready. Open the report below for the full security read."
    : "Done — your Vision to Launch blueprint is ready. Open it below, and let's build it. 🚀";
}

function Avatar() {
  return (
    <span className="mt-0.5 h-7 w-7 shrink-0" aria-hidden="true">
      <BrandMark variant="red" />
    </span>
  );
}

function AssistantRow({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="flex w-full gap-3"
    >
      <Avatar />
      <div className="min-w-0 flex-1 pt-0.5 text-[15px] leading-relaxed text-[var(--ai-text)]">
        {children}
      </div>
    </motion.div>
  );
}

const TERMINAL = new Set(["completed", "failed", "canceled"]);

function RunBubble({
  runId,
  tool,
  canceled,
  historical,
  onActivity,
  onRunSettled,
}: {
  runId: string;
  tool: BackendToolKind;
  canceled?: boolean;
  historical?: boolean;
  onActivity?: () => void;
  onRunSettled?: (runId: string) => void;
}) {
  // A run loaded from history is almost always already settled. Read its status
  // ONCE (a tiny lean query) instead of opening a live SSE stream per past run —
  // this is what makes a chat with many reports open fast. Only if it's somehow
  // still in flight (e.g. refreshed mid-run) do we fall through to streaming.
  const [hist, setHist] = useState<RunResultDto | null>(null);
  const [histChecked, setHistChecked] = useState(!historical);

  useEffect(() => {
    if (!historical) return;
    let alive = true;
    trpc.chat.runResult
      .query({ runId })
      .then((r) => {
        if (alive) {
          setHist(r);
          setHistChecked(true);
        }
      })
      .catch(() => {
        if (alive) setHistChecked(true);
      });
    return () => {
      alive = false;
    };
  }, [historical, runId]);

  const histTerminal = hist != null && TERMINAL.has(hist.status);

  // When the user hits stop we mark this turn canceled immediately and close the
  // stream. We also DON'T stream a settled historical run (the common case).
  const stream = useRunStream(runId, { enabled: !canceled && histChecked && !histTerminal });
  const stopped = canceled || stream.status === "canceled" || hist?.status === "canceled";

  useEffect(() => {
    onActivity?.();
  }, [stream.stageMessage, stream.status, onActivity]);

  useEffect(() => {
    if (stream.done) onRunSettled?.(runId);
  }, [stream.done, runId, onRunSettled]);

  // A resumed run that's already settled never opens a stream, so clear the
  // "active run" lock here too — otherwise the composer is stuck on "Working…
  // press stop" after a reload even though nothing is running.
  useEffect(() => {
    if (historical && histTerminal) onRunSettled?.(runId);
  }, [historical, histTerminal, runId, onRunSettled]);

  // ── Settled historical run — render straight from the one status read ──
  if (historical && histTerminal) {
    if (hist!.status === "completed") {
      return (
        <AssistantRow>
          <div>
            <p className="mb-2.5 font-medium">{summaryLine(tool)}</p>
            <ReportCard runId={runId} tool={tool} preloaded={hist!} />
          </div>
        </AssistantRow>
      );
    }
    return (
      <AssistantRow>
        <p className="text-[var(--ai-text-muted)]">
          {hist!.status === "canceled"
            ? "Interrupted — got something else in mind? Just tell me what to build. 👇"
            : "That report didn't finish. Send your idea again and I'll rebuild it."}
        </p>
      </AssistantRow>
    );
  }

  // Historical run whose status is still loading — a light placeholder, no heavy work.
  if (historical && !histChecked) {
    return (
      <AssistantRow>
        <span className="inline-flex items-center gap-1.5 pt-1" aria-label="Loading">
          <span className="fethron-ai-typing-dot h-2 w-2 rounded-full bg-[var(--ai-primary)]" />
          <span className="fethron-ai-typing-dot h-2 w-2 rounded-full bg-[var(--ai-primary)]" />
          <span className="fethron-ai-typing-dot h-2 w-2 rounded-full bg-[var(--ai-primary)]" />
        </span>
      </AssistantRow>
    );
  }

  // ── Live run (new this session, or a historical run still in flight) ──
  return (
    <AssistantRow>
      {stopped ? (
        <p className="text-[var(--ai-text-muted)]">
          Interrupted — got something else in mind? Just tell me what to build. 👇
        </p>
      ) : stream.status === "failed" ? (
        <p className="text-[var(--ai-text-muted)]">
          {stream.error ?? "Something went wrong with that run. Please try again."}
        </p>
      ) : !stream.done ? (
        <RunProgress stageMessage={stream.stageMessage} events={stream.events} tool={tool} />
      ) : (
        <div>
          <p className="mb-2.5 font-medium">{summaryLine(tool)}</p>
          <ReportCard runId={runId} tool={tool} />
        </div>
      )}
    </AssistantRow>
  );
}

/** User text that collapses when long (e.g. a pasted contract) — a clamped,
 *  bottom-faded preview with a Show more / Show less toggle so a big paste doesn't
 *  flood the chat. Short messages render as-is. */
function UserText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const long = text.length > 600 || text.split("\n").length > 14;
  if (!long) return <span className="whitespace-pre-wrap break-words">{text}</span>;
  // Long pastes (usually a contract) render as a contained code block: monospace,
  // wrapped (no horizontal bleed), clamped with a fade until "Show more".
  return (
    <div className="min-w-0">
      <div
        className={`overflow-hidden rounded-lg bg-black/20 px-3 py-2.5 ${
          expanded ? "" : "max-h-64 [mask-image:linear-gradient(to_bottom,black_72%,transparent)]"
        }`}
      >
        <pre className="whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed">{text}</pre>
      </div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-1.5 text-[12px] font-semibold underline decoration-1 underline-offset-2 opacity-75 transition-opacity hover:opacity-100"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}

export function MessageBubble({
  message,
  onActivity,
  onRunSettled,
}: {
  message: UiMessage;
  onActivity?: () => void;
  onRunSettled?: (runId: string) => void;
}) {
  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full justify-end"
      >
        <div className="max-w-[85%] rounded-[1.4rem] bg-[var(--ai-user-bg)] px-4 py-2.5 text-[15px] leading-relaxed text-[var(--ai-user-text)] shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
          {message.attachments?.length ? (
            <div className="mb-2 flex flex-wrap gap-2">
              {message.attachments.map((a, i) =>
                a.kind === "image" && a.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={a.previewUrl} alt={a.name} className="h-24 w-24 rounded-xl object-cover" />
                ) : (
                  <span key={i} className="inline-flex max-w-[12rem] items-center gap-1.5 rounded-lg bg-black/20 px-2.5 py-1.5 text-[12px] font-medium">
                    <FileText size={14} className="shrink-0" />
                    <span className="truncate">{a.name}</span>
                  </span>
                ),
              )}
            </div>
          ) : null}
          {message.text ? <UserText text={message.text} /> : null}
        </div>
      </motion.div>
    );
  }

  if (message.kind === "run") {
    return (
      <RunBubble
        runId={message.runId}
        tool={message.tool}
        canceled={message.canceled}
        historical={message.historical}
        onActivity={onActivity}
        onRunSettled={onRunSettled}
      />
    );
  }

  if (message.kind === "pending") {
    return (
      <AssistantRow>
        <span className="inline-flex items-center gap-1.5 pt-1" aria-label="Thinking">
          <span className="fethron-ai-typing-dot h-2 w-2 rounded-full bg-[var(--ai-primary)]" />
          <span className="fethron-ai-typing-dot h-2 w-2 rounded-full bg-[var(--ai-primary)]" />
          <span className="fethron-ai-typing-dot h-2 w-2 rounded-full bg-[var(--ai-primary)]" />
        </span>
      </AssistantRow>
    );
  }

  if (message.kind === "error") {
    return (
      <AssistantRow>
        <p className="text-[var(--ai-text-muted)]">{message.text}</p>
      </AssistantRow>
    );
  }

  // text (faq / refuse / clarify)
  return (
    <AssistantRow>
      <p className="whitespace-pre-wrap">
        <TypedReveal text={message.text} animate={message.animate} onTick={onActivity} />
      </p>
    </AssistantRow>
  );
}
