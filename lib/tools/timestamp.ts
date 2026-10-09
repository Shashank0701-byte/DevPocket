export type TimestampUnit = "seconds" | "milliseconds" | "auto";

export type TimestampSuccess = {
  ok: true;
  seconds: number;
  milliseconds: number;
  isoUtc: string;
  local: string;
  dateTimeLocal: string;
};

export type TimestampResult =
  | TimestampSuccess
  | { ok: false; error: string };

const MIN_MS = Date.UTC(1, 0, 1);
const MAX_MS = Date.UTC(9999, 11, 31, 23, 59, 59, 999);

export function detectUnit(raw: string): "seconds" | "milliseconds" {
  const digits = raw.trim().replace(/^[+-]/, "").split(".")[0] ?? "";
  return digits.length >= 13 ? "milliseconds" : "seconds";
}

export function convertUnix(
  input: string,
  unit: TimestampUnit,
): TimestampResult {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: "Enter a Unix timestamp." };
  }

  if (!/^[+-]?\d+(\.\d+)?$/.test(trimmed)) {
    return { ok: false, error: "Enter a numeric Unix timestamp." };
  }

  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return { ok: false, error: "That timestamp is out of range." };
  }

  const resolved = unit === "auto" ? detectUnit(trimmed) : unit;
  const milliseconds = resolved === "milliseconds" ? value : value * 1000;
  return fromMilliseconds(milliseconds);
}

export function convertDateTimeLocal(value: string): TimestampResult {
  if (value.trim().length === 0) {
    return { ok: false, error: "Choose a date and time." };
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: "That date is invalid." };
  }

  return fromMilliseconds(date.getTime());
}

export function timestampInputForUnit(
  result: TimestampSuccess,
  unit: TimestampUnit,
): string {
  if (unit === "milliseconds") {
    return String(result.milliseconds);
  }

  return String(result.seconds);
}

function fromMilliseconds(milliseconds: number): TimestampResult {
  if (!Number.isFinite(milliseconds) || milliseconds < MIN_MS || milliseconds > MAX_MS) {
    return { ok: false, error: "That timestamp is out of range." };
  }

  const date = new Date(milliseconds);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: "That timestamp is out of range." };
  }

  return {
    ok: true,
    seconds: Math.trunc(date.getTime() / 1000),
    milliseconds: date.getTime(),
    isoUtc: date.toISOString(),
    local: new Intl.DateTimeFormat(undefined, {
      dateStyle: "full",
      timeStyle: "long",
    }).format(date),
    dateTimeLocal: toDateTimeLocalValue(date),
  };
}

function toDateTimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
