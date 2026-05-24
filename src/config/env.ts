import { logger } from "@/lib/logger";

interface EnvConfig {
  nodeEnv: "development" | "production" | "test";
  isDev: boolean;
  isProd: boolean;
}

function parseNodeEnv(): EnvConfig["nodeEnv"] {
  const raw = process.env.NODE_ENV;

  if (raw === "development" || raw === "production" || raw === "test") {
    return raw;
  }

  logger.warn("Invalid NODE_ENV value, falling back to development", {
    received: raw ?? "undefined",
  });

  return "development";
}

export const env: EnvConfig = (() => {
  const nodeEnv = parseNodeEnv();

  return {
    nodeEnv,
    isDev: nodeEnv === "development",
    isProd: nodeEnv === "production",
  };
})();
