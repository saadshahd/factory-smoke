import { describe, expect, test } from "bun:test";
import { add, markDone, open } from "../src/list";

describe("list", () => {
  test("add gives each task the next id", () => {
    const list = add(add([], "buy milk"), "call mum");
    expect(list.map((task) => task.id)).toEqual([1, 2]);
  });

  test("add trims the title and refuses an empty one", () => {
    expect(add([], "  buy milk ")[0]?.title).toBe("buy milk");
    expect(() => add([], "   ")).toThrow("task title is empty");
  });

  test("markDone closes one task and leaves the rest open", () => {
    const list = markDone(add(add([], "a"), "b"), 1);
    expect(open(list).map((task) => task.title)).toEqual(["b"]);
  });

  test("markDone refuses an unknown id", () => {
    expect(() => markDone([], 7)).toThrow("no task 7");
  });
});
