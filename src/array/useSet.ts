import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';

export type UseSetActions<T> = {
  setValue: Dispatch<SetStateAction<Set<T>>>;
  add: (a: T) => void;
  remove: (a: T) => void;
  clear: Set<T>['clear'];
};

export type UseSet<T> = [Set<T>, UseSetActions<T>];

const clone = <T>(value: Set<T>) => new Set<T>(value);

export function useSet<T>(initialState: Set<T> = new Set()): UseSet<T> {
  const [value, setValue] = useState(initialState);
  const add = useCallback((item: T) => {
    setValue((prevValue) => {
      const copy = clone(prevValue);
      copy.add(item);
      return copy;
    });
  }, []);

  const remove = useCallback((item: T) => {
    setValue((prevValue) => {
      const copy = clone(prevValue);
      copy.delete(item);
      return copy;
    });
  }, []);

  const clear = useCallback(() => {
    setValue((prevValue) => {
      const copy = clone(prevValue);
      copy.clear();
      return copy;
    });
  }, []);

  const actions: UseSetActions<T> = useMemo(
    () => ({
      setValue,
      add,
      remove,
      clear,
    }),
    [add, clear, remove],
  );

  return useMemo(() => [value, actions], [value, actions]);
}
