"use client";

import type { ReactNode } from "react";
import { FethronDynamicProvider } from "@/components/fethron-ai/dynamic-provider";
import { AiAuthProvider } from "@/components/fethron-ai/ai-auth-context";
import { AiSidebarProvider } from "@/components/fethron-ai/ai-sidebar-context";
import { AiThemeProvider } from "@/components/fethron-ai/ai-theme-context";
import { SessionBootstrap } from "@/components/fethron-ai/session-bootstrap";
import type { AiTheme } from "@/config/ai-theme-config";

type FethronAiShellProps = {
  children: ReactNode;
  initialTheme?: AiTheme;
};

export function FethronAiShell({ children, initialTheme }: FethronAiShellProps) {
  return (
    <FethronDynamicProvider initialTheme={initialTheme}>
      <AiAuthProvider>
        <SessionBootstrap />
        <AiThemeProvider initialTheme={initialTheme}>
          <AiSidebarProvider>
            {children}
          </AiSidebarProvider>
        </AiThemeProvider>
      </AiAuthProvider>
    </FethronDynamicProvider>
  );
}
