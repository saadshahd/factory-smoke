export type Status = "open" | "done";

export type Task = {
  readonly id: number;
  readonly title: string;
  readonly status: Status;
};

export const createTask = (id: number, title: string): Task => {
  const trimmed = title.trim();
  if (trimmed === "") throw new Error("task title is empty");
  return { id, title: trimmed, status: "open" };
};

export const complete = (task: Task): Task => ({ ...task, status: "done" });
