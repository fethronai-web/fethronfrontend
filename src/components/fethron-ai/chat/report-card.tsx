"use client";

import { useEffect, useState } from "react";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { FileText, Download, ExternalLink, ShieldCheck } from "lucide-react";
import { BACKEND_URL, trpc } from "@/lib/trpc/client";
import type { BackendToolKind } from "@/config/ai-tools";
import type { RunResultDto } from "@/lib/trpc/types";

/**
 * The deliverable, inline in the assistant turn. Clicking "Open" launches the
 * self-contained HTML report in a new tab; "Download" saves it. Both hit
 * `GET /runs/:id/report.html` with the Dynamic JWT in the query (anon omits it and
 * is authorised by IP). Title + viability come from the plain `chat.runResult`
 * query so no Drizzle row crosses to the web app.
 */
export function ReportCard({
  runId,
  tool,
  preloaded,
}: {
  runId: string;
  tool: BackendToolKind;
  /** When the caller already fetched the run summary (e.g. a resumed chat), seed
   *  from it and skip the extra round-trip. */
  preloaded?: RunResultDto;
}) {
  const [info, setInfo] = useState<RunResultDto | null>(preloaded ?? null);

  useEffect(() => {
    if (preloaded) return; // already have it — no fetch
    let alive = true;
    trpc.chat.runResult
      .query({ runId })
      .then((r) => {
        if (alive) setInfo(r);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [runId, preloaded]);

  const token = getAuthToken();
  const q = token ? `?token=${encodeURIComponent(token)}` : "";
  const openUrl = `${BACKEND_URL}/runs/${runId}/report.html${q}`;
  const downloadUrl = `${BACKEND_URL}/runs/${runId}/report.html${q ? `${q}&download=1` : "?download=1"}`;

  const isAudit = tool === "smart-contract-audit";
  const title = info?.title ?? (isAudit ? "Smart Contract Audit" : "Project Blueprint");
  const kicker = isAudit ? "Security report" : "Vision to Launch · HTML report";

  return (
    <div className="mt-1 overflow-hidden rounded-2xl border border-[var(--ai-border)] bg-[var(--ai-glass)] backdrop-blur-sm">
      <a
        href={openUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-[color-mix(in_srgb,var(--ai-primary)_10%,transparent)]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--ai-primary)] text-white">
          {isAudit ? <ShieldCheck size={20} strokeWidth={2} /> : <FileText size={20} strokeWidth={2} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14.5px] font-semibold text-[var(--ai-text)]">
            {title}
          </span>
          <span className="mt-0.5 block text-[11.5px] font-medium uppercase tracking-[0.14em] text-[var(--ai-text-muted)]">
            {kicker}
          </span>
        </span>
        {info?.viability != null && (
          <span className="hidden shrink-0 flex-col items-center rounded-xl border border-[var(--ai-border)] px-3 py-1.5 sm:flex">
            <span className="text-[16px] font-bold leading-none text-[var(--ai-primary)]">
              {info.viability}
            </span>
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--ai-text-muted)]">
              Viability
            </span>
          </span>
        )}
        <ExternalLink
          size={16}
          className="shrink-0 text-[var(--ai-text-muted)] transition-transform group-hover:translate-x-0.5"
        />
      </a>
      <div className="flex items-center gap-2 border-t border-[var(--ai-border)] px-3 py-2">
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold text-[var(--ai-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--ai-primary)_12%,transparent)]"
        >
          <ExternalLink size={14} /> Open
        </a>
        <a
          href={downloadUrl}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold text-[var(--ai-text)] transition-colors hover:bg-[color-mix(in_srgb,var(--ai-text)_8%,transparent)]"
        >
          <Download size={14} /> Download
        </a>
      </div>
    </div>
  );
}
