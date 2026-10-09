import type { Metadata } from "next";

import { TimestampConverter } from "@/components/tools/timestamp-converter";

export const metadata: Metadata = {
  title: "Timestamp Converter",
};

export default function TimestampPage() {
  return <TimestampConverter />;
}
