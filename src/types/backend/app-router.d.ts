import * as drizzle_orm_pg_core from 'drizzle-orm/pg-core';
import * as _trpc_server from '@trpc/server';
import pino from 'pino';

/**
 * The three Fethron Agent tools. Shared by chats and runs so a conversation and
 * its agent executions always agree on which tool they belong to.
 */
declare const toolKindEnum: drizzle_orm_pg_core.PgEnum<["smart-contract-audit", "know-your-vision", "launch-brief"]>;
type ToolKind = (typeof toolKindEnum.enumValues)[number];

/**
 * One row per authenticated user — the isolation boundary. Every chat, message,
 * run and tool-result row carries a `tenant_id`, and every query is scoped by it,
 * so no two users' data can ever mix. Keyed by the Dynamic JWT `sub` (stable per
 * user regardless of email / social / wallet login method).
 */
declare const tenants: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "tenants";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "tenants";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        dynamicUserId: drizzle_orm_pg_core.PgColumn<{
            name: "dynamic_user_id";
            tableName: "tenants";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        email: drizzle_orm_pg_core.PgColumn<{
            name: "email";
            tableName: "tenants";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        walletAddress: drizzle_orm_pg_core.PgColumn<{
            name: "wallet_address";
            tableName: "tenants";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        displayName: drizzle_orm_pg_core.PgColumn<{
            name: "display_name";
            tableName: "tenants";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        isAdmin: drizzle_orm_pg_core.PgColumn<{
            name: "is_admin";
            tableName: "tenants";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "tenants";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        lastSeenAt: drizzle_orm_pg_core.PgColumn<{
            name: "last_seen_at";
            tableName: "tenants";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
type Tenant = typeof tenants.$inferSelect;

/**
 * Structured logger. Pretty in dev, JSON in prod. traceId is threaded through
 * child loggers (per request / per audit) so a UI action, its audit run, and
 * each LLM call can be reconciled in logs.
 *
 * Never log full untrusted payloads (docs, contract source) at info level, and
 * never log secrets — see docs/SECURITY.md.
 */
declare const logger: pino.Logger<never, boolean>;
type Logger = typeof logger;

/**
 * Per-request context. A `Bearer <dynamic-jwt>` header is verified and resolved
 * to a tenant; without one (or with an invalid token) the request is anonymous —
 * public procedures still work, `protectedProcedure` will 401. Every request
 * carries a trace-scoped child logger.
 */
interface Context {
    traceId: string;
    tenant: Tenant | null;
    /** Client IP (from Fastify `req.ip` with trustProxy) — anon rate-limit key. */
    ip: string;
    log: Logger;
}

/** Discriminated result the frontend renders: either a typed text reply, or a
 *  started run (mount the SSE stream + report card on completion). */
type ChatSendResult = {
    kind: "text";
    intent: "faq" | "refuse" | "clarify";
    text: string;
    chatId: string | null;
} | {
    kind: "run";
    tool: "smart-contract-audit" | "know-your-vision";
    runId: string;
    chatId: string | null;
};

/** A chat row in the sidebar (plain DTO — no Drizzle types cross to the web app). */
interface ChatSummary {
    id: string;
    tool: ToolKind;
    title: string | null;
    updatedAt: string;
}
/** One rendered turn. A run turn carries the runId+tool so resume re-renders the
 *  report card; a text turn is just `content`. */
interface ChatMessageDto {
    seq: number;
    role: "system" | "user" | "assistant" | "tool";
    content: string;
    runId: string | null;
    tool: ToolKind | null;
    attachments: Array<{
        name: string;
        kind: "image" | "file";
    }> | null;
}
/** What the report card needs — a plain DTO (no Drizzle row crosses to the web
 *  app). Ownership-checked via the runs service. */
interface RunResultDto {
    runId: string;
    status: "queued" | "running" | "completed" | "failed" | "canceled";
    tool: ToolKind;
    title: string | null;
    viability: number | null;
    error: string | null;
    errorCode: string | null;
}

/**
 * Branded application errors. A single code string joins logs, tRPC error data,
 * and (later) Sentry traces. Surfaced to the client via the tRPC errorFormatter
 * as `error.data.appCode` — messages are safe, never leaking secrets/internals.
 *
 * Code prefixes (generic, tool-agnostic):
 *   AUTH_*  authentication / authorization
 *   VALID_* input validation
 *   CHAT_*  chat / message lifecycle
 *   LLM_*   model providers
 *   SYS_*   infrastructure / unexpected
 * Per-tool prefixes live with their tool module:
 *   SCA_*   smart-contract-audit   (was AUDIT_/SRC_)
 *   KYV_*   know-your-vision
 *   LB_*    launch-brief
 */
type AppCode = "AUTH_001" | "AUTH_002" | "RATE_001" | "QUOTA_001" | "BUDGET_001" | "UPLOAD_001" | "INPUT_001" | "VALID_001" | "CHAT_001" | "CHAT_002" | "RUN_001" | "RUN_002" | "LLM_001" | "LLM_002" | "SEARCH_001" | "SYS_001" | "AUDIT_001" | "AUDIT_002" | "AUDIT_003" | "SRC_001" | "SRC_002";

declare const appRouter: _trpc_server.TRPCBuiltRouter<{
    ctx: Context;
    meta: object;
    errorShape: {
        message: string;
        data: {
            appCode: AppCode | null;
            code: _trpc_server.TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
            stack?: string;
        };
        code: _trpc_server.TRPC_ERROR_CODE_NUMBER;
    };
    transformer: true;
}, _trpc_server.TRPCDecorateCreateRouterOptions<{
    health: _trpc_server.TRPCQueryProcedure<{
        input: void;
        output: {
            ok: boolean;
            ts: number;
        };
        meta: object;
    }>;
    session: _trpc_server.TRPCBuiltRouter<{
        ctx: Context;
        meta: object;
        errorShape: {
            message: string;
            data: {
                appCode: AppCode | null;
                code: _trpc_server.TRPC_ERROR_CODE_KEY;
                httpStatus: number;
                path?: string;
                stack?: string;
            };
            code: _trpc_server.TRPC_ERROR_CODE_NUMBER;
        };
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        me: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: {
                tenantId: string;
                email: string | null;
                walletAddress: string | null;
                displayName: string | null;
                createdAt: Date;
            };
            meta: object;
        }>;
    }>>;
    chat: _trpc_server.TRPCBuiltRouter<{
        ctx: Context;
        meta: object;
        errorShape: {
            message: string;
            data: {
                appCode: AppCode | null;
                code: _trpc_server.TRPC_ERROR_CODE_KEY;
                httpStatus: number;
                path?: string;
                stack?: string;
            };
            code: _trpc_server.TRPC_ERROR_CODE_NUMBER;
        };
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        send: _trpc_server.TRPCMutationProcedure<{
            input: {
                message: string;
                mode?: "auto" | "smart-contract-audit" | "know-your-vision" | undefined;
                chatId?: string | undefined;
                files?: {
                    name: string;
                    content: string;
                    mediaType?: string | undefined;
                }[] | undefined;
            };
            output: ChatSendResult;
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: ChatSummary[];
            meta: object;
        }>;
        messages: _trpc_server.TRPCQueryProcedure<{
            input: {
                chatId: string;
            };
            output: ChatMessageDto[];
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: {
                chatId: string;
            };
            output: {
                ok: true;
            };
            meta: object;
        }>;
        runResult: _trpc_server.TRPCQueryProcedure<{
            input: {
                runId: string;
            };
            output: RunResultDto;
            meta: object;
        }>;
        cancel: _trpc_server.TRPCMutationProcedure<{
            input: {
                runId: string;
            };
            output: {
                ok: true;
            };
            meta: object;
        }>;
    }>>;
    runs: _trpc_server.TRPCBuiltRouter<{
        ctx: Context;
        meta: object;
        errorShape: {
            message: string;
            data: {
                appCode: AppCode | null;
                code: _trpc_server.TRPC_ERROR_CODE_KEY;
                httpStatus: number;
                path?: string;
                stack?: string;
            };
            code: _trpc_server.TRPC_ERROR_CODE_NUMBER;
        };
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        create: _trpc_server.TRPCMutationProcedure<{
            input: {
                tool: "smart-contract-audit" | "know-your-vision" | "launch-brief";
                chatId?: string | undefined;
                files?: {
                    name: string;
                    content: string;
                    mediaType?: string | undefined;
                }[] | undefined;
                prompt?: string | undefined;
            };
            output: {
                runId: string;
            };
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: {
                runId: string;
            };
            output: {
                error: string | null;
                id: string;
                createdAt: Date;
                status: "queued" | "running" | "completed" | "failed" | "canceled";
                input: Record<string, unknown> | null;
                tenantId: string | null;
                chatId: string | null;
                tool: "smart-contract-audit" | "know-your-vision" | "launch-brief";
                ownerKey: string;
                progress: number;
                result: Record<string, unknown> | null;
                errorCode: string | null;
                tokensIn: number | null;
                tokensOut: number | null;
                costUsd: string | null;
                durationMs: number | null;
                startedAt: Date | null;
                finishedAt: Date | null;
            };
            meta: object;
        }>;
        events: _trpc_server.TRPCQueryProcedure<{
            input: {
                runId: string;
                afterSeq?: number | undefined;
            };
            output: {
                seq: number;
                runId: string;
                tenantId: string | null;
                kind: "error" | "warn" | "info" | "tool" | "reasoning" | "stage";
                stage: string | null;
                label: string | null;
                message: string;
                meta: Record<string, unknown> | null;
                createdAt: Date;
            }[];
            meta: object;
        }>;
    }>>;
}>>;
/** Exported as a TYPE for the frontend (via `npm run export:types`). No runtime
 *  backend code crosses into the web app. */
type AppRouter = typeof appRouter;

export { type AppRouter, appRouter };
