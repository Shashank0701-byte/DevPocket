import type { Metadata } from "next";

import { UuidGenerator } from "@/components/tools/uuid-generator";

export const metadata: Metadata = {
  title: "UUID Generator",
};

export default function UuidPage() {
  return <UuidGenerator />;
}
