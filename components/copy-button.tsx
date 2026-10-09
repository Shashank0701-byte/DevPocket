"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export async function copyText(value: string): Promise<boolean> {
  if (value.length === 0) {
    toast.error("Nothing to copy.");
    return false;
  }

  try {
    if (!navigator.clipboard?.writeText) {
      toast.error("Clipboard is not available in this browser.");
      return false;
    }

    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard.");
    return true;
  } catch {
    toast.error("Could not copy to the clipboard.");
    return false;
  }
}

export function CopyButton({
  value,
  label = "Copy",
  iconOnly = false,
}: {
  value: string;
  label?: string;
  iconOnly?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size={iconOnly ? "icon-sm" : "sm"}
      aria-label={label}
      onClick={() => {
        void copyText(value);
      }}
    >
      <Copy />
      {iconOnly ? <span className="sr-only">{label}</span> : label}
    </Button>
  );
}
