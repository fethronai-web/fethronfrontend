export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: "strategy" | "design" | "development" | "growth";
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  url?: string;
  tagline: string;
  industry: string;
  services: string;
  duration: string;
  role: string;
  quote: string;
  year: string;
}

