"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SquareTerminal, Trash2 } from "lucide-react";

import { useClientReady, useHistory } from "@/components/history/history-provider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { tools, toolById } from "@/lib/catalog";
import { cn } from "@/lib/utils";

function formatWhen(createdAt: number): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(createdAt);
}

export function SidebarPanel({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { entries, clear, restore } = useHistory();
  const ready = useClientReady();

  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-12 items-center gap-2 border-b px-3">
        <span className="flex size-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <SquareTerminal className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium tracking-tight">DevPocket</p>
          <p className="truncate text-[11px] text-muted-foreground">Local utilities</p>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 p-2" aria-label="Tools">
        <Link
          href="/"
          onClick={onNavigate}
          className={cn(
            "rounded-md px-2 py-1.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            pathname === "/"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
          )}
        >
          Dashboard
        </Link>
        {tools.map((tool) => {
          const active = pathname === tool.href;
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              href={tool.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                active
                  ? "border-l-2 border-primary bg-sidebar-accent pl-1.5 text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{tool.title}</span>
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between px-3 pt-3 pb-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Recent
          </p>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={!ready || entries.length === 0}
            onClick={clear}
          >
            <Trash2 />
            Clear
          </Button>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-0.5 px-2 pb-3">
            {!ready ? (
              <p className="px-2 py-3 text-xs text-muted-foreground">Loading history…</p>
            ) : entries.length === 0 ? (
              <p className="px-2 py-3 text-xs text-muted-foreground">
                Nothing has been run yet.
              </p>
            ) : (
              entries.map((entry) => {
                const tool = toolById(entry.tool);
                return (
                  <button
                    key={entry.id}
                    type="button"
                    className="rounded-md px-2 py-1.5 text-left outline-none hover:bg-sidebar-accent/70 focus-visible:ring-3 focus-visible:ring-ring/50"
                    onClick={() => {
                      restore(entry);
                      router.push(tool.href);
                      onNavigate?.();
                    }}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-primary">{tool.label}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatWhen(entry.createdAt)}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[11px] text-muted-foreground">
                      {entry.preview}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
