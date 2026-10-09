"use client";

import { useCallback, useState } from "react";

import { copyText, CopyButton } from "@/components/copy-button";
import { useHistory } from "@/components/history/history-provider";
import { ToolHeader } from "@/components/tools/tool-header";
import { Button } from "@/components/ui/button";
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
import { generateUuids, isUuidV4 } from "@/lib/tools/uuid";

const tool = toolById("uuid");
const counts = [
  { value: "1", label: "1 UUID" },
  { value: "5", label: "5 UUIDs" },
  { value: "10", label: "10 UUIDs" },
  { value: "20", label: "20 UUIDs" },
];

export function UuidGenerator() {
  const { pending } = useHistory();
  const restored = pending?.tool === "uuid" ? pending : null;
  const initialValues = (restored?.payload ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return (
    <UuidEditor key={restored?.id ?? "current"} initialValues={initialValues} />
  );
}

function UuidEditor({ initialValues }: { initialValues: string[] }) {
  const { addEntry } = useHistory();
  const [count, setCount] = useState("5");
  const [values, setValues] = useState(initialValues);

  const generate = useCallback(() => {
    const next = generateUuids(Number(count));
    setValues(next);
    addEntry("uuid", next.join("\n"));
  }, [addEntry, count]);

  usePrimaryShortcut(generate);

  return (
    <section>
      <ToolHeader title={tool.title} description={tool.description} />
      <div className="mb-4 flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="uuid-count">Count</Label>
          <Select
            items={counts}
            value={count}
            onValueChange={(value) => {
              if (value) setCount(value);
            }}
          >
            <SelectTrigger id="uuid-count" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {counts.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="button" onClick={generate}>
          Generate
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void copyText(values.join("\n"));
          }}
        >
          Copy all
        </Button>
      </div>

      {values.length === 0 ? (
        <p className="rounded-lg border border-dashed px-3 py-8 text-center text-sm text-muted-foreground">
          Generate a batch to copy version 4 UUIDs.
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border">
          {values.map((value, index) => (
            <li key={`${value}-${index}`} className="flex items-center gap-2 px-3 py-2">
              <code className="min-w-0 flex-1 truncate font-mono text-sm">{value}</code>
              {isUuidV4(value) ? null : (
                <span className="text-xs text-destructive">Invalid</span>
              )}
              <CopyButton value={value} label={`Copy ${value}`} iconOnly />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
