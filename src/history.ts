export type History<T> = {
  readonly past: readonly T[];
  readonly present: T;
  readonly future: readonly T[];
};

export const start = <T>(present: T): History<T> => ({
  past: [],
  present,
  future: [],
});

export const record = <T>(history: History<T>, next: T): History<T> => ({
  past: [...history.past, history.present],
  present: next,
  future: [],
});

export const undo = <T>(history: History<T>): History<T> => {
  if (history.past.length === 0) return history;
  const previous = history.past[history.past.length - 1] as T;
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future],
  };
};

export const redo = <T>(history: History<T>): History<T> => {
  if (history.future.length === 0) return history;
  const [next, ...rest] = history.future;
  return {
    past: [...history.past, history.present],
    present: next as T,
    future: rest,
  };
};
