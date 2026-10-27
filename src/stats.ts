import { open, type TaskList } from "./list";

export type Stats = {
  readonly open: number;
  readonly done: number;
  readonly percentDone: number;
};

export const stats = (list: TaskList): Stats => {
  const openCount = open(list).length;
  const done = list.length - openCount;
  return {
    open: openCount,
    done,
    percentDone: list.length === 0 ? 0 : Math.round((done / list.length) * 100),
  };
};
