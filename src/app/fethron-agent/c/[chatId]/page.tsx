"use client";

import { use, useEffect, useState } from "react";
import { AiToolsHub } from "@/components/fethron-ai/ai-tools-hub";
import { useAiAuth } from "@/components/fethron-ai/ai-auth-context";
import { messagesFromDto, type UiMessage } from "@/components/fethron-ai/chat/types";
import { trpc } from "@/lib/trpc/client";

/**
 * Resume a saved chat. Messages are fetched on the CLIENT (the `chat.messages`
 * query is tenant-gated and the Dynamic JWT lives client-side). We mount the chat
 * surface only once the transcript is loaded so it seeds correctly. Anon users (or
 * a foreign chat) get an empty load → the surface falls back to the landing hub.
 */
export default function FethronChatResumePage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = use(params);
  const { isReady, isAuthenticated } = useAiAuth();
  const [messages, setMessages] = useState<UiMessage[] | null>(null);

  useEffect(() => {
    // Wait for the Dynamic SDK to hydrate before firing the tenant-gated query —
    // otherwise the token is null on reload and the fetch 401s into an empty hub.
    if (!isReady) return;
    if (!isAuthenticated) {
      setMessages([]);
      return;
    }
    let alive = true;
    setMessages(null);
    trpc.chat.messages
      .query({ chatId })
      .then((rows) => {
        if (alive) setMessages(messagesFromDto(rows));
      })
      .catch(() => {
        if (alive) setMessages([]);
      });
    return () => {
      alive = false;
    };
  }, [chatId, isReady, isAuthenticated]);

  if (messages === null) {
    return (
      <div className="fethron-ai flex min-h-dvh items-center justify-center bg-[var(--ai-bg)]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--ai-border)] border-t-[var(--ai-primary)]" />
      </div>
    );
  }

  return <AiToolsHub key={chatId} initialChatId={chatId} initialMessages={messages} />;
}
