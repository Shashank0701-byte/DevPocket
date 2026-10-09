import assert from "node:assert/strict";
import { test } from "node:test";

import {
  convertDateTimeLocal,
  convertUnix,
  detectUnit,
  timestampInputForUnit,
} from "./timestamp.ts";

test("detects seconds and milliseconds", () => {
  assert.equal(detectUnit("1700000000"), "seconds");
  assert.equal(detectUnit("1700000000000"), "milliseconds");
  assert.equal(detectUnit("-1700000000000"), "milliseconds");
});

test("converts seconds, milliseconds, and auto", () => {
  const seconds = convertUnix("1700000000", "seconds");
  const millis = convertUnix("1700000000000", "milliseconds");
  const auto = convertUnix("1700000000000", "auto");

  assert.equal(seconds.ok, true);
  assert.equal(millis.ok, true);
  assert.equal(auto.ok, true);
  if (!seconds.ok || !millis.ok || !auto.ok) return;

  assert.equal(seconds.isoUtc, "2023-11-14T22:13:20.000Z");
  assert.equal(seconds.seconds, 1700000000);
  assert.equal(seconds.milliseconds, 1700000000000);
  assert.equal(millis.isoUtc, seconds.isoUtc);
  assert.equal(auto.isoUtc, seconds.isoUtc);
  assert.ok(seconds.local.length > 0);
});

test("rejects empty, non-numeric, and out-of-range timestamps", () => {
  assert.equal(convertUnix("  ", "auto").ok, false);
  assert.equal(convertUnix("12abc", "seconds").ok, false);
  assert.equal(convertUnix("1e10", "seconds").ok, false);
  assert.equal(convertUnix("-1", "seconds").ok, true);
  assert.equal(convertUnix("300000000000000", "milliseconds").ok, false);
});

test("converts a local date back to unix time", () => {
  const value = "2024-01-15T12:30:45";
  const result = convertDateTimeLocal(value);
  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.milliseconds, new Date(value).getTime());
  assert.equal(result.seconds, Math.trunc(new Date(value).getTime() / 1000));
  assert.equal(timestampInputForUnit(result, "seconds"), String(result.seconds));
  assert.equal(
    timestampInputForUnit(result, "milliseconds"),
    String(result.milliseconds),
  );
});

test("rejects an empty date", () => {
  assert.deepEqual(convertDateTimeLocal("  "), {
    ok: false,
    error: "Choose a date and time.",
  });
});
