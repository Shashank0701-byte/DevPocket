import assert from "node:assert/strict";
import { test } from "node:test";

import { decodeBase64, encodeBase64 } from "./base64.ts";

test("round-trips unicode text", () => {
  const text = "héllo 👋";
  const encoded = encodeBase64(text);
  assert.equal(encoded.ok, true);
  if (!encoded.ok) return;

  const decoded = decodeBase64(encoded.value);
  assert.deepEqual(decoded, { ok: true, value: text });
});

test("encodes ASCII text", () => {
  assert.deepEqual(encodeBase64("hello"), { ok: true, value: "aGVsbG8=" });
});

test("rejects empty encode and decode input", () => {
  assert.deepEqual(encodeBase64(""), {
    ok: false,
    error: "Enter text to encode.",
  });
  assert.deepEqual(decodeBase64("   "), {
    ok: false,
    error: "Enter Base64 to decode.",
  });
});

test("rejects invalid Base64", () => {
  const result = decodeBase64("!!!!");
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error, "That value is not valid Base64.");
});

test("decodes Base64 with missing padding and whitespace", () => {
  assert.deepEqual(decodeBase64("aGVs bG8"), { ok: true, value: "hello" });
});

test("rejects bytes that are not valid UTF-8", () => {
  const result = decodeBase64("/w==");
  assert.equal(result.ok, false);
});
