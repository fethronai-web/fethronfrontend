import type { LogEntry, LogLevel } from "@/types";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function getMinLevel(): LogLevel {
  if (process.env.NODE_ENV === "production") return "warn";
  return "debug";
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[getMinLevel()];
}

function serializeError(error: unknown): LogEntry["error"] | undefined {
  if (!(error instanceof Error)) {
    if (error !== undefined && error !== null) {
      return { name: "UnknownError", message: String(error) };
    }
    return undefined;
  }

  return {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  };
}

function write(entry: LogEntry): void {
  const payload = JSON.stringify(entry);

  switch (entry.level) {
    case "error":
      console.error(payload);
      break;
    case "warn":
      console.warn(payload);
      break;
    case "info":
      console.info(payload);
      break;
    default:
      console.debug(payload);
  }
}

function log(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: unknown,
): void {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context && Object.keys(context).length > 0 ? { context } : {}),
    ...(error !== undefined ? { error: serializeError(error) } : {}),
  };

  write(entry);
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) =>
    log("debug", message, context),
  info: (message: string, context?: Record<string, unknown>) =>
    log("info", message, context),
  warn: (
    message: string,
    context?: Record<string, unknown>,
    error?: unknown,
  ) => log("warn", message, context, error),
  error: (
    message: string,
    context?: Record<string, unknown>,
    error?: unknown,
  ) => log("error", message, context, error),
};
