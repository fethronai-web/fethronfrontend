"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface ReadyState {
  /** True once the preloader has finished and the hero may animate in. */
  ready: boolean;
  /** Called by the preloader when it begins revealing the hero. */
  reveal: () => void;
}

const ReadyContext = createContext<ReadyState>({
  ready: true,
  reveal: () => {},
});

export function ReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  // Safety net: never leave the hero hidden if the preloader fails to signal.
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 9000);
    return () => clearTimeout(t);
  }, []);

  return (
    <ReadyContext.Provider value={{ ready, reveal: () => setReady(true) }}>
      {children}
    </ReadyContext.Provider>
  );
}

export function useReady() {
  return useContext(ReadyContext);
}
