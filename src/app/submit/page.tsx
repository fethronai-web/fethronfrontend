import type { Metadata } from "next";
import { Suspense } from "react";
import { SubmitLetter } from "@/components/sections/submit-letter";

export const metadata: Metadata = {
  title: "Write to Us",
  description:
    "Tell us about your project. A letter to Fethron — strategy, design, and engineering, built to endure.",
};

export default function SubmitPage() {
  return (
    <main id="main-content" className="flex-1">
      <Suspense fallback={null}>
        <SubmitLetter />
      </Suspense>
    </main>
  );
}
