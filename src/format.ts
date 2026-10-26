import type { TaskList } from "./list";

const box = { open: "[ ]", done: "[x]" } as const;

export const format = (list: TaskList): string =>
  list.length === 0
    ? "no tasks"
    : list.map((task) => `${box[task.status]} ${task.id}. ${task.title}`).join("\n");
