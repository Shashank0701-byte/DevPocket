"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { toast } from "sonner";

import {
  clearHistoryStorage,
  createHistoryEntry,
  getHistoryServerSnapshot,
  getHistorySnapshot,
  pushHistory,
  subscribeHistory,
  writeHistory,
  type HistoryEntry,
  type ToolId,
} from "@/lib/history";

type PendingRestore = {
  id: string;
  tool: ToolId;
  payload: string;
};

type HistoryContextValue = {
  entries: HistoryEntry[];
  pending: PendingRestore | null;
  addEntry: (tool: ToolId, payload: string) => void;
  clear: () => void;
  restore: (entry: HistoryEntry) => void;
};

const HistoryContext = createContext<HistoryContextValue | null>(null);

function subscribeClientReady() {
  return () => {};
}

export function useClientReady() {
  return useSyncExternalStore(subscribeClientReady, () => true, () => false);
}

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const entries = useSyncExternalStore(
    subscribeHistory,
    getHistorySnapshot,
    getHistoryServerSnapshot,
  );
  const [pending, setPending] = useState<PendingRestore | null>(null);

  const addEntry = useCallback((tool: ToolId, payload: string) => {
    const next = pushHistory(getHistorySnapshot(), createHistoryEntry(tool, payload));
    if (next === getHistorySnapshot()) {
      return;
    }

    if (!writeHistory(next)) {
      toast.error("Could not save history in this browser.");
    }
  }, []);

  const clear = useCallback(() => {
    clearHistoryStorage();
    toast.success("History cleared.");
  }, []);

  const restore = useCallback((entry: HistoryEntry) => {
    setPending({
      id: crypto.randomUUID(),
      tool: entry.tool,
      payload: entry.payload,
    });
  }, []);

  const value = useMemo(
    () => ({ entries, pending, addEntry, clear, restore }),
    [entries, pending, addEntry, clear, restore],
  );

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within HistoryProvider.");
  }

  return context;
}
