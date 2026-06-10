"use client";

import { useEffect, useRef, useState } from "react";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { BACKEND_URL } from "@/lib/trpc/client";

export interface RunEvent {
  seq: number;
  kind: string;
  stage: string | null;
  label: string | null;
  message: string;
}

export type RunStreamStatus = "connecting" | "running" | "completed" | "failed" | "canceled";

export interface RunStream {
  events: RunEvent[];
  status: RunStreamStatus;
  error: string | null;
  /** The latest human-readable stage line (for the loader). */
  stageMessage: string;
  done: boolean;
}

/**
 * Subscribes to a run's live progress over SSE. EventSource can't send headers, so
 * the Dynamic JWT (when signed in) goes in `?token=`; anon runs send none and the
 * backend authorises by IP. Events are deduped by `seq` (the stream replays
 * history first, then live updates). Closes on completion/failure.
 */
export function useRunStream(runId: string | null, opts?: { enabled?: boolean }): RunStream {
  const enabled = opts?.enabled ?? true;
  const [events, setEvents] = useState<RunEvent[]>([]);
  const [status, setStatus] = useState<RunStreamStatus>("connecting");
  const [error, setError] = useState<string | null>(null);
  const seen = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!runId || !enabled) return; // closed/paused → no stream
    seen.current = new Set();
    setEvents([]);
    setStatus("connecting");
    setError(null);

    const token = getAuthToken();
    const url = `${BACKEND_URL}/runs/${runId}/events/stream${
      token ? `?token=${encodeURIComponent(token)}` : ""
    }`;
    const es = new EventSource(url);

    es.onmessage = (e) => {
      let data: RunEvent;
      try {
        data = JSON.parse(e.data) as RunEvent;
      } catch {
        return;
      }
      if (typeof data.seq === "number") {
        if (seen.current.has(data.seq)) return;
        seen.current.add(data.seq);
      }
      setEvents((prev) => [...prev, data]);

      if (data.stage === "canceled") {
        setStatus("canceled");
        es.close();
        return;
      }
      if (data.kind === "error" || data.stage === "failed") {
        setError(data.message || "The run failed. Please try again.");
        setStatus("failed");
        es.close();
        return;
      }
      if (data.stage === "completed") {
        setStatus("completed");
        es.close();
        return;
      }
      setStatus("running");
    };

    // EventSource auto-reconnects on transient drops; we only hard-fail on an
    // explicit error/failed event above, so a blip doesn't abort a long run.
    es.onerror = () => {};

    return () => es.close();
  }, [runId]);

  const latest = events.length > 0 ? events[events.length - 1] : null;
  return {
    events,
    status,
    error,
    stageMessage: latest?.message ?? "",
    done: status === "completed" || status === "failed" || status === "canceled",
  };
}
