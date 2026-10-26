import { complete, createTask, type Task } from "./task";

export type TaskList = readonly Task[];

const nextId = (list: TaskList): number =>
  list.reduce((max, task) => Math.max(max, task.id), 0) + 1;

export const add = (list: TaskList, title: string): TaskList => [
  ...list,
  createTask(nextId(list), title),
];

export const markDone = (list: TaskList, id: number): TaskList => {
  if (!list.some((task) => task.id === id)) throw new Error(`no task ${id}`);
  return list.map((task) => (task.id === id ? complete(task) : task));
};

export const open = (list: TaskList): TaskList =>
  list.filter((task) => task.status === "open");
