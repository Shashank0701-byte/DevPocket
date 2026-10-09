export type Base64Result =
  | { ok: true; value: string }
  | { ok: false; error: string };

export function encodeBase64(input: string): Base64Result {
  if (input.length === 0) {
    return { ok: false, error: "Enter text to encode." };
  }

  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return { ok: true, value: btoa(binary) };
}

export function decodeBase64(input: string): Base64Result {
  const compact = input.trim().replace(/\s+/g, "");
  if (compact.length === 0) {
    return { ok: false, error: "Enter Base64 to decode." };
  }

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(compact) || compact.length % 4 === 1) {
    return { ok: false, error: "That value is not valid Base64." };
  }

  const padded =
    compact.length % 4 === 0
      ? compact
      : compact + "=".repeat(4 - (compact.length % 4));

  try {
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const value = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return { ok: true, value };
  } catch {
    return { ok: false, error: "That value is not valid Base64." };
  }
}
