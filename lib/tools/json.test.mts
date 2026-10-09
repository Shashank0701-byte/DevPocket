import assert from "node:assert/strict";
import { test } from "node:test";

import { processJson } from "./json.ts";

test("formats and minifies valid JSON", () => {
  const result = processJson('{"a":1,"b":[true,null]}');
  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.minified, '{"a":1,"b":[true,null]}');
  assert.match(result.formatted, /"a": 1/);
  assert.match(result.formatted, /\n/);
});

test("rejects empty JSON input", () => {
  assert.deepEqual(processJson("  \n"), {
    ok: false,
    error: "Enter JSON to format.",
  });
});

test("reports line and column for invalid JSON", () => {
  const result = processJson('{\n  "a": 1,\n}');
  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.match(result.error, /line \d+,? column \d+/);
});

test("keeps parser messages that have no position", () => {
  const result = processJson("undefined");
  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.match(result.error, /JSON|token|undefined/i);
});
