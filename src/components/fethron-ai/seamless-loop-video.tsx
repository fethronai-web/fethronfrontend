"use client";

import { useEffect, useRef, useState } from "react";

const CROSSFADE_SEC = 0.8;

type Layer = 0 | 1;

export function SeamlessLoopVideo({ src }: { src: string }) {
  const refs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const [active, setActive] = useState<Layer>(0);
  const activeRef = useRef<Layer>(0);
  const busy = useRef(false);
  const durationRef = useRef(0);

  useEffect(() => {
    const v0 = refs[0].current;
    const v1 = refs[1].current;
    if (!v0 || !v1) return;

    for (const video of [v0, v1]) {
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.src = src;
    }

    activeRef.current = 0;
    busy.current = false;

    const onMeta = () => {
      durationRef.current = v0.duration;
    };
    v0.addEventListener("loadedmetadata", onMeta);

    const timers = new Set<number>();
    let removePending: (() => void) | null = null;

    const switchLayer = (from: Layer) => {
      if (busy.current) return;

      const current = refs[from].current!;
      const next = refs[(1 - from) as Layer].current!;
      const duration = durationRef.current || current.duration;
      if (!duration) return;

      busy.current = true;
      next.currentTime = 0;

      const onPlaying = () => {
        next.removeEventListener("playing", onPlaying);
        removePending = null;
        const to: Layer = (1 - from) as Layer;
        activeRef.current = to;
        setActive(to);

        const t = window.setTimeout(() => {
          timers.delete(t);
          current.pause();
          current.currentTime = 0;
          busy.current = false;
        }, CROSSFADE_SEC * 1000 + 100);
        timers.add(t);
      };

      next.addEventListener("playing", onPlaying);
      removePending = () => next.removeEventListener("playing", onPlaying);
      void next.play().catch(() => {
        busy.current = false;
      });
    };

    const onTimeUpdate = (layer: Layer) => {
      if (activeRef.current !== layer || busy.current) return;

      const video = refs[layer].current!;
      const duration = durationRef.current || video.duration;
      if (!duration) return;

      if (video.currentTime >= duration - CROSSFADE_SEC) {
        switchLayer(layer);
      }
    };

    const h0 = () => onTimeUpdate(0);
    const h1 = () => onTimeUpdate(1);

    v0.addEventListener("timeupdate", h0);
    v1.addEventListener("timeupdate", h1);

    void v0.play().catch(() => {});

    return () => {
      v0.removeEventListener("loadedmetadata", onMeta);
      v0.removeEventListener("timeupdate", h0);
      v1.removeEventListener("timeupdate", h1);
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
      removePending?.();
      // Release the decoded media buffers so they don't linger in memory.
      for (const video of [v0, v1]) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [src]);

  return (
    <div className="absolute inset-0">
      {([0, 1] as const).map((i) => (
        <video
          key={i}
          ref={refs[i]}
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover [backface-visibility:hidden] [transform:translateZ(0)]"
          style={{
            opacity: active === i ? 1 : 0,
            transition: `opacity ${CROSSFADE_SEC}s ease-in-out`,
            willChange: "opacity",
          }}
        />
      ))}
    </div>
  );
}
