import { useMemo } from 'react';
import { UseStateful } from './useStateful';
import useArrayArray from './array/useArray';

export type UseArray<T> = UseStateful<T[]> & {
  add: (value: T) => void;
  clear: () => void;
  move: (from: number, to: number) => void;
  removeById: (id: T extends { id: string } ? string : T extends { id: number } ? number : unknown) => void;
  removeIndex: (index: number) => void;
};

export function useArray<T = any>(initial: T[]): UseArray<T> {
  const [value, actions] = useArrayArray(initial);
  return useMemo(
    () => ({
      value,
      ...actions,
    }),
    [actions, value],
  );
}

export default useArray;
