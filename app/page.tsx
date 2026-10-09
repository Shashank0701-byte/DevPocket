import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tools } from "@/lib/catalog";

export default function HomePage() {
  return (
    <section>
      <header className="mb-5">
        <h1 className="text-lg font-medium tracking-tight">Developer utilities</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Format JSON, encode Base64, generate UUIDs, and convert timestamps.
          Everything runs in this browser. Nothing is sent to a server.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              href={tool.href}
              className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Card className="h-full transition-colors hover:bg-muted/40">
                <CardHeader>
                  <div className="mb-2 flex size-8 items-center justify-center rounded-md border bg-muted/40 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
