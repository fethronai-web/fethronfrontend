"use client";

import { useCallback, useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import type { UiMessage } from "./types";

/**
 * The scrollable transcript. Auto-scrolls to the newest turn on change and while a
 * bubble is actively streaming (via `onActivity`).
 */
export function MessageList({
  messages,
  onRunSettled,
}: {
  messages: UiMessage[];
  onRunSettled?: (runId: string) => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  return (
    <div className="fethron-ai-transcript mx-auto flex w-full max-w-3xl flex-col gap-6 px-1 pb-6 pt-2">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} onActivity={scrollToEnd} onRunSettled={onRunSettled} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
