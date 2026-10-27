import type { TaskList } from "./list";
import { complete, createTask, type Task } from "./task";

export type ParseError = {
  readonly kind: "not-a-checklist-item";
  readonly line: number;
  readonly text: string;
};

export type ParseResult =
  | { readonly ok: true; readonly list: TaskList }
  | { readonly ok: false; readonly error: ParseError };

const item = /^- \[([ xX])\] (.*\S.*)$/;

const toTask = (id: number, box: string, title: string): Task => {
  const task = createTask(id, title);
  return box === " " ? task : complete(task);
};

export const parse = (text: string): ParseResult => {
  const tasks: Task[] = [];
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    if (line.trim() === "") continue;
    const match = item.exec(line);
    if (!match) {
      return { ok: false, error: { kind: "not-a-checklist-item", line: index + 1, text: line } };
    }
    tasks.push(toTask(tasks.length + 1, match[1]!, match[2]!));
  }
  return { ok: true, list: tasks };
};
