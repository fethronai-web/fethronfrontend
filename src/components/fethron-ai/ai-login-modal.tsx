"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAiAuth } from "@/components/fethron-ai/ai-auth-context";
import { LogInIcon } from "@/components/fethron-ai/ai-icons";

export function AiLoginModal() {
  const { loginOpen, closeLogin, login } = useAiAuth();
  const [email, setEmail] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loginOpen) return;
    setEmail("");
    const t = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(t);
  }, [loginOpen]);

  useEffect(() => {
    if (!loginOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLogin();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [loginOpen, closeLogin]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) return;
    login(trimmed);
  };

  return (
    <AnimatePresence>
      {loginOpen && (
        <motion.div
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fethron-ai fixed inset-0 z-[100] flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeLogin();
          }}
        >
          <div className="fethron-ai-login-backdrop absolute inset-0" aria-hidden />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-login-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fethron-ai-login-modal relative z-10 w-full max-w-[22rem] rounded-2xl p-6 sm:max-w-sm sm:p-7"
          >
            <button
              type="button"
              onClick={closeLogin}
              aria-label="Close"
              className="fethron-ai-login-close absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-lg text-xl leading-none"
            >
              ×
            </button>

            <div className="fethron-ai-login-icon mb-4 flex h-10 w-10 items-center justify-center rounded-xl">
              <LogInIcon size={20} aria-hidden />
            </div>

            <h2 id="ai-login-title" className="fethron-ai-login-title font-display text-[1.35rem] font-semibold leading-tight tracking-tight">
              Sign in
            </h2>
            <p className="fethron-ai-login-subtitle mt-1.5 text-[13px] leading-relaxed">
              Use your email to continue on Fethron AI.
            </p>

            <form onSubmit={submit} className="mt-5 space-y-3.5">
              <label className="block">
                <span className="fethron-ai-login-label mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em]">
                  Email
                </span>
                <input
                  ref={inputRef}
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="fethron-ai-login-input w-full rounded-xl px-3.5 py-2.5 text-[14px] outline-none"
                />
              </label>

              <button type="submit" className="fethron-ai-login-submit w-full rounded-xl px-4 py-2.5 text-[13px] font-semibold">
                Continue
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
