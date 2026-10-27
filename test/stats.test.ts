import { describe, expect, test } from "bun:test";
import { add, markDone } from "../src/list";
import { stats } from "../src/stats";

describe("stats", () => {
  test("an empty list has nothing open, nothing done and 0 percent", () => {
    expect(stats([])).toEqual({ open: 0, done: 0, percentDone: 0 });
  });

  test("counts open and done tasks", () => {
    const list = markDone(add(add(add([], "a"), "b"), "c"), 2);
    expect(stats(list)).toEqual({ open: 2, done: 1, percentDone: 33 });
  });

  test("rounds the share done to the nearest whole percent", () => {
    const list = markDone(markDone(add(add(add([], "a"), "b"), "c"), 1), 2);
    expect(stats(list).percentDone).toBe(67);
  });

  test("a fully done list is 100 percent", () => {
    expect(stats(markDone(add([], "a"), 1))).toEqual({ open: 0, done: 1, percentDone: 100 });
  });
});
