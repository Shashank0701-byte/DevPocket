"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { CopyButton } from "@/components/copy-button";
import { useHistory } from "@/components/history/history-provider";
import { ErrorCallout, fieldClassName, ToolHeader } from "@/components/tools/tool-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePrimaryShortcut } from "@/hooks/use-primary-shortcut";
import { toolById } from "@/lib/catalog";
import { processJson } from "@/lib/tools/json";

const tool = toolById("json");

export function JsonFormatter() {
  const { pending } = useHistory();
  const restored = pending?.tool === "json" ? pending : null;
  return (
    <JsonEditor
      key={restored?.id ?? "current"}
      initialInput={restored?.payload ?? ""}
      restored={restored !== null}
    />
  );
}

function JsonEditor({
  initialInput,
  restored,
}: {
  initialInput: string;
  restored: boolean;
}) {
  const { addEntry } = useHistory();
  const [input, setInput] = useState(initialInput);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(
    restored ? "Restored from history." : null,
  );

  const run = useCallback(
    (mode: "format" | "minify" | "validate") => {
      const result = processJson(input);
      if (!result.ok) {
        setOutput("");
        setError(result.error);
        setStatus(null);
        return;
      }

      setError(null);
      if (mode === "validate") {
        setStatus("Valid JSON.");
        toast.success("JSON is valid.");
        return;
      }

      const next = mode === "format" ? result.formatted : result.minified;
      setOutput(next);
      setStatus(mode === "format" ? "Formatted." : "Minified.");
      addEntry("json", input);
    },
    [addEntry, input],
  );

  usePrimaryShortcut(
    useCallback(() => {
      run("format");
    }, [run]),
  );

  return (
    <section>
      <ToolHeader title={tool.title} description={tool.description} />
      <div className="mb-3 flex flex-wrap gap-2">
        <Button type="button" onClick={() => run("format")}>
          Format
        </Button>
        <Button type="button" variant="secondary" onClick={() => run("minify")}>
          Minify
        </Button>
        <Button type="button" variant="outline" onClick={() => run("validate")}>
          Validate
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setInput("");
            setOutput("");
            setError(null);
            setStatus(null);
          }}
        >
          Clear
        </Button>
      </div>
      {error ? <div className="mb-3"><ErrorCallout message={error} /></div> : null}
      {status && !error ? (
        <p className="mb-3 text-sm text-muted-foreground">{status}</p>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="json-input">Input</Label>
          <Textarea
            id="json-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder='{"name":"DevPocket"}'
            spellCheck={false}
            className={fieldClassName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="json-output">Output</Label>
            <CopyButton value={output} />
          </div>
          <Textarea
            id="json-output"
            readOnly
            value={output}
            placeholder="Formatted or minified JSON appears here."
            spellCheck={false}
            className={fieldClassName}
          />
        </div>
      </div>
    </section>
  );
}
