import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createHistoryEntry,
  HISTORY_LIMIT,
  parseHistory,
  pushHistory,
  type HistoryEntry,
} from "./history.ts";

test("previews timestamp payloads by their input", () => {
  const entry = createHistoryEntry(
    "timestamp",
    JSON.stringify({ source: "unix", input: "1700000000", unit: "seconds" }),
    1,
  );
  assert.equal(entry.preview, "1700000000 s");
});

test("previews and dedupes history", () => {
  const first = createHistoryEntry("json", '{\n  "a": 1\n}', 1000);
  assert.equal(first.preview, '{ "a": 1 }');

  const duplicate = createHistoryEntry("json", '{\n  "a": 1\n}', 2000);
  const next = pushHistory([first], duplicate);
  assert.equal(next.length, 1);

  const other = createHistoryEntry("base64", "hello", 3000);
  const added = pushHistory(next, other);
  assert.deepEqual(
    added.map((entry) => entry.tool),
    ["base64", "json"],
  );
});

test("keeps the newest 25 entries", () => {
  let entries: HistoryEntry[] = [];
  for (let index = 0; index < 30; index += 1) {
    entries = pushHistory(
      entries,
      createHistoryEntry("uuid", `value-${index}`, index),
    );
  }

  assert.equal(entries.length, HISTORY_LIMIT);
  assert.equal(entries[0]?.payload, "value-29");
  assert.equal(entries.at(-1)?.payload, "value-5");
});

test("parses stored history and drops invalid rows", () => {
  const raw = JSON.stringify([
    {
      id: "1",
      tool: "json",
      preview: "{}",
      payload: "{}",
      createdAt: 1,
    },
    { id: "2", tool: "nope", preview: "x", payload: "x", createdAt: 2 },
    "bad",
  ]);

  const entries = parseHistory(raw);
  assert.equal(entries.length, 1);
  assert.equal(entries[0]?.tool, "json");
  assert.deepEqual(parseHistory("not json"), []);
  assert.deepEqual(parseHistory(null), []);
});
