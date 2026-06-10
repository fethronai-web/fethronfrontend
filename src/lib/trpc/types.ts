import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/types/backend/app-router";

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

/** Plain DTOs the chat UI renders (all serialisable — no Drizzle rows). */
export type ChatSendResult = RouterOutputs["chat"]["send"];
export type ChatSummary = RouterOutputs["chat"]["list"][number];
export type ChatMessageDto = RouterOutputs["chat"]["messages"][number];
export type RunResultDto = RouterOutputs["chat"]["runResult"];

/** Backend tool kinds (the router's authoritative tool ids). */
export type BackendToolKind = "smart-contract-audit" | "know-your-vision";
