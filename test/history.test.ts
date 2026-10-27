import { describe, expect, test } from "bun:test";
import { record, redo, start, undo } from "../src/history";
import { add, markDone, type TaskList } from "../src/list";

const titles = (list: TaskList) => list.map((task) => task.title);

describe("history", () => {
  test("start has nothing to undo or redo", () => {
    const history = start<TaskList>([]);
    expect(undo(history)).toBe(history);
    expect(redo(history)).toBe(history);
  });

  test("undo steps back to the state before the last change", () => {
    const one = record(start<TaskList>([]), add([], "a"));
    const two = record(one, add(one.present, "b"));
    expect(titles(undo(two).present)).toEqual(["a"]);
    expect(undo(undo(two)).present).toEqual([]);
  });

  test("redo steps forward to the undone state", () => {
    const one = record(start<TaskList>([]), add([], "a"));
    const done = record(one, markDone(one.present, 1));
    expect(redo(undo(done))).toEqual(done);
  });

  test("redo with nothing undone leaves the history as it is", () => {
    const history = record(start<TaskList>([]), add([], "a"));
    expect(redo(history)).toBe(history);
  });

  test("undo past the start leaves the history as it is", () => {
    const back = undo(record(start<TaskList>([]), add([], "a")));
    expect(undo(back)).toBe(back);
  });

  test("a change after an undo drops the redo steps", () => {
    const one = record(start<TaskList>([]), add([], "a"));
    const two = record(one, add(one.present, "b"));
    const branched = record(undo(two), add(undo(two).present, "c"));
    expect(branched.future).toEqual([]);
    expect(redo(branched)).toBe(branched);
    expect(titles(branched.present)).toEqual(["a", "c"]);
  });
});
