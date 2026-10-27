import { describe, expect, test } from "bun:test";
import { parse } from "../src/parse";

describe("parse", () => {
  test("reads open and done items, numbering from 1 in order", () => {
    expect(parse("- [ ] buy milk\n- [x] call mum")).toEqual({
      ok: true,
      list: [
        { id: 1, title: "buy milk", status: "open" },
        { id: 2, title: "call mum", status: "done" },
      ],
    });
  });

  test("accepts a capital X and trims the title", () => {
    const result = parse("- [X]   call mum  ");
    expect(result).toEqual({
      ok: true,
      list: [{ id: 1, title: "call mum", status: "done" }],
    });
  });

  test("skips blank lines without spending an id", () => {
    const result = parse("\n- [ ] a\n   \n\r\n- [x] b\n");
    expect(result.ok && result.list.map((task) => task.id)).toEqual([1, 2]);
  });

  test("splits on CRLF", () => {
    const result = parse("- [ ] a\r\n- [ ] b");
    expect(result.ok && result.list.map((task) => task.title)).toEqual(["a", "b"]);
  });

  test("empty input is an empty list", () => {
    expect(parse("")).toEqual({ ok: true, list: [] });
  });

  test("a non-checklist line is an error naming its 1-based line", () => {
    expect(parse("- [ ] a\n\nnot a task\n- [ ] b")).toEqual({
      ok: false,
      error: { kind: "not-a-checklist-item", line: 3, text: "not a task" },
    });
  });

  const notItems = [
    "* [ ] star bullet",
    "  - [ ] indented",
    "- [ ]",
    "- [ ]   ",
    "- [y] odd box",
    "-[ ] no space",
  ];

  test.each(notItems)("rejects %p", (line) => {
    expect(parse(line)).toEqual({
      ok: false,
      error: { kind: "not-a-checklist-item", line: 1, text: line },
    });
  });

  test("stops at the first bad line", () => {
    const result = parse("oops\nalso bad");
    expect(!result.ok && result.error.line).toBe(1);
  });
});
