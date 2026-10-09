"use client";

import { useCallback, useState } from "react";

import { CopyButton } from "@/components/copy-button";
import { useHistory } from "@/components/history/history-provider";
import { ErrorCallout, ToolHeader } from "@/components/tools/tool-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePrimaryShortcut } from "@/hooks/use-primary-shortcut";
import { toolById } from "@/lib/catalog";
import {
  convertDateTimeLocal,
  convertUnix,
  timestampInputForUnit,
  type TimestampSuccess,
  type TimestampUnit,
} from "@/lib/tools/timestamp";

const tool = toolById("timestamp");

const units: { value: TimestampUnit; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "seconds", label: "Seconds" },
  { value: "milliseconds", label: "Milliseconds" },
];

type TimestampPayload = {
  source: "unix" | "date";
  input: string;
  unit: TimestampUnit;
};

function parsePayload(payload: string): TimestampPayload | null {
  try {
    const value = JSON.parse(payload) as Partial<TimestampPayload>;
    if (
      (value.source === "unix" || value.source === "date") &&
      typeof value.input === "string" &&
      (value.unit === "auto" ||
        value.unit === "seconds" ||
        value.unit === "milliseconds")
    ) {
      return {
        source: value.source,
        input: value.input,
        unit: value.unit,
      };
    }
  } catch {
    return null;
  }

  return null;
}

type EditorState = {
  unixInput: string;
  unit: TimestampUnit;
  dateInput: string;
  result: TimestampSuccess | null;
  error: string | null;
};

function stateFromPayload(payload: string | null): EditorState {
  const empty: EditorState = {
    unixInput: "",
    unit: "auto",
    dateInput: "",
    result: null,
    error: null,
  };

  if (!payload) {
    return empty;
  }

  const parsed = parsePayload(payload);
  if (!parsed) {
    return { ...empty, error: "That history entry could not be restored." };
  }

  if (parsed.source === "date") {
    const converted = convertDateTimeLocal(parsed.input);
    if (!converted.ok) {
      return {
        ...empty,
        unit: parsed.unit,
        dateInput: parsed.input,
        error: converted.error,
      };
    }

    return {
      unixInput: timestampInputForUnit(converted, parsed.unit),
      unit: parsed.unit,
      dateInput: parsed.input,
      result: converted,
      error: null,
    };
  }

  const converted = convertUnix(parsed.input, parsed.unit);
  if (!converted.ok) {
    return {
      ...empty,
      unit: parsed.unit,
      unixInput: parsed.input,
      error: converted.error,
    };
  }

  return {
    unixInput: parsed.input.trim(),
    unit: parsed.unit,
    dateInput: converted.dateTimeLocal,
    result: converted,
    error: null,
  };
}

export function TimestampConverter() {
  const { pending } = useHistory();
  const restored = pending?.tool === "timestamp" ? pending : null;
  return (
    <TimestampEditor
      key={restored?.id ?? "current"}
      initialPayload={restored?.payload ?? null}
    />
  );
}

function TimestampEditor({ initialPayload }: { initialPayload: string | null }) {
  const { addEntry } = useHistory();
  const [initial] = useState(() => stateFromPayload(initialPayload));
  const [unixInput, setUnixInput] = useState(initial.unixInput);
  const [unit, setUnit] = useState<TimestampUnit>(initial.unit);
  const [dateInput, setDateInput] = useState(initial.dateInput);
  const [result, setResult] = useState<TimestampSuccess | null>(initial.result);
  const [error, setError] = useState<string | null>(initial.error);

  const applyUnix = useCallback(
    (input: string, nextUnit: TimestampUnit, record: boolean) => {
      const converted = convertUnix(input, nextUnit);
      if (!converted.ok) {
        setResult(null);
        setError(converted.error);
        return;
      }

      setUnixInput(input.trim());
      setDateInput(converted.dateTimeLocal);
      setResult(converted);
      setError(null);
      if (record) {
        addEntry(
          "timestamp",
          JSON.stringify({
            source: "unix",
            input: input.trim(),
            unit: nextUnit,
          } satisfies TimestampPayload),
        );
      }
    },
    [addEntry],
  );

  const applyDate = useCallback(
    (input: string, nextUnit: TimestampUnit, record: boolean) => {
      const converted = convertDateTimeLocal(input);
      if (!converted.ok) {
        setResult(null);
        setError(converted.error);
        return;
      }

      setDateInput(input);
      setUnixInput(timestampInputForUnit(converted, nextUnit));
      setResult(converted);
      setError(null);
      if (record) {
        addEntry(
          "timestamp",
          JSON.stringify({
            source: "date",
            input,
            unit: nextUnit,
          } satisfies TimestampPayload),
        );
      }
    },
    [addEntry],
  );

  const convertCurrent = useCallback(() => {
    applyUnix(unixInput, unit, true);
  }, [applyUnix, unixInput, unit]);

  usePrimaryShortcut(convertCurrent);

  const rows = result
    ? [
        { label: "Local", value: result.local },
        { label: "UTC", value: result.isoUtc },
        { label: "Seconds", value: String(result.seconds) },
        { label: "Milliseconds", value: String(result.milliseconds) },
      ]
    : [];

  return (
    <section>
      <ToolHeader title={tool.title} description={tool.description} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-xl border p-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="unix-input">Unix timestamp</Label>
            <Input
              id="unix-input"
              inputMode="decimal"
              value={unixInput}
              placeholder="1700000000"
              spellCheck={false}
              onChange={(event) => setUnixInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  convertCurrent();
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="unix-unit">Unit</Label>
            <Select
              items={units}
              value={unit}
              onValueChange={(value) => {
                if (
                  value === "auto" ||
                  value === "seconds" ||
                  value === "milliseconds"
                ) {
                  setUnit(value);
                }
              }}
            >
              <SelectTrigger id="unix-unit" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Auto treats 13 or more digits as milliseconds and shorter values as seconds.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={convertCurrent}>
              Convert
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const now = Date.now();
                const input =
                  unit === "milliseconds" ? String(now) : String(Math.trunc(now / 1000));
                applyUnix(input, unit, true);
              }}
            >
              Use now
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border p-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date-input">Local date and time</Label>
            <Input
              id="date-input"
              type="datetime-local"
              step={1}
              value={dateInput}
              onChange={(event) => setDateInput(event.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            The date field uses your local timezone. UTC is shown in the result.
          </p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => applyDate(dateInput, unit, true)}
          >
            Convert date
          </Button>
        </div>
      </div>

      <div className="mt-4">
        {error ? <ErrorCallout message={error} /> : null}
        {rows.length > 0 ? (
          <dl className="divide-y divide-border overflow-hidden rounded-lg border">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center"
              >
                <dt className="w-28 shrink-0 text-xs text-muted-foreground">{row.label}</dt>
                <dd className="min-w-0 flex-1 font-mono text-sm break-all">{row.value}</dd>
                <CopyButton value={row.value} label={`Copy ${row.label}`} iconOnly />
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
