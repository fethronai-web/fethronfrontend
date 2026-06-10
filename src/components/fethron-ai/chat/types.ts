import type { BackendToolKind } from "@/config/ai-tools";
import type { ChatMessageDto } from "@/lib/trpc/types";

/** A file/image the user attached to their message (for display in the bubble). */
export interface UiAttachment {
  name: string;
  kind: "image" | "file";
  previewUrl?: string; // data-URL for image thumbnails
}

/** One rendered turn in the chat surface. */
export type UiMessage =
  | { id: string; role: "user"; text: string; attachments?: UiAttachment[] }
  | {
      id: string;
      role: "assistant";
      kind: "text";
      intent: "faq" | "refuse" | "clarify";
      text: string;
      /** type-reveal on first render (live replies), off when loaded from history */
      animate: boolean;
    }
  | {
      id: string;
      role: "assistant";
      kind: "run";
      runId: string;
      tool: BackendToolKind;
      canceled?: boolean;
      /** Loaded from history (resume) — almost always already settled, so the bubble
       *  checks status once instead of opening a live SSE stream. */
      historical?: boolean;
    }
  | { id: string; role: "assistant"; kind: "pending" }
  | { id: string; role: "assistant"; kind: "error"; text: string };

let counter = 0;
/** Stable-enough id for a UI message (no Math.random → no hydration surprises). */
export function uiId(): string {
  counter += 1;
  return `m${counter}_${Date.now().toString(36)}`;
}

/** Map persisted chat rows (from `chat.messages`) into rendered turns for resume.
 *  A run row carries its runId+tool so the report card re-renders. */
export function messagesFromDto(rows: ChatMessageDto[]): UiMessage[] {
  const out: UiMessage[] = [];
  for (const r of rows) {
    if (r.role === "user") {
      out.push({
        id: uiId(),
        role: "user",
        text: r.content,
        ...(r.attachments?.length ? { attachments: r.attachments } : {}),
      });
    } else if (r.role === "assistant") {
      if (r.runId) {
        const tool: BackendToolKind =
          r.tool === "smart-contract-audit" ? "smart-contract-audit" : "know-your-vision";
        out.push({ id: uiId(), role: "assistant", kind: "run", runId: r.runId, tool, historical: true });
      } else {
        out.push({ id: uiId(), role: "assistant", kind: "text", intent: "faq", text: r.content, animate: false });
      }
    }
  }
  return out;
}
