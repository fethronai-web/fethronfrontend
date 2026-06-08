"use client";

import type { ReactNode } from "react";
import { AiAuthProvider } from "@/components/fethron-ai/ai-auth-context";
import { AiLoginModal } from "@/components/fethron-ai/ai-login-modal";
import { AiSidebarProvider } from "@/components/fethron-ai/ai-sidebar-context";
import { AiThemeProvider } from "@/components/fethron-ai/ai-theme-context";
import type { AiTheme } from "@/config/ai-theme-config";

type FethronAiShellProps = {
  children: ReactNode;
  initialTheme?: AiTheme;
};

export function FethronAiShell({ children, initialTheme }: FethronAiShellProps) {
  return (
    <AiAuthProvider>
      <AiThemeProvider initialTheme={initialTheme}>
        <AiSidebarProvider>
          {children}
          <AiLoginModal />
        </AiSidebarProvider>
      </AiThemeProvider>
    </AiAuthProvider>
  );
}
