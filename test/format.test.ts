import { expect, test } from "bun:test";
import { format } from "../src/format";
import { add, markDone } from "../src/list";

test("format shows a box per task", () => {
  const list = markDone(add(add([], "a"), "b"), 2);
  expect(format(list)).toBe("[ ] 1. a\n[x] 2. b");
});

test("format says when there is nothing", () => {
  expect(format([])).toBe("no tasks");
});
