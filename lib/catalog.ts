import { Binary, Braces, Clock, Fingerprint, type LucideIcon } from "lucide-react";

import type { ToolId } from "@/lib/history";

export type ToolDefinition = {
  id: ToolId;
  href: string;
  title: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const tools: ToolDefinition[] = [
  {
    id: "json",
    href: "/json",
    title: "JSON Formatter",
    label: "JSON",
    description:
      "Format, minify, and validate JSON, with parse errors that point to the line and column.",
    icon: Braces,
  },
  {
    id: "base64",
    href: "/base64",
    title: "Base64",
    label: "Base64",
    description:
      "Encode and decode UTF-8 text, including characters outside the ASCII range.",
    icon: Binary,
  },
  {
    id: "uuid",
    href: "/uuid",
    title: "UUID Generator",
    label: "UUID",
    description: "Create version 4 UUIDs and copy one value or the whole batch.",
    icon: Fingerprint,
  },
  {
    id: "timestamp",
    href: "/timestamp",
    title: "Timestamp Converter",
    label: "Timestamp",
    description:
      "Turn Unix time into local and UTC dates, and convert a date back to seconds or milliseconds.",
    icon: Clock,
  },
];

export function toolById(id: ToolId): ToolDefinition {
  const tool = tools.find((item) => item.id === id);
  if (!tool) {
    throw new Error(`Unknown tool: ${id}`);
  }

  return tool;
}

export function toolByPath(pathname: string): ToolDefinition | undefined {
  return tools.find((tool) => pathname === tool.href || pathname.startsWith(`${tool.href}/`));
}
