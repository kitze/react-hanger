import { useCallback, useMemo, useState } from 'react';
import { UseStateful } from './useStateful';

export type UseArray<T> = UseStateful<T[]> & {
  add: (value: T) => void;
  clear: () => void;
  move: (from: number, to: number) => void;
  removeById: (id: T extends { id: string } ? string : T extends { id: number } ? number : unknown) => void;
  removeIndex: (index: number) => void;
};

export function useArray<T = any>(initial: T[]): UseArray<T> {
  const [value, setValue] = useState(initial);
  const add = useCallback(a => setValue(v => [...v, a]), []);
  const move = useCallback(
    (from: number, to: number) =>
      setValue(it => {
        const copy = it.slice();
        copy.splice(to < 0 ? copy.length + to : to, 0, copy.splice(from, 1)[0]);
        return copy;
      }),
    [],
  );
  const clear = useCallback(() => setValue(() => []), []);
  const removeById = useCallback(
    // @ts-ignore not every array that you will pass down will have object with id field.
    id => setValue(arr => arr.filter(v => v && v.id !== id)),
    [],
  );
  const removeIndex = useCallback(
    index =>
      setValue(v => {
        const copy = v.slice();
        copy.splice(index, 1);
        return copy;
      }),
    [],
  );
  return useMemo(
    () => ({
      value,
      setValue,
      add,
      move,
      clear,
      removeById,
      removeIndex,
    }),
    [add, clear, move, removeById, removeIndex, value],
  );
}

export default useArray;
