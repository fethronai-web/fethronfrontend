"use client";

import { useCallback, useId, useState } from "react";
import type { ContactFormData, ContactFormErrors } from "@/types";
import { SITE } from "@/config/site";
import { submitContactForm, validateContactForm } from "@/lib/contact-form";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  company: "",
  message: "",
};

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FieldProps {
  id: string;
  label: string;
  name: keyof ContactFormData;
  type?: "text" | "email" | "textarea";
  value: string;
  error?: string;
  required?: boolean;
  onChange: (name: keyof ContactFormData, value: string) => void;
}

function FormField({
  id,
  label,
  name,
  type = "text",
  value,
  error,
  required,
  onChange,
}: FieldProps) {
  const describedBy = error ? `${id}-error` : undefined;
  const inputClassName = cn(
    "mt-2 w-full rounded-xl border bg-background/80 px-4 py-3.5 text-sm text-foreground backdrop-blur-sm transition-colors",
    "placeholder:text-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
    error ? "border-accent/60" : "border-border hover:border-border-strong",
  );

  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(inputClassName, "min-h-[130px] resize-y")}
          onChange={(e) => onChange(name, e.target.value)}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={inputClassName}
          onChange={(e) => onChange(name, e.target.value)}
        />
      )}
      {error ? (
        <p id={describedBy} role="alert" className="mt-1.5 text-xs text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactSection() {
  const formId = useId();
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleChange = useCallback(
    (name: keyof ContactFormData, value: string) => {
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => {
        if (!prev[name]) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      });
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validationErrors = validateContactForm(form);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setStatus("idle");
        setStatusMessage(null);
        return;
      }

      setStatus("submitting");
      setStatusMessage(null);
      setErrors({});

      const result = await submitContactForm(form);

      if (result.ok) {
        setStatus("success");
        setStatusMessage(result.message ?? "Message sent.");
        setForm(INITIAL_FORM);
        logger.info("Contact form UI reset after success");
        return;
      }

      setStatus("error");
      setStatusMessage(result.message ?? "Submission failed.");
      if (result.errors) setErrors(result.errors);
    },
    [form],
  );

  return (
    <section id="contact" className="border-t border-border bg-black py-20 sm:py-28 lg:py-32">
      <Container>
        <div className="overflow-hidden rounded-3xl border border-border-strong">
          <div className="grid lg:grid-cols-2">
            <Reveal className="relative bg-accent p-8 text-black sm:p-12 lg:border-r lg:border-black/15">
              <div className="relative">
                <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-black/55">
                  Contact
                </p>
                <h2 className="font-display mt-4 text-[clamp(2rem,4vw,2.75rem)] font-normal leading-[1.1] tracking-[-0.02em]">
                  Let&apos;s create something remarkable
                </h2>
                <p className="mt-5 max-w-md text-base leading-[1.75] text-black/70">
                  Tell us about your vision. We typically respond within one
                  business day with thoughtful next steps — not a generic pitch deck.
                </p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-8 inline-block font-display text-xl transition-opacity hover:opacity-70 sm:text-2xl"
                >
                  {SITE.email}
                </a>
              </div>
            </Reveal>

            <Reveal delay={1} className="bg-black p-8 sm:p-12">
              <form id={formId} onSubmit={handleSubmit} noValidate>
                <div className="grid gap-5 sm:gap-6">
                  <FormField
                    id={`${formId}-name`}
                    label="Name"
                    name="name"
                    value={form.name}
                    error={errors.name}
                    required
                    onChange={handleChange}
                  />
                  <FormField
                    id={`${formId}-email`}
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    error={errors.email}
                    required
                    onChange={handleChange}
                  />
                  <FormField
                    id={`${formId}-company`}
                    label="Company"
                    name="company"
                    value={form.company}
                    error={errors.company}
                    onChange={handleChange}
                  />
                  <FormField
                    id={`${formId}-message`}
                    label="Project details"
                    name="message"
                    type="textarea"
                    value={form.message}
                    error={errors.message}
                    required
                    onChange={handleChange}
                  />
                </div>

                {statusMessage ? (
                  <p
                    role="status"
                    className={cn(
                      "mt-5 rounded-xl px-4 py-3 text-sm",
                      status === "success"
                        ? "bg-swirl/10 text-swirl"
                        : "bg-accent/10 text-accent",
                    )}
                  >
                    {statusMessage}
                  </p>
                ) : null}

                <div className="mt-6">
                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? "Sending…" : "Send inquiry"}
                  </Button>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
