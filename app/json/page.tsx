import type { Metadata } from "next";

import { JsonFormatter } from "@/components/tools/json-formatter";

export const metadata: Metadata = {
  title: "JSON Formatter",
};

export default function JsonPage() {
  return <JsonFormatter />;
}
