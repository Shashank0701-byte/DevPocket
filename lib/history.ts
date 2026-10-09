export const HISTORY_KEY = "devpocket-history";
export const HISTORY_LIMIT = 25;

export const TOOL_IDS = ["json", "base64", "uuid", "timestamp"] as const;
export type ToolId = (typeof TOOL_IDS)[number];

export type HistoryEntry = {
  id: string;
  tool: ToolId;
  preview: string;
  payload: string;
  createdAt: number;
};

export function createHistoryEntry(
  tool: ToolId,
  payload: string,
  now = Date.now(),
): HistoryEntry {
  return {
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    tool,
    preview: previewText(payload),
    payload,
    createdAt: now,
  };
}

export function pushHistory(
  entries: HistoryEntry[],
  entry: HistoryEntry,
): HistoryEntry[] {
  const [latest] = entries;
  if (latest && latest.tool === entry.tool && latest.payload === entry.payload) {
    return entries;
  }

  return [entry, ...entries].slice(0, HISTORY_LIMIT);
}

export function parseHistory(raw: string | null): HistoryEntry[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isHistoryEntry).slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
}

const HISTORY_EVENT = "devpocket-history-change";
const EMPTY_HISTORY: HistoryEntry[] = [];

let snapshotRaw: string | null = null;
let snapshotEntries: HistoryEntry[] = EMPTY_HISTORY;

export function subscribeHistory(onStoreChange: () => void): () => void {
  window.addEventListener(HISTORY_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(HISTORY_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function getHistorySnapshot(): HistoryEntry[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(HISTORY_KEY);
  } catch {
    raw = null;
  }

  if (raw === snapshotRaw) {
    return snapshotEntries;
  }

  snapshotRaw = raw;
  snapshotEntries = parseHistory(raw);
  return snapshotEntries;
}

export function getHistoryServerSnapshot(): HistoryEntry[] {
  return EMPTY_HISTORY;
}

export function writeHistory(entries: HistoryEntry[]): boolean {
  try {
    const raw = JSON.stringify(entries);
    window.localStorage.setItem(HISTORY_KEY, raw);
    snapshotRaw = raw;
    snapshotEntries = entries;
    window.dispatchEvent(new Event(HISTORY_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function clearHistoryStorage(): void {
  try {
    window.localStorage.removeItem(HISTORY_KEY);
  } catch {
    return;
  }

  snapshotRaw = null;
  snapshotEntries = EMPTY_HISTORY;
  window.dispatchEvent(new Event(HISTORY_EVENT));
}

function previewText(payload: string): string {
  const singleLine = payload.replace(/\s+/g, " ").trim();
  if (singleLine.length === 0) {
    return "(empty)";
  }

  return singleLine.length > 72 ? `${singleLine.slice(0, 69)}…` : singleLine;
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Partial<HistoryEntry>;
  return (
    typeof entry.id === "string" &&
    typeof entry.tool === "string" &&
    TOOL_IDS.includes(entry.tool as ToolId) &&
    typeof entry.preview === "string" &&
    typeof entry.payload === "string" &&
    typeof entry.createdAt === "number"
  );
}
