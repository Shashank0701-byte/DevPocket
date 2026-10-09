import type { Metadata } from "next";

import { Base64Tool } from "@/components/tools/base64-tool";

export const metadata: Metadata = {
  title: "Base64",
};

export default function Base64Page() {
  return <Base64Tool />;
}
