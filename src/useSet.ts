import { useMemo } from 'react';
import { useSet as useSetArray, UseSetActions } from './array/useSet';
import type { UseStateful } from './useStateful';

export interface UseSet<T> extends UseStateful<Set<T>>, UseSetActions<T> {}

export function useSet<T>(initialState: Set<T> = new Set()): UseSet<T> {
  const [value, actions] = useSetArray(initialState);

  return useMemo(() => {
    return {
      value,
      ...actions,
    };
  }, [actions, value]);
}
