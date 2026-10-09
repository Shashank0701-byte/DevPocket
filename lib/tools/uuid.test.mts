import assert from "node:assert/strict";
import { test } from "node:test";

import { clampUuidCount, generateUuids, isUuidV4 } from "./uuid.ts";

test("clamps the UUID count", () => {
  assert.equal(clampUuidCount(0), 1);
  assert.equal(clampUuidCount(5.9), 5);
  assert.equal(clampUuidCount(100), 20);
  assert.equal(clampUuidCount(Number.NaN), 1);
});

test("generates version 4 UUIDs", () => {
  const values = generateUuids(5);
  assert.equal(values.length, 5);
  assert.equal(new Set(values).size, 5);
  for (const value of values) {
    assert.equal(isUuidV4(value), true);
  }
});
