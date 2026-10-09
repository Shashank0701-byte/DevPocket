"use client";

import { useCallback, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

import { CopyButton } from "@/components/copy-button";
import { useHistory } from "@/components/history/history-provider";
import { ErrorCallout, fieldClassName, ToolHeader } from "@/components/tools/tool-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePrimaryShortcut } from "@/hooks/use-primary-shortcut";
import { toolById } from "@/lib/catalog";
import { decodeBase64, encodeBase64 } from "@/lib/tools/base64";

const tool = toolById("base64");

export function Base64Tool() {
  const { pending } = useHistory();
  const restored = pending?.tool === "base64" ? pending : null;
  return (
    <Base64Editor
      key={restored?.id ?? "current"}
      initialInput={restored?.payload ?? ""}
      restored={restored !== null}
    />
  );
}

function Base64Editor({
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
    (mode: "encode" | "decode") => {
      const result = mode === "encode" ? encodeBase64(input) : decodeBase64(input);
      if (!result.ok) {
        setOutput("");
        setError(result.error);
        setStatus(null);
        return;
      }

      setOutput(result.value);
      setError(null);
      setStatus(mode === "encode" ? "Encoded." : "Decoded.");
      addEntry("base64", input);
    },
    [addEntry, input],
  );

  usePrimaryShortcut(
    useCallback(() => {
      run("encode");
    }, [run]),
  );

  return (
    <section>
      <ToolHeader title={tool.title} description={tool.description} />
      <div className="mb-3 flex flex-wrap gap-2">
        <Button type="button" onClick={() => run("encode")}>
          Encode
        </Button>
        <Button type="button" variant="secondary" onClick={() => run("decode")}>
          Decode
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (output.length === 0) {
              toast.error("Nothing to swap.");
              return;
            }
            setInput(output);
            setOutput(input);
            setError(null);
            setStatus("Swapped input and output.");
          }}
        >
          <ArrowLeftRight />
          Swap
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
          <Label htmlFor="base64-input">Input</Label>
          <Textarea
            id="base64-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Text to encode, or Base64 to decode"
            spellCheck={false}
            className={fieldClassName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="base64-output">Output</Label>
            <CopyButton value={output} />
          </div>
          <Textarea
            id="base64-output"
            readOnly
            value={output}
            placeholder="Encoded or decoded text appears here."
            spellCheck={false}
            className={fieldClassName}
          />
        </div>
      </div>
    </section>
  );
}
