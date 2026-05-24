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
  metrics: string;
  gradient: string;
  layout: "hero" | "wide" | "default";
  year: string;
}

export interface ProcessStep {
  id: string;
  step: string;
  title: string;
  description: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export type ContactFormField = keyof ContactFormData;

export interface ContactFormErrors {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
}

export interface ContactSubmitResult {
  ok: boolean;
  errors?: ContactFormErrors;
  message?: string;
}
