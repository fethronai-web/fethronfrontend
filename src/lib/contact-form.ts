import type {
  ContactFormData,
  ContactFormErrors,
  ContactSubmitResult,
} from "@/types";
import { logger } from "@/lib/logger";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(
  field: keyof ContactFormData,
  value: string,
): string | undefined {
  const trimmed = value.trim();

  switch (field) {
    case "name":
      if (!trimmed) return "Name is required.";
      if (trimmed.length < 2) return "Name must be at least 2 characters.";
      return undefined;
    case "email":
      if (!trimmed) return "Email is required.";
      if (!EMAIL_PATTERN.test(trimmed)) return "Enter a valid email address.";
      return undefined;
    case "company":
      return undefined;
    case "message":
      if (!trimmed) return "Message is required.";
      if (trimmed.length < 10)
        return "Message must be at least 10 characters.";
      return undefined;
    default:
      logger.warn("Unknown contact form field during validation", { field });
      return "Invalid field.";
  }
}

export function validateContactForm(
  data: ContactFormData,
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  (Object.keys(data) as (keyof ContactFormData)[]).forEach((field) => {
    const error = validateField(field, data[field]);
    if (error) errors[field] = error;
  });

  if (Object.keys(errors).length > 0) {
    logger.warn("Contact form validation failed", {
      fields: Object.keys(errors),
    });
  }

  return errors;
}

export async function submitContactForm(
  data: ContactFormData,
): Promise<ContactSubmitResult> {
  const errors = validateContactForm(data);

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  logger.info("Contact form submission started", {
    emailDomain: data.email.split("@")[1] ?? "unknown",
    hasCompany: Boolean(data.company.trim()),
  });

  try {
    // Simulated API call — replace with real endpoint when backend is ready
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.email.toLowerCase().includes("fail")) {
          reject(new Error("Simulated server rejection"));
          return;
        }
        resolve(undefined);
      }, 800);
    });

    logger.info("Contact form submission succeeded", {
      nameLength: data.name.trim().length,
    });

    return {
      ok: true,
      message: "Thanks — we'll be in touch within 24 hours.",
    };
  } catch (error) {
    logger.error("Contact form submission failed", { email: data.email }, error);

    return {
      ok: false,
      message:
        "Something went wrong on our end. Please try again or email us directly.",
    };
  }
}
